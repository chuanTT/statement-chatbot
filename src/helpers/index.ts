import { Request, Response, NextFunction } from "express";
import { FindOptionsWhere } from "typeorm";

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
  where: (keyof T)[] | (keyof T)[][];
}): FindOptionsWhere<T> | FindOptionsWhere<T>[] => {
  const isCheck = typeof where?.[0] === "string";

  const newWhere: FindOptionsWhere<T> = {};
  const newWhereArr: FindOptionsWhere<T>[] = [];

  where.forEach((keys: any) => {
    if (!Array.isArray(keys)) {
      const value = obj?.[keys];
      if (value) {
        newWhere[keys] = value;
      }
    } else {
      const objKey: FindOptionsWhere<T> = {};
      keys.map((key: any) => {
        const value = obj?.[key];
        if (value) {
          objKey[key] = value;
        }
      });
      newWhereArr.push(objKey);
    }
  });

  return isCheck ? newWhere : newWhereArr;
};
