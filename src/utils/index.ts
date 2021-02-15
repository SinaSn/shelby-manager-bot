import { Telegraf, Context } from "telegraf";

const isPrivate = (ctx: Context) => {
  return ctx.chat?.type! === "private" ? true : false;
};

export { isPrivate };
