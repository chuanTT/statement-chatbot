// telegram bot
export enum EnumCommand {
  "transactioncode" = "transactioncode",
  "amount" = "amount",
  "transfercontent" = "transfercontent",
  "help" = "help",
  "start" = "start",
}

// middleware request
export type pageAndLimit = {
  page?: number;
  limit?: number;
};
