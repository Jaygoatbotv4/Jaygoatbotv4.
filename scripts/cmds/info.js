const fs = require('fs');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "info",
		version: "1.0",
		author: "cliff",
		countDown: 20,
		role: 0,
		shortDescription: { vi: "", en: "" },
		longDescription: { vi: "", en: "" },
		category: "owner",
		guide: { en: "" },
		envConfig: {}
	},
	onStart: async function ({ message }) {
		const botName = "MICA AI🎀";
		const authorName = "𝗝𝗮𝘆";
		const authorFB = "https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL";
		const botPrefix = "/";
		const bio = "𝗘𝘆𝘆𝘆𝘆𝘆𝘆𝘆𝘆🤙🏻";
		const now = moment().tz('Asia/Jakarta');
		const date = now.format('M/D/YYYY');
		const time = now.format('HH:mm:ss');
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const uptimeString = `${hours} hours ${minutes} minutes ${seconds} seconds`;

		message.reply({
			body: `《《 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 》》

⁂ Bot Name: ${botName}
✧ Main admin: ${authorName}
♛ Bot Admin Link: ${authorFB}
❂ Bot Prefix: ${botPrefix}
✫ Bio: ${bio}
➟ UPTIME ${uptimeString}
✬ Today is: 『${date}』 【${time}】

➳ Bot is running ${uptimeString}.
✫ Thanks for using my bot`,
			attachment: await global.utils.getStreamFromURL(link)
		});
	},
	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "info") {
			this.onStart({ message });
		}
	}
};
