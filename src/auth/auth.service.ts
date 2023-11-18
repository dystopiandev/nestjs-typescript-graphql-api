import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import * as bcrypt from "bcrypt";
import { User } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (user && bcrypt.compareSync(pass, user.passphrase)) {
      return user;
    }
    return null;
  }

  async login(user: Omit<User, "passphrase">) {
    const payload = { sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: "365d" }),
    };
  }
}
