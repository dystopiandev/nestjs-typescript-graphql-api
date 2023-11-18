import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/gql-auth.guard";
import { CreateTransactionInput, Transaction } from "./transaction.types";
import { TransactionsService } from "./transactions.service";

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async createTransaction(
    @Args("createTransactionInput")
    createTransactionInput: CreateTransactionInput,
    @Context("req") req,
  ): Promise<boolean> {
    await this.transactionsService.create({
      ...createTransactionInput,
      userId: req.user.userId,
    });

    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Transaction])
  async transactions(@Context("req") req): Promise<Transaction[]> {
    const transactions = await this.transactionsService.findAll(
      req.user.userId,
    );

    return Promise.all(transactions.map(this.mapTransaction));
  }

  private async mapTransaction(transaction) {
    return {
      ...transaction,
      id: transaction._id.toString(),
      userId: transaction.user._id.toString(),
    };
  }
}
