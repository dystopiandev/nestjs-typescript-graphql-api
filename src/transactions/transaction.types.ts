import { ObjectType, Field, ID, InputType, Float } from "@nestjs/graphql";

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field()
  type: string;

  @Field()
  userId: string;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount: number;

  @Field()
  type: string;
}
