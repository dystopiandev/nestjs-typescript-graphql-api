import { EntityData, MikroORM } from "@mikro-orm/core";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { Test } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { AuthModule } from "../src/auth/auth.module";
import { AuthService } from "../src/auth/auth.service";
import { Transaction } from "../src/transactions/transaction.entity";
import { TransactionsModule } from "../src/transactions/transactions.module";
import { User } from "../src/users/user.entity";
import { UserModule } from "../src/users/user.module";

vi.mock("../src/config", () => {
  return {
    config: {
      jwtSecret: "test",
    },
  };
});

const endpoint = "/graphql";

describe(endpoint, () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let orm: MikroORM;
  let authService: AuthService;

  const addUserToDatabase = async (
    userData: EntityData<User>,
  ): Promise<User & { rawPassphrase: string }> => {
    const userRepository = orm.em.fork().getRepository(User);

    const newUser = new User({
      ...userData,
      passphrase: await bcrypt.hash(userData.passphrase, 10),
    });

    await userRepository.getEntityManager().persistAndFlush(newUser);

    return {
      ...newUser,
      id: newUser._id.toString(),
      rawPassphrase: userData.passphrase,
    } as User & { rawPassphrase: string };
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const moduleRef = await Test.createTestingModule({
      imports: [
        MikroOrmModule.forRoot({
          autoLoadEntities: true,
          type: "mongo",
          clientUrl: mongod.getUri(),
          connect: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          playground: false,
        }),
        UserModule,
        AuthModule,
        TransactionsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.enableShutdownHooks();
    await app.init();

    orm = moduleRef.get(MikroORM);
    authService = moduleRef.get(AuthService);
  });

  afterEach(async () => {
    await orm.em.fork().getRepository(Transaction).nativeDelete({});
    await orm.em.fork().getRepository(User).nativeDelete({});
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe("mutations", () => {
    it("registerUser", async () => {
      // Arrange
      const user = {
        name: "user123",
        email: "user123@os.cpu",
        passphrase: "passphrase",
      };

      // Act
      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          query: `
          mutation RegisterUser($name: String!, $email: String!, $passphrase: String!) {
            registerUser(createUserInput: { name: $name, email: $email, passphrase: $passphrase })
          }
        `,
          variables: user,
        })

        // Assert
        .expect(async (res) => {
          expect(res.body.data.registerUser).toBe(true);
          expect(await orm.em.fork().getRepository(User).findAll()).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                name: user.name,
                email: user.email,
              }),
            ]),
          );
        })
        .expect(200);

      const createdUser = await orm.em
        .fork()
        .getRepository(User)
        .findOne({ email: user.email });

      expect(createdUser).toEqual(
        expect.objectContaining({
          name: user.name,
          email: user.email,
        }),
      );
    });

    it("login", async () => {
      // Arrange
      const user = await addUserToDatabase({
        name: "user456",
        email: "user456@os.cpu",
        passphrase: "passphrase",
      });

      // Act
      await request(app.getHttpServer())
        .post(endpoint)
        .send({
          query: `
          mutation Login($email: String!, $passphrase: String!) {
            login(loginInput: { email: $email, passphrase: $passphrase }) {
              accessToken
            }
          }
        `,
          variables: {
            email: user.email,
            passphrase: user.rawPassphrase,
          },
        })

        // Assert
        .expect((res) => {
          expect(res.body.data.login.accessToken).toBeDefined();
          expect(typeof res.body.data.login.accessToken).toBe("string");
        })
        .expect(200);
    });

    it("createTransaction", async () => {
      // Arrange
      const user = await addUserToDatabase({
        name: "user789",
        email: "user789@os.cpu",
        passphrase: "passphrase",
      });
      const { accessToken } = await authService.login(user);
      const transactionRepository = orm.em.fork().getRepository(Transaction);
      const transactionInput = {
        amount: 100,
        type: "deposit",
      };

      // Act
      await request(app.getHttpServer())
        .post(endpoint)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          query: `
            mutation CreateTransaction($createTransactionInput: CreateTransactionInput!) {
              createTransaction(createTransactionInput: $createTransactionInput)
            }
          `,
          variables: {
            createTransactionInput: transactionInput,
          },
        })

        // Assert
        .expect(async (res) => {
          expect(res.body.data.createTransaction).toBeDefined();
          expect(typeof res.body.data.createTransaction).toBe("boolean");
        })
        .expect(200);

      expect(
        await transactionRepository.count({
          amount: transactionInput.amount,
          type: transactionInput.type,
          user: user.id,
        }),
      ).toEqual(1);
    });
  });

  describe("queries", () => {
    it("transactions", async () => {
      // Arrange
      const user = await addUserToDatabase({
        name: "transactionUser",
        email: "transactionUser@os.cpu",
        passphrase: "passphrase",
      });
      const { accessToken } = await authService.login(user);
      const transactionRepository = orm.em.fork().getRepository(Transaction);
      const transactions = [
        new Transaction({
          user: user,
          amount: 50,
          type: "deposit",
        }),
        new Transaction({
          user: user,
          amount: 75,
          type: "withdraw",
        }),
      ];

      await transactionRepository
        .getEntityManager()
        .persistAndFlush(transactions);

      // Act
      await request(app.getHttpServer())
        .post(endpoint)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          query: `
            query Transactions {
              transactions {
                id
                amount
                type
                userId
              }
            }
          `,
        })

        // Assert
        .expect(async (res) => {
          expect(res.body.data.transactions).toHaveLength(2);
        })
        .expect(200);

      expect(
        await transactionRepository.count({
          amount: transactions[0].amount,
          type: transactions[0].type,
          user: transactions[0].user,
        }),
      ).toEqual(1);
      expect(
        await transactionRepository.count({
          amount: transactions[1].amount,
          type: transactions[1].type,
          user: transactions[1].user,
        }),
      ).toEqual(1);
    });
  });
});
