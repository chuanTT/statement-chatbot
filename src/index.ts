import { AppDataSource } from "./data-source";
import app from "./server";
import {
  botTelegram,
  executionCommandFunc,
  getCache,
  ICommandItem,
  INPUT_PAGE,
  KEY_SPLIT,
  objCommands,
  PORT,
  removeCache,
  sendArrMessageBot,
  sendBotThrowPage,
  sendMessageBotHelp,
  setAndDelCache,
  setCache,
  TAKE,
} from "./configs";
import {
  calculatorLastPage,
  defaultCommandHelp,
  defaultCommandInputPage,
  ignoreStartHelpFunc,
  myCommands,
  splitPagination,
} from "./helpers";
import { renderKey } from "./helpers/render";

AppDataSource.initialize()
  .then(async () => {
    const notArrayCommands = ignoreStartHelpFunc();
    const arrKeysCommands = Object.keys(notArrayCommands);

    // khởi tạo commands
    await botTelegram.setMyCommands(myCommands());

    // Listen for any kind of message. There are different kinds of
    botTelegram.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg?.text ?? "";
      const keyCommand = getCache(chatId);

      const inputPageKey = renderKey([chatId, INPUT_PAGE]);
      const inputKey = getCache(inputPageKey);

      if (text?.charAt(0) === "/") {
        const command = text?.slice(1);
        const currentCommand: ICommandItem = objCommands[command];
        const isKey = arrKeysCommands.includes(command);
        setAndDelCache(chatId, command, isKey);
        const arrText = currentCommand?.render?.(msg) ?? defaultCommandHelp;
        sendArrMessageBot(chatId, arrText);
      } else if (inputKey) {
        const [text_key, total, key] = inputKey?.split(KEY_SPLIT);
        const error = await sendBotThrowPage(text, chatId, total);
        if (!error) {
          await executionCommandFunc(key, text_key, msg, +text);
          removeCache(inputPageKey);
        }
      } else if (keyCommand) {
        await executionCommandFunc(keyCommand, text, msg);
      } else {
        sendMessageBotHelp(chatId);
      }
    });

    botTelegram.on("callback_query", async (query) => {
      const { uuid, action } = splitPagination(query?.data);
      const msg = query?.message;
      const chatId = msg?.chat?.id;
      const data = getCache(uuid);

      if (data) {
        const key = data?.['key']
        const total = data?.['total']
        const text = data?.['text']
        const page  = data?.[action]

        if (action === INPUT_PAGE) {
          const lastPage = calculatorLastPage(+total, TAKE);
          setCache(renderKey([chatId, action]), renderKey([text, total, key]));
          await sendArrMessageBot(chatId, defaultCommandInputPage(lastPage));
          return;
        }
        await executionCommandFunc(key, text, msg, +page);
        return;
      }
      sendMessageBotHelp(chatId);
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
