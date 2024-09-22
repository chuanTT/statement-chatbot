import TelegramBot = require("node-telegram-bot-api");
import { arrIgnoreCommads, ICommand, objCommands } from "../configs";
import { EnumCommand } from "../types";
import { omit } from "lodash";
import { BankTransaction } from "../entity/BankTransaction";
import { numberMoneyVND } from "../utils/functions";

export const ignoreStartHelpFunc = () => omit(objCommands, arrIgnoreCommads);

export const joinFullName = (chat: TelegramBot.Chat) => {
  return `${chat.first_name?.trim()} ${chat.last_name?.trim()}`?.trim();
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

export const defaultReturnValueCommand = (): string => `Không tìm thấy kết quả. Bạn có thể chọn lệnh khác\n${joinCommandsIgnoreStartHelp()}`

export const renderStrongColor = (str: string, color: string = "#0088cc") =>
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
