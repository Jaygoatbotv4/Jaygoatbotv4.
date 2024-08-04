const moment = require('moment-timezone');

module.exports.config = {
  name: "autotime",
  version: "2.0.0",
  role: 0,
  author: "kylepogi", // ninakaw ni jay heheheh laplapin kita!!
  description: "Automatically sends messages based on set times.",
  category: "AutoTime",
  countDown: 3
};

module.exports.onLoad = async ({ api, global }) => {
  const arrayData = {
    "12:00:00 PM": {
      message: "Good afternoon everyone! Don't forget to eat y'all lunch break🍛"
    },
    "01:00:00 AM": {
      message: "Good morning everyone!! Have a nice morning🍞☕🌅"
    },
    "02:00:00 AM": {
      message: "Don't forget to add/follow my owner☺.\n\n📩: https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL"
    },
    "03:00:00 AM": {
      message: "Aga nyo nagising ahh"
    },
    "04:00:00 AM": {
      message: "Gising naba? May mga pasok Dyan??🥱"
    },
    "05:00:00 AM": {
      message: "Tara kain na! Get ready for school na😊😊"
    },
    "06:00:00 AM": {
      message: "Tara punta na sa school erpss🏫"
    },
    "07:00:00 AM": {
      message: "Nasa school napo owner ko😊😊, nasa school narin ba kayo?"
    },
    "08:00:00 AM": {
      message: "Yown natapos rin first period, ay halah, dami pa pala💀"
    },
    "09:00:00 AM": {
      message: "Kapagod haysstt🥵, 15 mins left recess na erps🥟"
    },
    "10:00:00 AM": {
      message: "1 hour and 30 mins pa lunch huyy👹"
    },
    "11:00:00 AM": {
      message: "30 mins pa erps, makapag lunch rin tayo🥟!"
    },
    "12:00:00 PM": {
      message: "PM nyo na owner ko🥹🥹, single po sya😭 📩https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL"
    },
    "01:00:00 PM": {
      message: "Don't forget to eat y'all lunch break😸"
    },
    "02:00:00 PM": {
      message: "Good afternoon!! My owner is so handsome asf😎"
    },
    "03:00:00 PM": {
      message: "Pogi ng owner ko na si Jay 😎"
    },
    "04:00:00 PM": {
      message: "30 mins left uwian na🥂🥳"
    },
    "05:00:00 PM": {
      message: "Check po muna, baka may assignment tayo dyan eh😊 If need po research, gamitin nyo lang 'Ai' cmd ko, no need prefix Po yan😊"
    },
    "06:00:00 PM": {
      message: "Don't forget to eat y'all dinner💀🙏"
    },
    "07:00:00 PM": {
      message: "Ano silbe ng pag online mo kung hindi mo din naman e chachat owner ko😎"
    },
    "08:00:00 PM": {
      message: "Tara tulog napo, Maaga pa bukas HEHE"
    },
    "09:00:00 PM": {
      message: "Matulog na kayo mga hangal😸"
    },
    "10:00:00 PM": {
      message: "Gabi na nag puyat parin kayo💀🙏"
    },
    "11:00:00 PM": {
      message: "Hinde mababawasan kapogian ng owner ko."
    }
  };

  const checkTimeAndSendMessage = () => {
    const now = moment().tz('Asia/Manila');
    const currentTime = now.format('hh:mm:ss A');

    const messageData = arrayData[currentTime];

    if (messageData) {
      const tid = global.db.allThreadData.map(i => i.threadID);
      tid.forEach(async (threadID) => {
        api.sendMessage({
          body: `《《 𝗔𝘂𝘁𝗼 𝗦𝗰𝗵𝗲𝗱𝘂𝗹𝗲 》》\n⏰ Time now - ${currentTime}\n▬▬▬▬▬▬▬▬▬▬▬▬\n📌 ${messageData.message}\n┗━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣`
        }, threadID);
      });
    }

    const nextMinute = moment().add(1, 'minute').startOf('minute');
    const delay = nextMinute.diff(moment());
    setTimeout(checkTimeAndSendMessage, delay);
  };

  checkTimeAndSendMessage();
};

module.exports.onStart = () => {};
