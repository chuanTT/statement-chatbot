import * as TelegramBot from "node-telegram-bot-api";
import {
  checkVaidateThrowRange,
  defaultErrorFormatDate,
  defaultThrowNumber,
  defaultThrowValidDate,
  formatAmounttransferdate,
  formatDate,
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
  paginationTelegram,
  renderTransaction,
  returnExeFunction,
} from "../helpers";
import { EXE_SPLIT, HREF_MTTQ } from "./constant";
import {
  EnumCommand,
  ICommandItemRetrunExecution,
  SendMessageOptions,
} from "../types";
import bankTransactionServices from "../services/banktransaction.service";

export type ICommand = keyof typeof EnumCommand;
export type returnExecution = {
  value: string;
  optons: SendMessageOptions;
};

export type ICommandItem = {
  describe?: string;
  name?: string;
  render?: (msg?: TelegramBot.Message) => string | string[];
  execution?: (
    text: string,
    msg?: TelegramBot.Message,
    skip?: number
  ) => Promise<ICommandItemRetrunExecution>;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  amount: {
    describe: "Tìm kiếm theo số tiền chuyển khoản",
    render: () => "Nhập số tiền",
    execution: async (text, _, skip) => {
      const error = defaultThrowNumber(text);
      if (error) return returnExeFunction(error, true);
      const executionPagination = await paginationTelegram({
        keyCommand: EnumCommand.amount,
        callBack: async () =>
          await bankTransactionServices.findAllSearchPagination({
            amount: +text,
            skip,
          }),
        text,
      });
      return executionPagination;
    },
  },
  transactioncode: {
    describe: "Tìm kiếm theo mã giao dịch",
    render: () => [
      "Nhập mã giao dịch.",
      "<b>Lưu ý: <i>Có một số mã giao dịch sẽ không khớp với mã giao dịch của bạn. Có thể là do bạn chuyển khác ngân hàng</i></b>",
    ],
    execution: async (text) => {
      const data = await bankTransactionServices.findOneTransaction({
        where: {
          transactionNumber: text,
        },
      });
      return returnExeFunction(renderTransaction(data), !data);
    },
  },
  transfercontent: {
    describe: "Tìm kiếm theo nội dung chuyển khoản",
    render: () => "Nhập nội dung chuyển khoản",
    execution: async (text, _, skip) => {
      const executionPagination = await paginationTelegram({
        keyCommand: EnumCommand.transfercontent,
        callBack: async () =>
          await bankTransactionServices.findAllSearchPagination({
            skip,
            transferContent: text,
          }),
        text,
      });
      return executionPagination;
    },
  },
  transferdate: {
    describe: "Tìm kiếm theo ngày giao dịch",
    render: () => ["Nhập ngày giao dịch", defaultErrorFormatDate],
    execution: async (text, _, skip) => {
      const [startDate, endDate] = text?.split(EXE_SPLIT) ?? [];
      const error = checkVaidateThrowRange(startDate, endDate);
      if (error) return error;
      const executionPagination = await paginationTelegram({
        keyCommand: EnumCommand.transferdate,
        callBack: async () =>
          await bankTransactionServices.findAllSearchPagination({
            skip,
            transferDate: formatDate(startDate),
            endTransferDate: endDate ? formatDate(endDate) : undefined,
          }),
        text,
      });
      return executionPagination;
    },
  },
  amounttransferdate: {
    describe:
      "Tìm kiếm theo số tiền và nội dung chuyển khoản và ngày chuyển khoản",
    render: () => [
      "Nhập số tiền và nội dung chuyển khoản và ngày chuyển khoản",
      formatAmounttransferdate,
    ],
    execution: async (text, _, skip) => {
      const [amount, transfercontent, startDate, endDate] =
        text?.split(EXE_SPLIT) ?? [];
      const error = defaultThrowNumber(amount);
      if (error)
        return returnExeFunction([error, formatAmounttransferdate], true);
      if (!transfercontent || !transfercontent?.trim()) {
        return returnExeFunction([formatAmounttransferdate], true);
      }

      if (startDate) {
        const error = checkVaidateThrowRange(startDate, endDate);
        if (error) return error;
      }

      const executionPagination = await paginationTelegram({
        keyCommand: EnumCommand.amounttransferdate,
        callBack: async () =>
          await bankTransactionServices.findAllSearchPagination({
            amount: +amount,
            transferContent: transfercontent ?? "",
            transferDate: startDate ?? undefined,
            endTransferDate: endDate ?? undefined,
            skip,
          }),
        text,
      });
      return executionPagination;
    },
  },
  help: {
    describe: "Xem trợ giúp",
    render: () =>
      `Bạn có thể thực hiện những lệnh này:\n\n${joinCommandsIgnoreStartHelp()}\nLưu ý: Tổng hợp dữ liệu có thể một số cái sẽ không lấy không đủ được dữ liệu.`,
  },
  start: {
    describe: "Bắt đầu bot",
    render: (msg) => {
      const fullName = joinFullName(msg?.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand(
        EnumCommand.help
      )}\nThông tin được tổng hợp từ <a href="${HREF_MTTQ}" target="_blank"><b>Mặt trận tổ quốc Việt Nam</b></a>\nChúc bạn tra được kết quả mong muốn!!`;
    },
  },
};
