import { UnprocessableEntity } from "http-errors";
import { NextFunction, Request, Response } from "express";
import * as _ from "lodash";

import { configValidateType } from "../types";
import { ConfigError } from "../utils/validate";
import { unlinkFile } from "../utils/functionFile";

const validateRequest =
  (LoadConfig: configValidateType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    let objErorr = {};

    for (const key in LoadConfig) {
      const object = Object.assign({}, req?.[key]);
      for (const keyValue in LoadConfig[key]) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(keyValue)) {
          const isError = ConfigError(
            keyValue,
            object[keyValue],
            LoadConfig[key][keyValue],
            object
          );
          if (isError[keyValue]) {
            objErorr = { ...objErorr, ...isError };
          }
        } else {
          !LoadConfig[key][keyValue]?.isDisableKey &&
            (objErorr = {
              ...objErorr,
              [keyValue]: `Cần phải truyền lên ${keyValue}`,
            });
        }
      }
    }
    
    if (_.isEmpty(objErorr)) {
      return next();
    } else {
      if ((req as any)?.file?.filename) {
        unlinkFile((req as any)?.file?.path);
      } else {
        if (Array.isArray((req as any)?.files)) {
          (req as any)?.files?.forEach((file: any) => {
            unlinkFile(file?.path);
          });
        }
      }
    }

    next(UnprocessableEntity());
  };

export default validateRequest;
