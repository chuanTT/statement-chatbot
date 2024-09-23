import * as TelegramBot from "node-telegram-bot-api";

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
