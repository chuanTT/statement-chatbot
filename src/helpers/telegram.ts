import TelegramBot = require("node-telegram-bot-api");
import {
  arrIgnoreCommads,
  ICommand,
  INPUT_PAGE,
  IObjCommands,
  KEY_SPLIT,
  objCommands,
  sendArrMessageBot,
  TAKE,
} from "../configs";
import {
  EnumCommand,
  IBotCommand,
  ICommandExecution,
  InlineKeyboardButton,
  paginationTelegramProperty,
  SendMessageOptions,
  TPaginationParams,
} from "../types";
import { omit } from "lodash";
import { BankTransaction } from "../entity/BankTransaction";
import { calculatorLastPage, checkNumber, numberMoneyVND } from "./functions";

export const ignoreStartHelpFunc = (arrIngore: ICommand[] = arrIgnoreCommads) =>
  omit(objCommands, arrIngore);

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

export const myCommands = (): IBotCommand[] => {
  return Object.keys(ignoreStartHelpFunc([EnumCommand.start])).map((item) => {
    return {
      command: item,
      description: (objCommands as IObjCommands)[item].describe,
    };
  });
};

export const defaultCommandHelp = (): string[] => [
  "Câu lệnh này không hợp lệ.",
  `Vui lòng thực hiện lệnh này ${joinKeyCommand(EnumCommand.help)}`,
];

export const defaultReturnValueCommand = (): string =>
  `Không tìm thấy kết quả.`;

export const defaultThrowPage = (): string => "Số trang không đúng định dạng";
export const defaultThrowMaxPage = (): string => "Số trang vượt quá cho phép";
export const defaultCommandInputPage = (): string =>
  "Vui lòng nhập số trang bạn muốn xem";

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

export const renderTransactions = (items: BankTransaction[]): string => {
  return items?.map((item) => `${renderTransaction(item)}\n\n`)?.join("");
};

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
  const prev = renderKey([key, skip - 1, total, text]);
  const next = renderKey([key, skip + 1, total, text]);
  const inputPage = renderKey([key, skip + 1, total, text, INPUT_PAGE]);

  const isShowPrev = skip > 1;
  const isShowNext = total > skip;
  if (isShowPrev) {
    arrPagination.unshift({
      text: "« Trang trước",
      callback_data: prev,
    });
  }

  if (isShowNext) {
    arrPagination.push({
      text: "Trang tiếp theo »",
      callback_data: next,
    });
  }

  if (lastPage > 1 && (isShowNext || isShowPrev)) {
    wapperPagination.push(arrPagination);
    wapperPagination.push([
      { text: "Nhập số trang", callback_data: inputPage },
    ]);
  }

  return wapperPagination;
};

export const paginationTelegram = async ({
  keyCommand,
  callBack,
  text,
}: paginationTelegramProperty): Promise<ICommandExecution> => {
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

  return data?.length > 0
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
    : defaultReturnValueCommand();
};

export const sendBotThrowPage = async (
  text: string,
  chatId: TelegramBot.ChatId,
  total: string | number
) => {
  const isNumber = checkNumber(text);
  if (!isNumber) {
    await sendArrMessageBot(chatId, [
      defaultThrowPage(),
      defaultCommandInputPage(),
    ]);
    return true;
  } else {
    const lastPage = calculatorLastPage(+total, TAKE);
    if (+text > lastPage) {
      await sendArrMessageBot(chatId, [
        defaultThrowMaxPage(),
        defaultCommandInputPage(),
      ]);
      return true;
    }
  }
  return undefined;
};
