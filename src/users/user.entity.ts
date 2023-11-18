import {
  Collection,
  Entity,
  EntityData,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { Transaction } from "../transactions/transaction.entity";

@Entity()
export class User extends BaseEntity<User> {
  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  passphrase!: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions = new Collection<Transaction>(this);

  constructor(userData: EntityData<User> = null) {
    super();

    this.overwrite(userData);
  }
}
