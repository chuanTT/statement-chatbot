import { AppDataSource } from "./data-source";
import app from "./server";
import * as TelegramBot from "node-telegram-bot-api";
import bankTransactionServices from "./services/banktransaction.service";

const PORT = 3001;

AppDataSource.initialize()
  .then(async () => {
    // replace the value below with the Telegram token you receive from @BotFather
    const token = "7802074927:AAH59keNnZAJaBLj7XOyhRxb0tyDhBGXdPs";

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true });

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {
      // 'msg' is the received Message from Telegram
      // 'match' is the result of executing the regexp above on the text content
      // of the message

      const chatId = msg.chat.id;
      const resp = match[1]; // the captured "whatever"

      // send back the matched "whatever" to the chat
      bot.sendMessage(chatId, resp);
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const data = await bankTransactionServices.findAllWhere({
        where: {
          transactionNumber: msg?.text?.trim(),
        },
      });
      // // send a message to the chat acknowledging receipt of their message
      bot.sendMessage(chatId, JSON.stringify(data));
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
