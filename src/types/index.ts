import * as TelegramBot from "node-telegram-bot-api";
import { ICommand, returnExecution } from "../configs";
import { BankTransaction } from "../entity/BankTransaction";

// telegram bot
export enum EnumCommand {
  "transactioncode" = "transactioncode",
  "amount" = "amount",
  "transfercontent" = "transfercontent",
  "help" = "help",
  "start" = "start",
}

export type SendMessageOptions = TelegramBot.SendMessageOptions;
export type InlineKeyboardButton = TelegramBot.InlineKeyboardButton;
export type ICommandExecution =
  | (string | returnExecution)[]
  | string
  | returnExecution;
export type IBotCommand = TelegramBot.BotCommand;

export type TPaginationParams = {
  key: ICommand;
  page: number;
  total: number;
  text: string;
};


export type IReturnPagination = {
  data: BankTransaction[],
  total: number,
  page: number,
  take: number,
  lastPage: number,
}

export type paginationTelegramProperty = {
  callBack: () => Promise<IReturnPagination> 
  text: string
  keyCommand: ICommand
}
