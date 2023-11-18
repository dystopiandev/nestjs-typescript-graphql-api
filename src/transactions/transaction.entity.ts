import { Entity, EntityData, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity";
import { User } from "../users/user.entity";

@Entity()
export class Transaction extends BaseEntity<Transaction> {
  @Property()
  amount!: number;

  @Property()
  type!: string;

  @ManyToOne(() => User)
  user!: User;

  constructor(transactionData: EntityData<Transaction> = null) {
    super();

    this.overwrite(transactionData);
  }
}
