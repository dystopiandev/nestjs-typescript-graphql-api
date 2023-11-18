import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Transaction } from "./transaction.entity";
import { User } from "../users/user.entity";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: EntityRepository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(createTransactionDto: {
    amount: number;
    type: string;
    userId: string;
  }): Promise<Transaction> {
    const newTransaction = new Transaction({
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      user: this.userRepository.getReference(createTransactionDto.userId),
    });

    await this.transactionRepository
      .getEntityManager()
      .persistAndFlush(newTransaction);

    return newTransaction;
  }

  async findAll(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({ user: userId });
  }
}
