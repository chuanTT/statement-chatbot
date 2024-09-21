import * as TelegramBot from "node-telegram-bot-api";
import { joinCommand, joinCommands, joinCommandsIgnoreStartHelp, joinFullName } from "../helpers";
import { HREF_MTTQ } from "./constant";

export type ICommand =
  | "transactioncode"
  | "amount"
  | "transfercontent"
  | "help"
  | "start";
export type ICommandItem = {
  describe?: string;
  render?: (msg: TelegramBot.Message) => string;
  showDetail?: () => string;
};

export interface IObjCommands extends Record<ICommand, ICommandItem> {}

export const objCommands: IObjCommands = {
  amount: {
    describe: "Tìm kiếm theo số tiền chuyển khoản",
  },
  transactioncode: {
    describe: "Tìm kiếm theo mã giao dịch",
  },
  transfercontent: {
    describe: "Tìm kiếm theo nội dung chuyển khoản",
  },
  help: {
    describe: "Xem trợ giúp",
    render: () => `Bạn có thể kiểm soát tôi bằng cách gửi những lệnh này:\n\n${joinCommandsIgnoreStartHelp()}\nLưu ý: Tổng hợp dữ liệu có thể một số cái sẽ không lấy không đủ được dữ liệu.`
  },
  start: {
    describe: "Bắt đầu box",
    render: (msg) => {
      const fullName = joinFullName(msg.chat);
      return `Xin chào, <b>${fullName}</b>!!!\n\n${joinCommand('help')}\nThông tin được tổng hợp từ <a href="${HREF_MTTQ}"><b>Mặt trận tổ quốc Việt Nam</b></a>\nChúc bạn tra được kết quả mong muốn!!`;
    },
  },
};
