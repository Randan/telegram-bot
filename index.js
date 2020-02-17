process.env["NTBA_FIX_319"] = 1; // Fix of 319 error

require('dotenv').config();
var TelegramBot = require("node-telegram-bot-api");

var token = process.env.BOT_API;
var bot = new TelegramBot(token, { polling: true });

var notes = [];

bot.onText(/help/, function(msg, match) {
  var userId = msg.from.id;

  console.log(`User ${userId} asked for help.`);
  bot.sendMessage(
    userId,
    'Just type "/remind `do something` at `somewhen`". And I will remind you ;)'
  );
});

bot.onText(/remind (.+) at (.+)/, function(msg, match) {
  var userId = msg.from.id;
  var text = match[1];
  var time = match[2];

  notes.push({ uid: userId, time: time, text: text });

  console.log(`User ${userId} created reminder: ${text} at ${time}`);
  bot.sendMessage(userId, `Nice! I will remind you ${text} at ${time} :)`);
});

setInterval(function() {
  for (var i = 0; i < notes.length; i++) {
    const curDate = new Date().getHours() + ":" + new Date().getMinutes();
    if (notes[i]["time"] === curDate) {
      console.log(`Sending reminder (${notes[i]["text"]} at ${notes[i]["time"]}) to ${notes[i]["uid"]}`);
      bot.sendMessage(
        notes[i]["uid"],
        "Hey, you need: " + notes[i]["text"] + " right now."
      );
      notes.splice(i, 1);
    }
  }
}, 1000);
