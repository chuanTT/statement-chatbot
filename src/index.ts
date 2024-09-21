import { AppDataSource } from "./data-source";
import app from "./server";
import * as TelegramBot from "node-telegram-bot-api";
import bankTransactionServices from "./services/banktransaction.service";
import {
  ICommandItem,
  IObjCommands,
  objCommands,
  TOKEN_TELEGRAM,
} from "./configs";
import { joinFullName } from "./helpers";

const PORT = 3001;

AppDataSource.initialize()
  .then(async () => {
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
        const send = currentCommand?.render?.(msg) ?? `Vui lòng`;
        //

        bot.sendMessage(chatId, send || "", {
          parse_mode: "HTML",
          disable_notification: false,
          protect_content: true,
          disable_web_page_preview: true,
          allow_sending_without_reply: false
        });
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
