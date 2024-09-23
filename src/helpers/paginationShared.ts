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
  if (page <= 0) {
    page = 1;
  }

  if (limit > 500) {
    limit = 500;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await serviceCallBack({
    page: skip,
    limit,
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
