import { ObjectType, Field, ID, InputType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
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
  email: string;

  @Field()
  passphrase: string;
}
