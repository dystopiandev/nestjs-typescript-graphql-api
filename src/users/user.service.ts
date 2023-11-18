import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createUserDto: {
    name: string;
    email: string;
    passphrase: string;
  }): Promise<User> {
    const newUser = new User({
      ...createUserDto,
      passphrase: await bcrypt.hash(createUserDto.passphrase, 10),
    });

    await this.userRepository.getEntityManager().persistAndFlush(newUser);

    return newUser;
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email });
  }
}
