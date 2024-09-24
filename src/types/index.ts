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

export type SkipAndTake = {
  skip?: number;
  take?: number;
};

export type TPaginationParams = {
  key: ICommand;
  total: number;
  text: string;
} & Required<Omit<SkipAndTake, "take">>;

export type IReturnPagination = Required<SkipAndTake> & {
  data: BankTransaction[];
  total: number;
  lastPage: number;
};

export type paginationTelegramProperty = {
  callBack: () => Promise<IReturnPagination>;
  text: string;
  keyCommand: ICommand;
};

export type IFindAllSearchPagination = {
  transferContent?: string;
  amount?: number
} & SkipAndTake;
