import _ = require("lodash");
import { configValidateValueType } from "../types";

// validate rule
const isRequired = (value: any) => {
  let isError = true;
  if (value) {
    if (value?.toString()?.trim()) {
      isError = false;
    }
  }
  return isError;
};

const isMin = (min: number) =>
  function childMin(value: any) {
    let isError = true;
    if (!isRequired(value) && value.length >= min) {
      isError = false;
    }
    (childMin as any).parentName = isMin.name;
    return isError;
  };

const isMax = (max: number) =>
  function childMax(value: any) {
    let isError = true;
    if (!isRequired(value) && value.length <= max) {
      isError = false;
    }
    (childMax as any).parentName = isMax.name;
    return isError;
  };

const isNumber = (value: any) => {
  let isError = true;
  if (!isRequired(value) || value === "0" || value === 0) {
    const regex = /^[0-9]+$/;

    isError = !regex.test(value);
  }

  return isError;
};

const isEmail = (value: any) => {
  let isError = true;
  const regex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
  if (!isRequired(value)) {
    isError = !regex.test(value);
  }

  return isError;
};

const isDependent = (value: any, dependent: any) => {
  let isError = true;
  if (!isRequired(value) && !isRequired(dependent)) {
    isError = !(value === dependent);
  }
  return isError;
};

const isValueArray = (value: any) => {
  let isError = true;
  if (Array.isArray(value)) {
    isError = false;
  } else if (typeof value === "string") {
    value = value.toString();
    value = value.replace(/^"/g, "");
    value = value.replace(/"$/g, "");
    const s = value.search(/^\[/g);
    const e = value.search(/\]$/g);

    if (s == 0 && e == value?.length - 1) {
      isError = false;
    }
  }
  return isError;
};

export const isValidDate = (dateStr: string) => {
  const isError = true;

  if (!isRequired(dateStr)) {
    const d = new Date(dateStr);
    return isNaN(d as any);
  }
  return isError;
};

export const parseArr = (value: any) => {
  let arr = [];
  try {
    const isArray = Array.isArray(value);
    arr = isArray ? value : JSON.parse(value);
  } catch {}
  return arr;
};

export const isMinLength = (min: number) =>
  function childMinLength(value: any) {
    let isError = true;
    const arrValue = parseArr(value);
    if (arrValue.length >= min) {
      isError = false;
    }
    (childMinLength as any).parentName = isMinLength.name;
    return isError;
  };

export const isValidUserName = (value: any) => {
  let isError = true;
  if (!isRequired(value)) {
    const regex = new RegExp("^[a-z0-9]+$", "gm");
    return !regex.test(value);
  }
  return isError;
};

type typeVariable =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function";

type schemaObjParams = {
  [key: string]: typeVariable | typeVariable[];
};

export const isValidateArrayItem = (
  schemaObj: schemaObjParams | typeVariable = {
    name: "string",
    price: "number",
    count: ["number", "undefined"],
  }
) => {
  const childArrayItem = (value: any[]) => {
    let isError = false;
    const arrValue = parseArr(value);

    if (Array.isArray(arrValue)) {
      for (let obj of arrValue) {
        if (!_.isObject(schemaObj)) {
          const typeSchema = schemaObj;
          const typeParams = typeof obj;
          if (!(typeParams === typeSchema)) {
            isError = true;
            break;
          }
        } else {
          if (_.isEmpty(obj)) {
            isError = true;
            break;
          }
          for (let key in schemaObj) {
            const typeSchema = schemaObj[key];
            const typeParams = typeof obj[key];
            if (
              !(
                (Array.isArray(typeSchema) &&
                  typeSchema.includes(typeParams)) ||
                typeParams === typeSchema
              )
            ) {
              isError = true;
              break;
            }
          }
        }
      }
    } else {
      isError = true;
    }

    return isError;
  };

  (childArrayItem as any).parentName = isValidateArrayItem.name;

  return childArrayItem;
};

const ObjJson = (value: any) => {
  let result = {};
  try {
    result = JSON.parse(value);
  } catch (error) {
    result = {};
  }

  return result;
};

const isValidJson = (value: any) => {
  let isError = true;
  try {
    const data = JSON.parse(value);
    if (data) {
      isError = false;
    }
  } catch (error) {
    isError = true;
  }

  return isError;
};

const isValidateObj = (value: any) => {
  let isError = isValidJson(value);

  if (!isError) {
    const obj = ObjJson(value);

    if (typeof obj === "object" && !Array.isArray(obj)) {
      isError = false;
    }
  }

  return isError;
};

const ConfigError = (
  key: string,
  value: string | number,
  config: configValidateValueType,
  object: any
) => {
  const { rules, msg, dependent } = config;
  let msgErorr = null;

  if (Array.isArray(rules) && rules?.length > 0) {
    for (const rule of rules) {
      const isError = dependent ? rule(value, object[dependent]) : rule(value);

      if (isError) {
        msgErorr = msg[rule?.parentName || rule.name];
        break;
      }
    }
  }

  return { [key]: msgErorr };
};

export {
  isRequired,
  isEmail,
  isNumber,
  ConfigError,
  isDependent,
  isValueArray,
  isValidJson,
  isMin,
  isMax,
  isValidateObj,
  ObjJson,
};
