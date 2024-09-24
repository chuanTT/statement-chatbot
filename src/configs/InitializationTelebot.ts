import * as TelegramBot from "node-telegram-bot-api";
import { optionDefaultSend, TOKEN_TELEGRAM } from "./constant";
import { ICommandExecution, SendMessageOptions } from "../types";
import { ICommandItem, objCommands, returnExecution } from "./telegram";
import { has, some } from "lodash";
import { defaultReturnValueCommand } from "../helpers";
import { removeCache } from "./cache";

export const botTelegram = new TelegramBot(TOKEN_TELEGRAM, {
  polling: true,
});

export const sendMessageBot = async (
  chatId: TelegramBot.ChatId,
  text?: string,
  options?: SendMessageOptions
): Promise<TelegramBot.Message | undefined> => {
  if (text) {
    return await botTelegram.sendMessage(chatId, text || "", {
      ...optionDefaultSend,
      ...options,
    });
  }
};

export const sendArrMessageBot = async (
  chatId: TelegramBot.ChatId,
  arrText?: ICommandExecution,
  options: SendMessageOptions = undefined
): Promise<void> => {
  if (arrText && Array.isArray(arrText)) {
    for (const item of arrText) {
      let newText = "";
      if (!(typeof item === "string")) {
        newText = item?.value;
        options = item?.optons;
      } else {
        newText = item;
      }
      await sendMessageBot(chatId, newText, options);
    }
    return;
  } else {
    let newText = "";
    if (!((typeof arrText as string) === "string")) {
      newText = (arrText as returnExecution)?.value;
    } else {
      newText = arrText as string;
    }
    newText && (await sendMessageBot(chatId, newText, options));
  }
};

export const sendMessageBotHelp = async (chatId: number) => {
  return await sendArrMessageBot(chatId, objCommands?.help?.render?.());
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
  const isHasExecution =
    dataStr &&
    (has(dataStr, "value") ||
      (Array.isArray(dataStr) && some(dataStr, (item) => has(item, "value"))));
  if (!isHasExecution) {
    removeCache(chatId);
  }
  const newOptions = isHasExecution
    ? (dataStr as returnExecution).optons
    : undefined;
  await sendArrMessageBot(
    chatId,
    dataStr || defaultReturnValueCommand(),
    newOptions
  );
};
