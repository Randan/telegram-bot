process.env["NTBA_FIX_319"] = 1; // Fix of 319 error

require('dotenv').config();
const consoleMsg = require('./utils/consoleMsg');
const TelegramBot = require("node-telegram-bot-api");
const cron = require('node-cron');

const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });

const notes = [];

bot.onText(/help/, function(msg, match) {
  const userId = msg.from.id;

  consoleMsg(`User ${userId} asked for help.`);
  bot.sendMessage(
    userId,
    'Just type "/remind `do something` at `somewhen`". And I will remind you ;)'
  );
});

bot.onText(/remind (.+) at (.+)/, function(msg, match) {
  const userId = msg.from.id;
  const text = match[1];
  const time = match[2];

  notes.push({ uid: userId, time: time, text: text });

  consoleMsg(`User ${userId} created reminder: ${text} at ${time}`);
  bot.sendMessage(userId, `Nice! I will remind you ${text} at ${time} :)`);
});

cron.schedule('* * * * * *', () => {
  for (let i = 0; i < notes.length; i++) {
    const curDate = new Date().getHours() + ":" + new Date().getMinutes();

    if (notes[i]["time"] === curDate) {
      consoleMsg(`Sending reminder (${notes[i]["text"]} at ${notes[i]["time"]}) to ${notes[i]["uid"]}`);
      bot.sendMessage(
        notes[i]["uid"],
        `Hey, you need ${notes[i]["text"]} right now.`
      );
      notes.splice(i, 1);
    }
  }
});
