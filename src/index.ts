import { AppDataSource } from "./data-source";
import app from "./server";
import {
  botTelegram,
  executionCommandFunc,
  ICommandItem,
  objCommands,
  returnExecution,
  sendArrMessageBot,
  sendMessageBotHelp,
} from "./configs";
import {
  defaultCommandHelp,
  defaultReturnValueCommand,
  ignoreStartHelpFunc,
  splitPagination,
} from "./helpers";
import { sendMessageBot } from "./configs";
import { has } from "lodash";

const PORT = 3001;

const checkCommands = {};

AppDataSource.initialize()
  .then(async () => {
    const notArrayCommands = ignoreStartHelpFunc();
    const arrKeysCommands = Object.keys(notArrayCommands);

    // Listen for any kind of message. There are different kinds of
    botTelegram.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg?.text ?? "";
      const keyCommand = checkCommands?.[chatId];

      if (text?.charAt(0) === "/") {
        const command = text?.slice(1);
        const currentCommand: ICommandItem = objCommands[command];
        const isKey = arrKeysCommands.includes(command);
        checkCommands[chatId] = isKey ? command : "";
        const arrText = currentCommand?.render?.(msg) ?? defaultCommandHelp();
        sendArrMessageBot(chatId, arrText);
      } else if (keyCommand) {
        await executionCommandFunc(keyCommand, text, msg);
      } else if (!keyCommand) {
        sendMessageBotHelp(chatId);
      }
    });

    botTelegram.on("callback_query", async (query) => {
      const { key, page, text } = splitPagination(query?.data);
      const msg = query?.message;
      const chatId = msg?.chat?.id;
      const keyCommand = checkCommands?.[chatId];
      if (keyCommand === key && page) {
        await executionCommandFunc(keyCommand, text, msg, +page);
        return;
      }
      sendMessageBotHelp(chatId);
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
