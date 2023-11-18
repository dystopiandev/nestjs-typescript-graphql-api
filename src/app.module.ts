import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { MikroOrmModule } from "@mikro-orm/nestjs/mikro-orm.module";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AuthModule } from "./auth/auth.module";
import { config } from "./config";
import { TransactionsModule } from "./transactions/transactions.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    MikroOrmModule.forRoot({
      autoLoadEntities: true,
      type: "mongo",
      clientUrl: config.mongoUri,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    UserModule,
    AuthModule,
    TransactionsModule,
  ],
})
export class AppModule {}
