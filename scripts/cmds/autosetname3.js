const axios = require('axios');

function toBoldFont(text) {
    const boldMap = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
        'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
        'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
        'Y': '𝗬', 'Z': '𝗭', 'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳',
        'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃',
        'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
    };
    return text.split('').map(char => boldMap[char] || char).join('');
}

let isEnabled = false; // Flag to track if the command is enabled

module.exports = {
    config: {
        name: "autosetname3",
        version: "1.0",
        author: "Jay Pillonar",
        cooldowns: 5,
        role: 1,
        description: {
            en: "Auto change nickname of new member based on gender"
        },
        category: "box chat",
        guide: {
            en: 'The bot will automatically change the nickname of a new member based on their gender.\n'
                + 'Male: 》 𝗠𝗘𝗠𝗕𝗘𝗥👥 《 ❃ ➠ {userName}.♦\n'
                + 'Female: 》 𝗠𝗘𝗠𝗕𝗘𝗥👥 《 ❃ ➠ {userName}.🎀\n'
                + 'Usage: /autosetname3 on to enable, /autosetname3 off to disable.'
        }
    },

    onStart: async function ({ message, args }) {
        if (args[0] === "on") {
            isEnabled = true;
            return message.reply("The autosetname3 command has been enabled.");
        } else if (args[0] === "off") {
            isEnabled = false;
            return message.reply("The autosetname3 command has been disabled.");
        } else {
            return message.reply("Usage: /autosetname3 <on|off>");
        }
    },

    onEvent: async function ({ message, event, api, threadsData, getLang }) {
        if (!isEnabled) return; // If the command is disabled, exit early
        if (event.logMessageType !== "log:subscribe") return;

        const addedParticipants = [...event.logMessageData.addedParticipants];

        for (const user of addedParticipants) {
            const { userFbId: uid, fullName: userName } = user;
            try {
                // Extract the first name
                const firstName = userName.split(' ')[0];
                
                const userInfo = await api.getUserInfo(uid);
                const gender = userInfo[uid].gender;

                // Use the first name in the nickname format
                const nameFormat = gender === 1 ? 
                    `》 𝗠𝗘𝗠𝗕𝗘𝗥👥 《 ❃ ➠ ${toBoldFont(firstName)}.🎀` : 
                    `》 𝗠𝗘𝗠𝗕𝗘𝗥👥 《 ❃ ➠ ${toBoldFont(firstName)}.♦`;

                // Change the user's nickname in the chat
                await api.changeNickname(nameFormat, event.threadID, uid);
            } catch (e) {
                return message.reply("An error occurred while setting the nickname.");
            }
        }
    }
};
