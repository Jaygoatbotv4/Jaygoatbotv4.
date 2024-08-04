const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "biblecronv2",
    author: "Jay",
    version: "2.0.0",
    cooldowns: 0,
    role: 0,
    shortDescription: {
      en: "Automatically sends a Bible verse every minute."
    },
    longDescription: {
      en: "This command fetches and sends a Bible verse every minute."
    },
    category: "utility",
    guide: {
      en: "&biblecronv2 {p} <setinterval> <time> <hour> <minutes><seconds>"
    }
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const commandArgs = event.body.toLowerCase().split(' ');

    const allowedAdminUID = '100095290150085';
    if (commandArgs[1] === 'setinterval') {
      const newIntervalValue = parseFloat(commandArgs[2]);
      const newIntervalUnit = commandArgs[3]?.toLowerCase();

      if (!isNaN(newIntervalValue) && newIntervalValue > 0) {
        let newInterval;

        if (newIntervalUnit === 'minute' || newIntervalUnit === 'minutes') {
          newInterval = newIntervalValue * 60 * 1000;
          const unit = newIntervalValue === 1 ? 'minute' : 'minutes';
          api.sendMessage(`🚀 |•Interval time set to ${newIntervalValue} ${unit}.`, threadID);
        } else {
          api.sendMessage('🚀 |•Invalid unit. Please use "minutes".', threadID);
          return;
        }

        bibleAutoInterval[threadID] = newInterval;
      } else {
        api.sendMessage('🚀 |•Invalid interval time. Please provide a valid positive number.', threadID);
      }
      return;
    } else if (commandArgs[1] === 'interval') {
      const currentInterval = bibleAutoInterval[threadID] || defaultInterval;
      api.sendMessage(`🚀 |•Current interval time is set to ${currentInterval / 60000} minutes.`, threadID);
      return;
    } else if (commandArgs[1] === 'on') {
      if (!bibleAutoState[threadID]) {
        bibleAutoState[threadID] = true;
        const intervalValue = bibleAutoInterval[threadID] ? bibleAutoInterval[threadID] / 60000 : 1;
        api.sendMessage(`🚀 |•Command feature is turned on, sending a Bible verse every ${intervalValue} minute${intervalValue === 1 ? '' : 's'}.`, threadID);

        sendBibleVerse(api, event, threadID);

        setInterval(() => {
          if (bibleAutoState[threadID]) {
            sendBibleVerse(api, event, threadID);
          }
        }, bibleAutoInterval[threadID] || defaultInterval);
      } else {
        api.sendMessage('🚀 |•Command feature is already turned on', threadID);
      }
      return;
    } else if (commandArgs[1] === 'off') {
      bibleAutoState[threadID] = false;
      api.sendMessage('🚀 |•Command feature is turned off', threadID);
      return;
    } else if (commandArgs[1] === 'status') {
      const statusMessage = bibleAutoState[threadID] ? 'on' : 'off';
      const intervalMessage = bibleAutoInterval[threadID] ? `Interval time set to ${bibleAutoInterval[threadID] / 60000} minutes.` : 'Interval time not set. Using the default 1-minute interval.';

      api.sendMessage(`🚀 |•Command feature is currently ${statusMessage}.\n🚀 |•Total verses sent: ${verseCounter}\n🚀 |•Total errors: ${errorCounter}`, threadID);
      return;
    } else if (commandArgs[1] === 'resetcount') {
      if (event.senderID === allowedAdminUID) {
        verseCounter = 0;
        errorCounter = 0;
        api.sendMessage('🚀 |•Verse counts have been reset.', threadID);
      } else {
        api.sendMessage('🚀 |•You do not have permission to reset counts.', threadID);
      }
      return;
    }

    api.sendMessage('🔴🟡🟢\n\n╭─❍\n➠•Invalid command.\n╰───────────⟡\n╭─❍\n➠•"biblecron on", "biblecron off" - to turn ON or OFF.\n╰───────────⟡\n╭─❍\n➠•"biblecron setinterval <minutes>" - set the timer for sending Bible verses\n╰───────────⟡\n╭─❍\n➠•"biblecron interval" - check the interval\n╰───────────⟡\n╭─❍\n➠•"biblecron status" - check the status of the command\n╰───────────⟡\n', threadID);
  },
};

const targetTimeZone = 'Asia/Manila';
const now = moment().tz(targetTimeZone);
const currentDate = now.format('YYYY-MM-DD');
const currentTime = now.format('HH:mm:ss');

const bibleAutoState = {};
const bibleAutoInterval = {};
let verseCounter = 0;
let errorCounter = 0;
const defaultInterval = 1 * 60 * 1000; // 1 minute

const sendBibleVerse = async (api, event, threadID) => {
  try {
    const response = await axios.get("https://labs.bible.org/api/?passage=random&type=json");

    if (response.status === 200 && response.data.length > 0) {
      const verse = response.data[0];
      const message = `${verse.bookname} ${verse.chapter}:${verse.verse} - ${verse.text}`;
      api.sendMessage(message, threadID);
      verseCounter++;
    } else {
      api.sendMessage("Sorry, an error occurred while getting the Bible verse.", threadID);
      errorCounter++;
    }
  } catch (error) {
    api.sendMessage("Sorry, an error occurred while getting the Bible verse.", threadID);
    errorCounter++;
  }
};
