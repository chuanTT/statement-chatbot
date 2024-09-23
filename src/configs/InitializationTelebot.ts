import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TOKEN_TELEGRAM } from "./constant";

export const botTelegram = new TelegramBot(TOKEN_TELEGRAM, { polling: true });

export const sendMessageBot = (
  chatId: TelegramBot.ChatId,
  text?: string,
  options: TelegramBot.SendMessageOptions = optionDefaultSend
) => {
  text && botTelegram.sendMessage(chatId, text || "", options);
};
