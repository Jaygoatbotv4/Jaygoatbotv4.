const { GoatWrapper } = require('fca-liane-utils');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "jay",
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
	onStart: async function ({ api, event }) {
		const videoLinks = [
			"https://i.imgur.com/IGXINCB.mp4",
			"https://i.imgur.com/JnmXyO3.mp4",
			"https://i.imgur.com/Qudb0Vl.mp4",
			"https://i.imgur.com/N3wIadu.mp4",
			"https://i.imgur.com/X7lugs3.mp4",
			"https://i.imgur.com/6b61HGs.mp4",
			"https://i.imgur.com/EPzjIbt.mp4",
			"https://i.imgur.com/WWGiRvB.mp4",
			"https://i.imgur.com/20QmmsT.mp4",
			"https://i.imgur.com/nN28Eea.mp4",
			"https://i.imgur.com/fknQ3Ut.mp4",
			"https://i.imgur.com/yXZJ4A9.mp4",
			"https://i.imgur.com/GnF9Fdw.mp4",
			"https://i.imgur.com/B86BX8T.mp4",
			"https://i.imgur.com/kZCBjkz.mp4",
			"https://i.imgur.com/id5Rv7O.mp4",
			"https://i.imgur.com/aWIyVpN.mp4",
			"https://i.imgur.com/aFIwl8X.mp4",
			"https://i.imgur.com/SJ60dUB.mp4",
			"https://i.imgur.com/ySu69zS.mp4",
			"https://i.imgur.com/mAmwCe6.mp4",
			"https://i.imgur.com/Sbztqx2.mp4",
			"https://i.imgur.com/s2d0BIK.mp4",
			"https://i.imgur.com/rWRfAAZ.mp4",
			"https://i.imgur.com/dYLBspd.mp4",
			"https://i.imgur.com/HCv8Pfs.mp4",
			"https://i.imgur.com/jdVLoxo.mp4",
			"https://i.imgur.com/hX3Znez.mp4",
			"https://i.imgur.com/cispiyh.mp4",
			"https://i.imgur.com/ApOSepp.mp4",
			"https://i.imgur.com/lFoNnZZ.mp4",
			"https://i.imgur.com/qDsEv1Q.mp4",
			"https://i.imgur.com/NjWUgW8.mp4",
			"https://i.imgur.com/ViP4uvu.mp4",
			"https://i.imgur.com/bim2U8C.mp4",
			"https://i.imgur.com/YzlGSlm.mp4",
			"https://i.imgur.com/HZpxU7h.mp4",
			"https://i.imgur.com/exTO3J4.mp4",
			"https://i.imgur.com/Xf6HVcA.mp4",
			"https://i.imgur.com/9iOci5S.mp4",
			"https://i.imgur.com/6w5tnvs.mp4",
			"https://i.imgur.com/1L0DMtl.mp4",
			"https://i.imgur.com/7wcQ8eW.mp4",
			"https://i.imgur.com/3MBTpM8.mp4",
			"https://i.imgur.com/8h1Vgum.mp4",
			"https://i.imgur.com/CTcsUZk.mp4",
			"https://i.imgur.com/e505Ko2.mp4",
			"https://i.imgur.com/3umJ6NL.mp4"
		];

		const randomIndex = Math.floor(Math.random() * videoLinks.length);
		const selectedVideoLink = videoLinks[randomIndex];

		const tmpFolderPath = path.join(__dirname, 'tmp');

		if (!fs.existsSync(tmpFolderPath)) {
			fs.mkdirSync(tmpFolderPath);
		}

		const videoResponse = await axios.get(selectedVideoLink, { responseType: 'arraybuffer' });
		const videoPath = path.join(tmpFolderPath, 'owner_video.mp4');

		fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, 'binary'));

		// Calculate uptime
		const uptime = process.uptime();
		const seconds = Math.floor(uptime % 60);
		const minutes = Math.floor((uptime / 60) % 60);
		const hours = Math.floor((uptime / (60 * 60)) % 24);
		const days = Math.floor(uptime / (60 * 60 * 24));
		const uptimeString = `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;

		// Format the current date and time
		const now = moment().tz('Asia/Manila');
		const date = now.format('D/M/YYYY');
		const time = now.format('HH:mm:ss');

		const response = `
⁂ Bot Name: MICA AI🎀
✧ Main admin: 𝗝𝗮𝘆
♛ Bot Admin Link: https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL
❂ Bot Prefix: /
✫ Bio: 𝗘𝘆𝘆𝘆𝘆𝘆𝘆𝘆𝘆🤙🏻
➟ UPTIME ${uptimeString}
✬ Today is: 『${date}』 【${time}】

➳ Bot is running ${uptimeString}.
✫ Thanks for using my bot
		`;

		await api.sendMessage({
			body: response,
			attachment: fs.createReadStream(videoPath)
		}, event.threadID, event.messageID);

		fs.unlinkSync(videoPath);

		api.setMessageReaction('🌊', event.messageID, (err) => {}, true);
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
