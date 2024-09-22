export const joinUrl = (dir?: string, BASE_URL: string = "/", link = "/") => {
  const maxlength = BASE_URL.length;
  const str = BASE_URL.substring(maxlength - 1, maxlength);
  if (str !== link) {
    BASE_URL += link;
  }

  if (BASE_URL?.length > 1) {
    BASE_URL = BASE_URL.replace(/^[\\/]{1,}/, "");
  }

  if (dir) {
    dir = dir.replace(/^[\\/]{1,}/, "");
    return `${BASE_URL}${dir}`;
  } else {
    BASE_URL = BASE_URL.replace(/[\\/]{1,}$/, "");
    return BASE_URL;
  }
};

export const joinPathParent = (...arg: string[]) => {
  let str = "";
  if (arg && arg?.length > 0) {
    arg.forEach((item) => {
      str = joinUrl(item, str);
    });
  }
  return str;
};

export const awaitAll = <T, R>(
  list: T[],
  asyncFn: (item: T, index: number) => R
) => {
  const promises: R[] = [];

  list.map((x, i) => {
    promises.push(asyncFn(x, i));
  });

  return Promise.all(promises);
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
