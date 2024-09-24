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
  sendArrMessageBot,
  sendMessageBotHelp,
  setAndDelCache,
  setCache,
} from "./configs";
import {
  defaultCommandHelp,
  ignoreStartHelpFunc,
  myCommands,
  renderKey,
  sendBotThrowPage,
  splitPagination,
} from "./helpers";

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

      const inputPageKey = renderKey([keyCommand, chatId, INPUT_PAGE]);
      const inputKey = getCache(inputPageKey);

      if (text?.charAt(0) === "/") {
        const command = text?.slice(1);
        const currentCommand: ICommandItem = objCommands[command];
        const isKey = arrKeysCommands.includes(command);
        setAndDelCache(chatId, command, isKey);
        const arrText = currentCommand?.render?.(msg) ?? defaultCommandHelp();
        sendArrMessageBot(chatId, arrText);
      } else if (inputKey) {
        const [text_key, total] = inputKey?.split(KEY_SPLIT);
        const error = await sendBotThrowPage(text, chatId, total);
        if (!error) {
          await executionCommandFunc(keyCommand, text_key, msg, +text);
        }
      } else if (keyCommand) {
        await executionCommandFunc(keyCommand, text, msg);
      } else {
        sendMessageBotHelp(chatId);
      }
    });

    botTelegram.on("callback_query", async (query) => {
      const { key, page, text, action, total } = splitPagination(query?.data);
      const msg = query?.message;
      const chatId = msg?.chat?.id;
      const keyCommand = getCache(chatId);

      if (keyCommand === key && page) {
        if (action) {
          setCache(
            renderKey([keyCommand, chatId, action]),
            renderKey([text, total])
          );
          await sendArrMessageBot(
            chatId,
            "Vui lòng nhập số trang bạn muốn xem:"
          );
          return;
        }
        await executionCommandFunc(keyCommand, text, msg, +page);
        return;
      }
      sendMessageBotHelp(chatId);
    });

    app.listen(PORT, () => console.log(`server lister port:${PORT} `));
  })
  .catch((error) => console.log(error));
