import { KEY_SPLIT } from "../configs";

export const checkNumber = (num: string | number) => {
  if(!num) return false
  if(typeof num === "number") return true
  const regex = /^[0-9]+$/;
  return regex.test(num)
};

export const calculatorLastPage = (total: number, take: number) =>
  Math.ceil(total / take);

export const splitPagination = (key: string) => {
  const [newKey, page, total, text, action] = key?.split(KEY_SPLIT);
  return {
    key: newKey,
    page,
    total,
    text,
    action,
  };
};

export const numberMoneyVND = (num: string | number) => {
  let t = "0";
  if (num) {
    if (typeof num === "string") {
      num = Number(num);
    }
    t = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return t;
};
