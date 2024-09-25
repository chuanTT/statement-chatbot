import {
  EXE_SPLIT,
  INPUT_PAGE,
  KEY_SPLIT,
  NEXT_PAGE,
  PREV_PAGE,
  setCache,
  TAKE,
} from "../configs";
import { BankTransaction } from "../entity/BankTransaction";
import {
  ICommandExecution,
  ICommandItemRetrunExecution,
  InlineKeyboardButton,
  paginationTelegramProperty,
  SendMessageOptions,
  TPaginationParams,
} from "../types";
import { returnExeFunction, returnValueCommand } from "./error";
import { calculatorLastPage, numberMoneyVND, randUuid } from "./functions";

// render giao dịch
export const renderStrongColor = (str: string | number) =>
  `<b class="text-entity-link">${str}</b>`;

export const renderTransaction = (item: BankTransaction): string => {
  return `Ngày giao dịch ${renderStrongColor(
    item?.transactionDate
  )} vào tài khoản ${renderStrongColor(
    item?.accountNumber
  )} ${renderStrongColor(item?.bankName)} có mã giao dịch ${renderStrongColor(
    item?.transactionNumber
  )} số tiền ${renderStrongColor(
    numberMoneyVND(item?.amount ?? 0)
  )} nội dung chuyển khoản ${renderStrongColor(item?.transferContent)}`;
};

//  render danh sách giao dịch
export const renderTransactions = (items: BankTransaction[]): string => {
  return items?.map((item) => `${renderTransaction(item)}\n\n`)?.join("");
};
// end render giao dịch

// render phân trang telegram
export const renderKey = (arr: (string | number)[]) =>
  arr?.filter((item) => !!item)?.join(KEY_SPLIT);

export const renderReplyMarkup = (
  obj: TPaginationParams
): SendMessageOptions => {
  const pagination = renderPagination(obj);

  return {
    reply_markup: {
      inline_keyboard: pagination,
    },
  };
};

export const renderPagination = ({
  key,
  skip,
  text,
  total,
}: TPaginationParams): InlineKeyboardButton[][] => {
  const wapperPagination = [];
  const arrPagination: InlineKeyboardButton[] = [];
  const lastPage = calculatorLastPage(total, TAKE);
  const isShowPrev = skip > 1;
  const isShowNext = skip < lastPage;
  const uuid = randUuid();

  if (isShowPrev) {
    const prev = renderKey([uuid, PREV_PAGE]);

    arrPagination.unshift({
      text: "« Trang trước",
      callback_data: prev,
    });
  }

  if (isShowNext) {
    const next = renderKey([uuid, NEXT_PAGE]);

    arrPagination.push({
      text: "Trang tiếp theo »",
      callback_data: next,
    });
  }

  if (lastPage > 1 && (isShowNext || isShowPrev)) {
    const inputPage = renderKey([uuid, INPUT_PAGE]);
    wapperPagination.push(arrPagination);
    wapperPagination.push([
      { text: "Nhập số trang", callback_data: inputPage },
    ]);
    setCache(uuid, {
      key,
      text,
      total,
      [NEXT_PAGE]: skip + 1,
      [PREV_PAGE]: skip - 1,
    });
  }

  return wapperPagination;
};

export const paginationTelegram = async ({
  keyCommand,
  callBack,
  text,
}: paginationTelegramProperty): Promise<ICommandItemRetrunExecution> => {
  const { data, total, skip, lastPage, take } = await callBack();
  const isShow = total > take;
  const arrMessage = [];
  if (isShow) {
    arrMessage.push(`Từ khóa tìm kiếm "${renderStrongColor(text)}"`);
    arrMessage.push(`<b>Có ${numberMoneyVND(total)} kết quả trùng khớp.</b>`);
    arrMessage.push(
      `Bạn đang ở trang ${renderStrongColor(
        skip
      )} trên tổng ${renderStrongColor(lastPage)} trang`
    );
  }

  return returnExeFunction(
    data?.length > 0
      ? [
          ...arrMessage,
          {
            value: renderTransactions(data),
            optons: renderReplyMarkup({
              key: keyCommand,
              skip,
              total,
              text,
            }),
          },
        ]
      : returnValueCommand,
    !(data?.length > 0)
  );
};

// end render phân trang telegram

// render default format
export const renderDefaultFormat = (arr: string[][], splitStr = EXE_SPLIT) => {
  let str = `Định dạng hỗ trợ:\n`;

  return `${str}${arr
    .map((items) => {
      return `+ ${renderStrongColor(items.join(splitStr))}\n`;
    })
    .join("")}`;
};
