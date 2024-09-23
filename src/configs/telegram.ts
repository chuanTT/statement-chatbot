import * as TelegramBot from "node-telegram-bot-api";
import {
  checkNumber,
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
  renderPagination,
  renderReplyMarkup,
  renderTransaction,
  renderTransactions,
} from "../helpers";
import { HREF_MTTQ, TAKE } from "./constant";
import { EnumCommand, SendMessageOptions } from "../types";
import bankTransactionServices from "../services/banktransaction.service";
import { numberMoneyVND } from "../utils/functions";

export type ICommand = keyof typeof EnumCommand;
export type returnExecution = {
  value: string;
  optons: SendMessageOptions;
};

export type ICommandItem = {
  describe?: string;
  render?: (msg?: TelegramBot.Message) => string | string[];
  execution?: (
    text: string,
    msg?: TelegramBot.Message,
    skip?: number
  ) => Promise<string | returnExecution | (string | returnExecution)[]>;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  amount: {
    describe: "Tìm kiếm theo số tiền chuyển khoản",
    render: () => "Nhập số tiền",
    execution: async (text, _, skip = 1) => {
      const isNumber = checkNumber(text);
      if (!isNumber) return "Số tiền không đúng định dạng";
      const { data, total } = await bankTransactionServices.findAllPagination({
        where: {
          amount: +text,
        },
        skip,
      });
      const isShow = total > TAKE;
      const arrMessage = [];
      if (isShow) {
        arrMessage.push(
          `<b>Có ${numberMoneyVND(total)} kết quả trùng khớp.</b>`
        );
      }

      return [
        ...arrMessage,
        {
          value: renderTransactions(data),
          optons: renderReplyMarkup(EnumCommand.amount, skip, total, text),
        },
      ];
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
      return data ? renderTransaction(data) : "";
    },
  },
  transfercontent: {
    describe: "Tìm kiếm theo nội dung chuyển khoản",
  },
  help: {
    describe: "Xem trợ giúp",
    render: () =>
      `Bạn có thể thực hiện những lệnh này:\n\n${joinCommandsIgnoreStartHelp()}\nLưu ý: Tổng hợp dữ liệu có thể một số cái sẽ không lấy không đủ được dữ liệu.`,
  },
  start: {
    describe: "Bắt đầu box",
    render: (msg) => {
      const fullName = joinFullName(msg?.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand(
        EnumCommand.help
      )}\nThông tin được tổng hợp từ <a href="${HREF_MTTQ}" target="_blank"><b>Mặt trận tổ quốc Việt Nam</b></a>\nChúc bạn tra được kết quả mong muốn!!`;
    },
  },
};
