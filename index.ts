import { Telegraf, Context, Markup } from "telegraf";
import { ChatMember, ChatPermissions } from "telegraf/typings/telegram-types";
import "fs";
import * as dotenv from "dotenv";
import connect from './src/config/db'

dotenv.config();
import { isPrivate } from "./src/utils";

const bot = new Telegraf(process.env.BOT_TOKEN!);
connect(process.env.CONNECTION_STRING!);

bot.use(async (ctx: Context, next) => {
  //console.time(`Processing update ${ctx.update.update_id}`);
  await next(); // runs next middleware
  // runs after next middleware finishes
  //console.timeEnd(`Processing update ${ctx.update.update_id}`);
});

bot.on("new_chat_members", (ctx) => {
  let groupType = ctx.chat?.type!;
  if (groupType === 'supergroup') {
    //console.log(ctx.message.new_chat_members);
    ctx.message.new_chat_members.map(member => {
      bot.telegram.restrictChatMember(ctx.chat?.id!, member.id,
        {
          permissions: {
            can_change_info: false,
            can_pin_messages: false,
            can_send_polls: false,
            can_invite_users: false
          }
        });
    })
  }
});

bot.command("admins", (ctx, next) => {
  //console.log(ctx);
  bot.telegram
    .getChatAdministrators(ctx.chat?.id!)
    .then(function (admins) {
      if (!admins || !admins.length) return;
      admins.map(admin => {
        bot.telegram.sendMessage(admin.user.id, ctx.chat?.id.toString()!)
      })
    })
    .catch(console.log)
    .then((_) => next());
});

bot.command("lang", (ctx, next) => {
  let chatType = ctx.chat?.type!;
  let chatId = ctx.chat?.id!;

  if (chatType === 'group' || chatType === 'supergroup') {
    bot.telegram
      .getChatAdministrators(chatId)
      .then(data => {
        if (!data || !data.length) return;
        let isCreator: boolean = data.some(
          (adm) => adm.user.id === ctx.from?.id && adm.status === 'creator'
        );

        if (isCreator) {
          ctx.reply('Choose bot language / زبان بات را انتخاب کنید',
            Markup.inlineKeyboard([
              Markup.button.callback('فارسی', 'fa'),
              Markup.button.callback('English', 'en')
            ])
          )
        }
      })
  } else if (chatType === 'private') {

  }

  bot.action(/fa|en/, (ctx) => {
    if (ctx.match[0] === 'fa') {
      return ctx.answerCbQuery("باشه!")
    } else if (ctx.match[0] === 'en') {
      return ctx.answerCbQuery("OK!")
    }
  })
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
