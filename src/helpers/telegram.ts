import TelegramBot = require("node-telegram-bot-api");
import { ICommand, objCommands } from "../configs";

export const joinFullName = (chat: TelegramBot.Chat) => {
  return `${chat.first_name?.trim()} ${chat.last_name?.trim()}`?.trim();
};

export const joinCommand = (key: ICommand, desc?: string) => {
  let newDesc = desc;
  if (!newDesc && objCommands?.[key]) {
    newDesc = objCommands?.[key]?.describe;
  }
  return `/${key} - ${newDesc}`;
};

export const joinCommands = (keys: ICommand[]): string => {
  return keys?.map((key) => `${joinCommand(key)}\n`)?.join("");
};

export const joinCommandsIgnoreStartHelp = (): string => {
  const { start, help, ...spread } = objCommands;
  const arrKeys = Object.keys(spread) as ICommand[];
  return joinCommands(arrKeys);
};

export const defaultCommandHelp = (): string => `Bạn dùng lệnh này`
