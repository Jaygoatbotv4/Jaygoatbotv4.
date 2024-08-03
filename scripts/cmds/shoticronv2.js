const axios = require('axios');
const fs = require('fs');
const request = require('request');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "shoticronv2",
    author: "cliff",
    version: "2.0.0",
    cooldowns: 0,
    role: 0,
    shortDescription: {
      en: "send random video"
    },
    longDescription: {
      en: "randomshoti"
    },
    category: "fun",
    guide: {
      en: "&shoticronv2 {p} <setinterval> <time> <hour> <minutes><seconds>"
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

        if (newIntervalUnit === 'hour' || newIntervalUnit === 'hours') {
          newInterval = newIntervalValue * 60 * 60 * 1000;
          const unit = newIntervalValue === 1 ? 'hour' : 'hours';
          api.sendMessage(`🚀 |•Interval time set to ${newIntervalValue} ${unit}.`, threadID);
        } else if (newIntervalUnit === 'minute' || newIntervalUnit === 'minutes') {
          newInterval = newIntervalValue * 60 * 1000;
          const unit = newIntervalValue === 1 ? 'minute' : 'minutes';
          api.sendMessage(`🚀 |•Interval time set to ${newIntervalValue} ${unit}.`, threadID);
        } else {
          api.sendMessage('🚀 |•Invalid unit. Please use "minutes" or "hours".', threadID);
          return;
        }

        shotiAutoInterval[threadID] = newInterval;
      } else {
        api.sendMessage('🚀 |•Invalid interval time. Please provide a valid positive number.', threadID);
      }
      return;
    } else if (commandArgs[1] === 'interval') {
      const currentInterval = shotiAutoInterval[threadID] || defaultInterval;
      const unit = currentInterval === 60 * 60 * 1000 ? 'hour' : 'minute';
      api.sendMessage(`🚀 |•Current interval time is set to ${currentInterval / (unit === 'hour' ? 60 * 60 * 1000 : 60 * 1000)} ${unit}.`, threadID);
      return;
    } else if (commandArgs[1] === 'on') {
      if (!shotiAutoState[threadID]) {
        shotiAutoState[threadID] = true;
        const intervalUnit = shotiAutoInterval[threadID] ? (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 'hour' : 'minute') : 'hour';
        const intervalValue = shotiAutoInterval[threadID] ? shotiAutoInterval[threadID] / (intervalUnit === 'hour' ? 60 * 60 * 1000 : 60 * 1000) : 1;
        const intervalMessage = `will send video every ${intervalValue} ${intervalUnit}${intervalValue === 1 ? '' : 's'}`;

        api.sendMessage(`🚀 |•Command feature is turned on, ${intervalMessage}.`, threadID);

        shoticron(api, event, threadID);

        setInterval(() => {
          if (shotiAutoState[threadID]) {
            shoticron(api, event, threadID);
          }
        }, shotiAutoInterval[threadID] || defaultInterval);
      } else {
        api.sendMessage('🚀 |•Command feature is already turned on', threadID);
      }
      return;
    } else if (commandArgs[1] === 'off') {
      shotiAutoState[threadID] = false;
      api.sendMessage('🚀|•Command feature is turned off', threadID);
      return;
    } else if (commandArgs[1] === 'status') {
      const statusMessage = shotiAutoState[threadID] ? 'on' : 'off';
      const intervalMessage = shotiAutoInterval[threadID] ? `Interval time set to ${shotiAutoInterval[threadID] / (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 60 : 1000)} minutes.` : 'Interval time not set. Using the default 1 -hour interval.';
      const errorMessage = lastVideoError[threadID] ? `Last video error: ${lastVideoError[threadID]}` : '';

      api.sendMessage(`🚀|•Command feature is currently ${statusMessage}.\n🚀|•Total videos sent: ${videoCounter}\n🚀|•Total error videos: ${errorVideoCounter}\n${errorMessage}`, threadID);
      return;
    } else if (commandArgs[1] === 'resetcount') {
      // Check if the user has permission to reset counts
      if (event.senderID === allowedAdminUID) {
        videoCounter = 0;
        errorVideoCounter = 0;
        api.sendMessage('🚀 |•Video counts have been reset.', threadID);
      } else {
        api.sendMessage('🚀 |•You do not have permission to reset counts.', threadID);
      }
      return;
    }

    api.sendMessage('🔴🟡🟢\n\n╭─❍\n➠•Invalid command.\n╰───────────⟡\n╭─❍\n➠•"shoticron on", "shoticron off" - to turn ON or turn OFF.\n╰───────────⟡\n╭─❍\n➠•"shoticron setinterval <minutes/hours>" - set the timer for video\n╰───────────⟡\n╭─❍\n➠•"shoticron interval" - check the interval\n╰───────────⟡\n╭─❍\n➠•"shoticron status" - check the status off command\n╰───────────⟡\n', threadID);
  },
};

const targetTimeZone = 'Asia/Manila';
const now = moment().tz(targetTimeZone);
const currentDate = now.format('YYYY-MM-DD');
const currentTime = now.format('HH:mm:ss');

const shotiAutoState = {};
const shotiAutoInterval = {};
let videoCounter = 0;
let errorVideoCounter = 0;
const startTime = Date.now();
const lastVideoError = {};
const defaultInterval = 60 * 60 * 1000;

const shoticron = async (api, event, threadID) => {
  const videoPath = path.join(__dirname, "/cache/shoti.mp4");
  const apiUrl = 'https://c-v1.onrender.com/shoti?apikey=$c-v1-7bejgsue6@iygv';

  try {
    const response = await axios.get(apiUrl);
    const { data } = response;

    if (data && data.code === 200 && data.data) {
      const { url: videoURL, cover: coverURL, title, duration, user } = data.data;
      const { username: userName, nickname: userNickname, userID } = user;

      const file = fs.createWriteStream(videoPath);
      const rqs = request(encodeURI(videoURL));

      rqs.pipe(file);

      file.on('finish', () => {
        const messageToSend = {
          body: `🎀 𝗦𝗵𝗼𝘁𝗶\n━━━━━━━━━━\n📝 𝗧𝗶𝘁𝗹𝗲: ${title}\n👑 𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${userName}\n🎯 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${userNickname}\n⏳ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}\n🆔 𝗨𝘀𝗲𝗿𝗜𝗗: ${userID}`,
          attachment: fs.createReadStream(videoPath)
        };

        api.sendMessage(messageToSend, threadID, (err) => {
          if (err) {
            console.error(err);
            api.sendMessage("An error occurred while sending the video.", threadID);
            errorVideoCounter++;
            lastVideoError[threadID] = `Error sending video: ${err.message}`;
          } else {
            videoCounter++;
            api.sendMessage(`🚀 |•Video sent successfully! Total videos sent: ${videoCounter}`, threadID);
          }

          fs.unlink(videoPath, (err) => {
            if (err) console.error("Error deleting video file:", err);
          });
        });
      });

      file.on('error', (err) => {
        console.error("Error downloading video:", err);
        api.sendMessage("An error occurred while downloading the video.", threadID);
        errorVideoCounter++;
        lastVideoError[threadID] = `Error downloading video: ${err.message}`;
      });
    } else {
      api.sendMessage("Failed to fetch the video. Invalid response from the API.", threadID);
      errorVideoCounter++;
      lastVideoError[threadID] = "Invalid API response.";
    }
  } catch (error) {
    console.error("Error fetching video from API:", error);
    api.sendMessage("An error occurred while fetching the video.", threadID);
    errorVideoCounter++;
    lastVideoError[threadID] = `API fetch error: ${error.message}`;
  }
};
