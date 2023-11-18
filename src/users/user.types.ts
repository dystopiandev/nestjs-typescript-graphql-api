import { ObjectType, Field, ID, InputType } from "@nestjs/graphql";
import { IsEmail, MinLength } from "class-validator";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @MinLength(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  @MinLength(2)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  passphrase: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  passphrase: string;
}
