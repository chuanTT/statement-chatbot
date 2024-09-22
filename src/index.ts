import { AppDataSource } from "./data-source";
import app from "./server";
import * as TelegramBot from "node-telegram-bot-api";
import {
  arrIgnoreCommads,
  ICommandItem,
  objCommands,
  optionDefaultSend,
  TOKEN_TELEGRAM,
} from "./configs";
import { defaultCommandHelp, defaultReturnValueCommand, ignoreStartHelpFunc } from "./helpers";
import { EnumCommand } from "./types";

const PORT = 3001;

const checkCommands = {};

AppDataSource.initialize()
  .then(async () => {
    const notArrayCommands = ignoreStartHelpFunc();
    const arrKeysCommands = Object.keys(notArrayCommands);
    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(TOKEN_TELEGRAM, { polling: true });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg?.text ?? "";
      if (text?.charAt(0) === "/") {
        const command = text?.slice(1);
        const currentCommand: ICommandItem = objCommands[command];
        if (arrIgnoreCommads?.includes(command as EnumCommand)) {
          checkCommands[chatId] = "";
        } else if (arrKeysCommands.includes(command)) {
          checkCommands[chatId] = command;
        }
        const send = currentCommand?.render?.(msg) ?? defaultCommandHelp();
        bot.sendMessage(chatId, send || "", optionDefaultSend);
      } else if (checkCommands?.[chatId]) {
        const key = checkCommands?.[chatId];
        const currentCommand = objCommands?.[key] as ICommandItem;
        let dataStr = await currentCommand?.execution(text);
        if (dataStr) {
          checkCommands[chatId] = "";
        } else {
          dataStr = defaultReturnValueCommand()
        }

        bot.sendMessage(chatId, dataStr || "", optionDefaultSend);
      } else if (!checkCommands?.[chatId]) {
        bot.sendMessage(
          chatId,
          objCommands?.help?.render?.(msg),
          optionDefaultSend
        );
      }

      // const data = await bankTransactionServices.findAllWhere({
      //   where: {
      //     transactionNumber: msg?.text?.trim(),
      //   },
      // });
      // // send a message to the chat acknowledging receipt of their message
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
