import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Transaction } from "./transaction.entity";
import { TransactionsResolver } from "./transactions.resolver";
import { TransactionsService } from "./transactions.service";
import { User } from "../users/user.entity";

@Module({
  imports: [MikroOrmModule.forFeature([Transaction, User])],
  providers: [TransactionsService, TransactionsResolver],
  exports: [TransactionsService],
})
export class TransactionsModule {}
