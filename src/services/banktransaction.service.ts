import { FindOneOptions } from "typeorm";
import { AppDataSource } from "../data-source";
import { BankTransaction } from "../entity/BankTransaction";

type createFoodsProps = {
  foods: { name: string; price: number; count?: number }[];
  listFoodId: number;
};

type deleteFoodsProps = {
  foodIds: number[];
  userID: number;
};

type updateFoodsProps = {
  name: string;
  price: number;
  count: number;
  id: number;
};

class BankTransactionServices {
  bankTransactionDB = AppDataSource.getRepository(BankTransaction);

  findAllWhere = async ({
    select,
    where,
    ...rest
  }: FindOneOptions<BankTransaction>) => {
    const result = await this.bankTransactionDB.findBy(where);
    return result;
  };

  createFoods = async ({ foods, listFoodId }: createFoodsProps) => {
    // const newFoods: any[] = foods.map((food) => ({
    //   ...food,
    //   listFood: {
    //     id: listFoodId,
    //   },
    // }));
    // const resultFood: Food[] = await this.foodDB.save(newFoods);
    // const newResultFoods: Food[] = [];
    // if (resultFood?.length > 0) {
    //   const totalPrice = resultFood.reduce((total, current) => {
    //     const { id, count, ...spread } = current;
    //     newResultFoods.push({ id, count, ...spread });
    //     return total + current.price * current.count;
    //   }, 0);
    //   await listFoodServices.incrementListFood(listFoodId, totalPrice);
    // }
    // return newResultFoods;
  };

  deleteFoods = async ({ foodIds, userID }: deleteFoodsProps) => {
    // return await funcTransactionsQuery({
    //   callBack: async (queryRunner) => {
    //     const resultFoods = await queryRunner.manager.find(Food, {
    //       where: {
    //         id: In(foodIds),
    //         listFood: {
    //           groupListFood: {
    //             user: {
    //               id: userID
    //             }
    //           }
    //         }
    //       },
    //       relations: {
    //         listFood: true,
    //       },
    //     });
    //     if (resultFoods?.length > 0) {
    //       const priceListFoods: {
    //         id: number;
    //         total: number;
    //       }[] = resultFoods?.reduce((total, current) => {
    //         const findIndex = total.findIndex(
    //           (item) => item?.id === current?.listFood?.id
    //         );
    //         if (findIndex !== -1) {
    //           total[findIndex].total += current?.price * current?.count;
    //         } else {
    //           total.push({
    //             id: current?.listFood?.id,
    //             total: current?.price * current?.count,
    //           });
    //         }
    //         return total;
    //       }, []);
    //       await awaitAll(priceListFoods, async (item) => {
    //         await queryRunner.manager.decrement(
    //           ListFood,
    //           {
    //             id: item?.id,
    //           },
    //           "totalPrice",
    //           item.total
    //         );
    //       });
    //       await queryRunner.manager.delete(Food, resultFoods);
    //       await queryRunner.commitTransaction();
    //       return resultFoods;
    //     }
    //     return null;
    //   },
    // });
  };

  updateFoods = async ({ name, count, price, id }: updateFoodsProps) => {
    // const resultFood = await this.findOneListFood({
    //   select: ["id", "count", "name", "price"],
    //   relations: {
    //     listFood: true,
    //   },
    //   where: {
    //     id,
    //   },
    // });
    // const isChangeCount = resultFood?.count !== Number(count);
    // const isChangePrice = resultFood?.price !== Number(price);
    // if (isChangeCount || isChangePrice) {
    //   const newTotalPrice =
    //     resultFood?.listFood?.totalPrice -
    //     resultFood?.price * resultFood?.count;
    //   const newCount = isChangeCount ? count : resultFood?.count;
    //   const newPrice = isChangePrice ? price : resultFood?.price;
    //   await listFoodServices.ListFoodDB.update(resultFood?.listFood?.id, {
    //     totalPrice: newTotalPrice + newPrice * newCount,
    //   });
    // }
    // await this.foodDB.update(id, {
    //   name,
    //   count: count <= 0 ? 1 : count,
    //   price,
    // });
  };
}

export default new BankTransactionServices();
