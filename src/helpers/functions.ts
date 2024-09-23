export const checkNumber = (num: string | number) => {
  if (!num || (num && typeof num === "number")) return false;
  const regex = /[0-9]+/g;
  return regex.test(num as string);
};

export const calculatorLastPage = (total: number, take: number) =>
  Math.ceil(total / take);

export const splitPagination = (key: string) => {
  const [newKey, page, total, text] = key?.split("_");
  return {
    key: newKey,
    page,
    total,
    text
  };
};
