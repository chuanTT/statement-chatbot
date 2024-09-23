import TelegramBot = require("node-telegram-bot-api");
import { arrIgnoreCommads, ICommand, objCommands, TAKE } from "../configs";
import { EnumCommand, InlineKeyboardButton, SendMessageOptions } from "../types";
import { omit } from "lodash";
import { BankTransaction } from "../entity/BankTransaction";
import { numberMoneyVND } from "../utils/functions";
import { calculatorLastPage } from "./functions";

export const ignoreStartHelpFunc = () => omit(objCommands, arrIgnoreCommads);

export const joinFullName = (chat?: TelegramBot.Chat) => {
  return `${chat?.first_name?.trim()} ${chat?.last_name?.trim()}`?.trim();
};

export const joinKeyCommand = (key: ICommand) => `/${key}`;

export const joinCommand = (key: ICommand, desc?: string) => {
  let newDesc = desc;
  if (!newDesc && objCommands?.[key]) {
    newDesc = objCommands?.[key]?.describe;
  }
  return `${joinKeyCommand(key)} - ${newDesc}`;
};

export const joinCommands = (keys: ICommand[]): string => {
  return keys?.map((key) => `${joinCommand(key)}\n`)?.join("");
};

export const joinCommandsIgnoreStartHelp = (): string => {
  const arrKeys = Object.keys(ignoreStartHelpFunc()) as ICommand[];
  return joinCommands(arrKeys);
};

export const defaultCommandHelp = (): string =>
  `Câu lệnh này không hợp lệ.\nVui lòng thực hiện lệnh này ${joinKeyCommand(
    EnumCommand.help
  )}`;

export const defaultReturnValueCommand = (): string =>
  `Không tìm thấy kết quả.`;

export const renderStrongColor = (str: string) =>
  `<strong style="color:red;">${str}</strong>`;

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

export const renderTransactions = (items: BankTransaction[]): string => {
  return items?.map((item) => `${renderTransaction(item)}\n\n`)?.join("");
};

export const renderKey = (key: string, page: number, total: number, text: string) =>
  `${key}_${page}_${total}_${text}`;

export const renderReplyMarkup = (
  key: ICommand,
  page: number,
  total: number,
  text: string
): SendMessageOptions => {
  const pagination = renderPagination(key, page, total, text);

  return {
    reply_markup: {
      inline_keyboard: [pagination],
    },
  };
};

export const renderPagination = (
  key: ICommand,
  page: number,
  total: number,
  text: string
): InlineKeyboardButton[] => {
  const arrPagination: InlineKeyboardButton[] = [];
  const lastPage = calculatorLastPage(total, TAKE)
  let prev = renderKey(key, page - 1, total, text);
  let next = renderKey(key, page + 1, total, text);

  if (!(lastPage === page)) {
    if (page > 1) {
      arrPagination.unshift({
        text: "Trang trước",
        callback_data: prev,
      });
    }

    if (total > page) {
      arrPagination.push({
        text: "Trang tiếp theo",
        callback_data: next,
      });
    }
  }

  return arrPagination;
};
