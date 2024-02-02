import { pageAndLimit } from "../types";

type paginationSharedParams<T> = pageAndLimit & {
  serviceCallBack: (obj: pageAndLimit) => Promise<[T[], number]>;
  customItems?: (items: T[]) => any;
};

const paginationShared = async <T>({
  page = 1,
  limit = 10,
  serviceCallBack,
  customItems,
}: paginationSharedParams<T>) => {
  let newPage = page;
  let newLimit = limit;
  if (newPage <= 0) {
    page = 1;
  }

  if (limit > 500) {
    limit = 500;
  }

  const skip = (newPage - 1) * newLimit;
  const [items, total] = await serviceCallBack({
    page: skip,
    limit: newLimit,
  });

  return {
    items: customItems ? customItems(items) : items,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export default paginationShared;
