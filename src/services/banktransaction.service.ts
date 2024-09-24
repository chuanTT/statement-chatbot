import { FindManyOptions, FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { BankTransaction } from "../entity/BankTransaction";
import { calculatorLastPage, convertViToEn } from "../helpers";
import { TAKE } from "../configs";
import { IFindAllSearchPagination, IReturnPagination } from "../types";

class BankTransactionServices {
  bankTransactionDB = AppDataSource.getRepository(BankTransaction);

  findOneTransaction = async ({
    select,
    where,
    ...spread
  }: FindOneOptions<BankTransaction>) => {
    return await this.bankTransactionDB.findOne({ select, where, ...spread });
  };

  findAllWhere = async ({ where }: FindOneOptions<BankTransaction>) => {
    const result = await this.bankTransactionDB.findBy(where);
    return result;
  };

  findAllSearchPagination = async ({
    skip = 1,
    take = TAKE,
    transferContent,
    amount,
  }: IFindAllSearchPagination): Promise<IReturnPagination> => {
    if (skip <= 0) {
      skip = 1;
    }

    if (take > 500) {
      take = 500;
    }

    const skipQuery = (skip - 1) * take;
    const queryBuilderTransactions =
      this.bankTransactionDB.createQueryBuilder("transaction");

    if (transferContent != undefined) {
      const newTransferContent = convertViToEn(transferContent);
      queryBuilderTransactions.where(
        "LOWER(transaction.transferContent) LIKE LOWER(:transferContent)",
        {
          transferContent: `%${newTransferContent}%`,
        }
      );
    }

    if (amount !== undefined) {
      queryBuilderTransactions.where("transaction.amount = :amount", {
        amount,
      });
    }

    const [transactions, total] = await queryBuilderTransactions
      .orderBy("transaction.transactionDate", "ASC")
      .take(take)
      .skip(skipQuery)
      .getManyAndCount();

    return {
      data: transactions,
      skip,
      take,
      total,
      lastPage: calculatorLastPage(total, take),
    };
  };
}

export default new BankTransactionServices();
