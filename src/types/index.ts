import { Request } from "express";
import { FindOneOptions } from "typeorm";

// middleware request
export type configValidateValueType = {
  rules: any[];
  dependent?: string;
  isDisableKey?: boolean;
  msg: {
    [key: string]: string;
  };
};

export type variableNode = "body" | "params" | "query";

export type configValidateType = {
  [P in variableNode]?: {
    [key: string]: configValidateValueType;
  };
};

export type IRequest = Request & {
  keyStore: any;
  refreshToken?: string;
};

type keyOfCustom<K> = keyof K;

type keyCustomValue<K> = {
  key: keyOfCustom<K>;
  value: string;
};

export type CustomWhereExistsMiddleware<T> = keyOfCustom<T> | keyCustomValue<T>;

export type TExistsCustomMiddleware<T> = Omit<FindOneOptions<T>, "where"> & {
  where?: CustomWhereExistsMiddleware<T>[][] | CustomWhereExistsMiddleware<T>[];
  msgError?: string;
  isErrorExist?: boolean;
};

export type pageAndLimit = {
  page?: number;
  limit?: number;
};
