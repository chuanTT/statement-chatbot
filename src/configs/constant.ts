import { config } from "dotenv";
import { EnumCommand } from "../types";
import { SendMessageOptions } from "node-telegram-bot-api";
config();

export const PORT = process.env.PORT

export const TOKEN_TELEGRAM = process.env.TOKEN_TELEGRAM;
export const HREF_MTTQ = process.env.HREF_MTTQ;
export const TAKE = +(process.env.TAKE ?? 5);
export const INPUT_PAGE = 'inputpage'
export const KEY_SPLIT = "_"

export const arrIgnoreCommads = [EnumCommand.start, EnumCommand.help];

export const optionDefaultSend: SendMessageOptions = {
  parse_mode: "HTML",
  disable_notification: false,
  protect_content: true,
  disable_web_page_preview: true,
  allow_sending_without_reply: false,
};
