import * as TelegramBot from "node-telegram-bot-api";
import {
  joinCommand,
  joinCommandsIgnoreStartHelp,
  joinFullName,
} from "../helpers";
import { HREF_MTTQ } from "./constant";
import { EnumCommand } from "../types";
import bankTransactionServices from "../services/banktransaction.service";

export type ICommand = keyof typeof EnumCommand;
export type ICommandItem = {
  describe?: string;
  render?: (msg: TelegramBot.Message) => string;
  showDetail?: () => string;
  execution?: (text: string | number, msg?: TelegramBot.Message) => Promise<string>;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  amount: {
    describe: "Tìm kiếm theo số tiền chuyển khoản",
    // render: () =>
  },
  transactioncode: {
    describe: "Tìm kiếm theo mã giao dịch",
    render: () => `Vui lòng nhập mã giao dịch.`,
    execution: async (text) => {
      const data = await bankTransactionServices.findAllWhere({
        where: {
          transactionNumber: text?.trim(),
        },
      });
      console.log(text)


      return JSON.stringify(data);
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
      const fullName = joinFullName(msg.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand(
        EnumCommand.help
      )}\nThông tin được tổng hợp từ <a href="${HREF_MTTQ}"><b>Mặt trận tổ quốc Việt Nam</b></a>\nChúc bạn tra được kết quả mong muốn!!`;
    },
  },
};
