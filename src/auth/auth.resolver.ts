import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginResponse } from "../users/user.types";
import { LoginInput } from "../users/user.types";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args("loginInput") loginInput: LoginInput,
  ): Promise<LoginResponse> {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.passphrase,
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }
    return this.authService.login(user);
  }
}
