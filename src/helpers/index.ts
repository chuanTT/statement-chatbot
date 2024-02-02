import { Request, Response, NextFunction } from "express";
import { FindOptionsWhere } from "typeorm";
import { CustomWhereExistsMiddleware } from "../types";

export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const funcWhereFind = <T>({
  where,
  obj,
}: {
  obj: any;
  where: CustomWhereExistsMiddleware<T>[] | CustomWhereExistsMiddleware<T>[][];
}): FindOptionsWhere<T> | FindOptionsWhere<T>[] => {
  const isCheck = !Array.isArray(where?.[0]);

  const newWhere: FindOptionsWhere<T> = {};
  const newWhereArr: FindOptionsWhere<T>[] = [];

  where.forEach((keys: any) => {
    if (!Array.isArray(keys)) {
      const keyOfValue = typeof keys === "string" ? keys : keys?.value;
      const keyOfKey = typeof keys === "string" ? keys : keys?.key;
      const value = obj?.[keyOfValue];
      if (value) {
        newWhere[keyOfKey] = value;
      }
    } else {
      const objKey: FindOptionsWhere<T> = {};
      keys.map((key: any) => {
        const keyOfValue = typeof key === "string" ? key : key?.value;
        const keyOfKey = typeof key === "string" ? key : key?.key;
        const value = obj?.[keyOfValue];
        if (value) {
          objKey[keyOfKey] = value;
        }
      });
      newWhereArr.push(objKey);
    }
  });

  return isCheck ? newWhere : newWhereArr;
};
