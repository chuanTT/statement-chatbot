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

export const getWeeks = (date?: Date | string | number) => {
  const now = new Date(date);
  const day = now.getDay();
  const dateNow = now.getDate();
  const startDate = new Date(now.setDate(dateNow - day + (day == 0 ? -6 : 1)));
  const endDate = new Date(now.setDate(dateNow - day + 7));
  return {
    startDate,
    endDate,
    objDate: {
      start: startDate.getDate(),
      end: endDate.getDate(),
      months: [startDate.getMonth() + 1, endDate.getMonth() + 1],
      years: [startDate.getFullYear(), endDate.getFullYear()]
    }
  };
};

export const getDateWeeks = () => {
  const nowDate = new Date();
  const month = nowDate.getMonth();
  const year = nowDate.getFullYear();

  return {
    now: nowDate,
    month: month + 1,
    year,
    date: nowDate.getDate(),
    ...getWeeks(nowDate),
  };
};

export const fucCondition = (d: number) => `0${d}`.slice(-2);

export const getDateStartEnd = (strD = "") => {
  let date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();

  if (strD) {
    date = new Date(strD);
    (y = date.getFullYear()), (m = date.getMonth());
  }

  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const startDate = firstDay.getDate();
  const endDate = lastDay.getDate();
  let d = startDate;
  const listDateVN = [];
  const listInternational = [];
  while (d <= endDate) {
    const dateFormat = `${fucCondition(d)}/${fucCondition(m + 1)}/${y}`;
    const InterdateFormat = `${y}-${fucCondition(m + 1)}-${fucCondition(d)}`;
    listDateVN.push(dateFormat);
    listInternational.push(InterdateFormat);
    d++;
  }

  return {
    listDateVN,
    listInternational,
  };
};
