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

module.exports.onLoad = async ({ api }) => {
  const arrayData = {
    "12:00:00 PM": {
      message: "good afternoon everyone don't forget to eat y'all lunch break🍛"
    },
    "01:00:00 AM": {
      message: "good morning everyone!!, have a nice morning🍞☕🌅"
    },
    "02:00:00 AM": {
      message: "don't forget to add/follow my owner☺.\n\n📩: https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL"
    },
    "03:00:00 AM": {
      message: "aga nyo nagising ahh"
    },
    "04:00:00 AM": {
      message: "Gising naba may mga pasok Dyan??🥱"
    },
    "05:00:00 AM": {
      message: "Tara kain na get ready for school na😊😊"
    },
    "06:00:00 AM": {
      message: "Tara punta na sa scholl erpss🏫"
    },
    "07:00:00 AM": {
      message: "Nasa school napo owner ko😊😊,nasa school narin ba kayo?"
    },
    "08:00:00 AM": {
      message: "Yown natapos rin first period,ay halah,dami pa pala💀"
    },
    "09:00:00 AM": {
      message: "Kapagod haysstt🥵,15 mins left recess na erps🥟"
    },
    "10:00:00 AM": {
      message: "1hour and 30 mins pa lunch huyy👹"
    },
    "11:00:00 AM": {
      message: "30mins pa erps makapag lunch rin tayo🥟!"
    },
    "12:00:00 PM": {
      message: "Pm nyona owner ko🥹🥹,single po sya😭 📩https://www.facebook.com/jayboy.pillonar?mibextid=ZbWKwL"
    },
    "01:00:00 PM": {
      message: "don't forget to eat y'all lunch break😸"
    },
    "02:00:00 PM": {
      message: "good afternoon!!, my owner is so handsome asf😎"
    },
    "03:00:00 PM": {
      message: "pogi ng owner ko na si Jay 😎"
    },
    "04:00:00 PM": {
      message: "30mins left uwian na🥂🥳"
    },
    "05:00:00 PM": {
      message: "Check po muna,baka may assignment tayo dyan eh😊/if need po research gamitin nyo lang "Ai"cmd ko no need prefix Po yan😊"
    },
    "06:00:00 PM": {
      message: "don't forget to eat y'all dinner💀🙏"
    },
    "07:00:00 PM": {
      message: "ano silbe ng pag online mo kung hinde mo din naman e chachat owner ko😎"
    },
    "08:00:00 PM": {
      message: "Tara tulog napo,Maaga pa bukas HEHE"
    },
    "09:00:00 PM": {
      message: "matulog na kayo mga hangal😸"
    },
    "10:00:00 PM": {
      message: "gabi na nag puyat parin kayo💀🙏"
    },
    "11:00:00 PM": {
      message: "hinde mababawasan kapogian ng owner ko."
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
          body: `《《 𝗔𝘂𝘁𝗼 𝗦𝗰𝗵𝗲𝗱𝘂𝗹𝗲 》》\n⏰ time now - ${currentTime}\n▬▬▬▬▬▬▬▬▬▬▬▬\n📌 ${messageData.message}\n┗━━ [ 𝗠𝗶𝗰𝗮🎀 ]━━➣`
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
