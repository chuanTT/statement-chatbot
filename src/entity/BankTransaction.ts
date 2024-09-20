import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class BankTransaction {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "nvarchar", default: null })
  bankName: string;

  @Column({ type: "nvarchar", default: null })
  transactionDate: string;

  @Column({ type: "nvarchar", default: null })
  accountNumber: string;

  @Column({ type: "bigint", default: 0 })
  amount: number;

  @Column({ type: "nvarchar", default: null })
  transferContent: string;

  @Column({ type: "nvarchar", default: null })
  transactionNumber: string;
}
