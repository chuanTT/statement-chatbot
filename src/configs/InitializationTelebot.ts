import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TOKEN_TELEGRAM } from "./constant";
import { SendMessageOptions } from "../types";
import { ICommandItem, objCommands, returnExecution } from "./telegram";
import { has } from "lodash";
import { defaultReturnValueCommand } from "../helpers";

export const botTelegram = new TelegramBot(TOKEN_TELEGRAM, {
  polling: true,
});

export const sendMessageBot = (
  chatId: TelegramBot.ChatId,
  text?: string,
  options?: SendMessageOptions
) => {
  text &&
    botTelegram.sendMessage(chatId, text || "", {
      ...optionDefaultSend,
      ...options,
    });
};

export const sendArrMessageBot = (
  chatId: TelegramBot.ChatId,
  arrText?: (string | returnExecution)[] | string | returnExecution,
  options: SendMessageOptions = undefined
) => {
  if (arrText && Array.isArray(arrText)) {
    arrText?.map((text: returnExecution | string) => {
      let newText = "";
      if (!(typeof text === "string")) {
        newText = text?.value;
        options = text?.optons;
      } else {
        newText = text;
      }
      sendMessageBot(chatId, newText, options);
    });
    return;
  } else {
    let newText = "";
    if (!((typeof arrText as string) === "string")) {
      newText = (arrText as returnExecution)?.value;
    } else {
      newText = arrText as string;
    }
    newText && sendMessageBot(chatId, newText, options);
  }
};

export const sendMessageBotHelp = (
  chatId: number,
  msg?: TelegramBot.Message
) => {
  return sendArrMessageBot(chatId, objCommands?.help?.render?.(msg));
};

export const executionCommandFunc = async (
  keyCommand: string,
  text: string,
  msg: TelegramBot.Message,
  skip?: number
) => {
  const chatId = msg?.chat?.id;
  const currentCommand = objCommands?.[keyCommand] as ICommandItem;
  const dataStr = await currentCommand?.execution(text, msg, skip);
  const isHasExecution = dataStr && has(dataStr, "value");
  // if (!isHasExecution) {
  //   checkCommands[chatId] = "";
  // }
  const newOptions = isHasExecution
    ? (dataStr as returnExecution).optons
    : undefined;
  sendArrMessageBot(chatId, dataStr || defaultReturnValueCommand(), newOptions);
};
