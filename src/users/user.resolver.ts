import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CreateUserInput, User } from "./user.types";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => Boolean)
  async registerUser(
    @Args("createUserInput") createUserInput: CreateUserInput,
  ): Promise<boolean> {
    await this.userService.create(createUserInput);

    return true;
  }
}
