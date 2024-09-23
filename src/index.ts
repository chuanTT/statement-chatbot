import { AppDataSource } from "./data-source";
import app from "./server";
import { botTelegram, ICommandItem, objCommands } from "./configs";
import {
  defaultCommandHelp,
  defaultReturnValueCommand,
  ignoreStartHelpFunc,
} from "./helpers";
import { sendMessageBot } from "./configs";

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
        const send = currentCommand?.render?.(msg) ?? defaultCommandHelp();
        sendMessageBot(chatId, send);
      } else if (keyCommand) {
        const currentCommand = objCommands?.[keyCommand] as ICommandItem;
        const dataStr = await currentCommand?.execution(text);
        checkCommands[chatId] = "";
        sendMessageBot(chatId, dataStr || defaultReturnValueCommand());
      } else if (!keyCommand) {
        sendMessageBot(chatId, objCommands?.help?.render?.(msg));
      }
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
