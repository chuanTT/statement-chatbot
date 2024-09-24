import { FindManyOptions, FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { BankTransaction } from "../entity/BankTransaction";
import { calculatorLastPage } from "../helpers";
import { TAKE } from "../configs";
import { IReturnPagination } from "../types";

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

  findAllPagination = async ({
    where,
    take = TAKE,
    skip,
  }: FindManyOptions<BankTransaction>): Promise<IReturnPagination> => {
    if (skip <= 0) {
      skip = 1;
    }

    if (take > 500) {
      take = 500;
    }

    const skipQuery = (skip - 1) * take;
    const [transactions, total] = await this.bankTransactionDB.findAndCount({
      where,
      order: {
        transactionDate: "ASC",
      },
      take,
      skip: skipQuery,
    });

    return {
      data: transactions,
      total,
      page: skip,
      take,
      lastPage: calculatorLastPage(total, take),
    };
  };
}

export default new BankTransactionServices();
