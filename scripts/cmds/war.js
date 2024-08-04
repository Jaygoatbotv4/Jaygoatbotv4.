const runningWars = {};

module.exports = {
  config: {
    name: "war",
    author: "Jay",
    role: 2, // Admin-only command
    category: "test"
  },
  onStart: async function ({ message: { reply, send, text }, event: { mentions, threadID }, usersData: { getName } }) {
    // If the command is "/war stop", stop the war in the current thread
    if (text.trim() === "/war stop") {
      if (runningWars[threadID]) {
        clearInterval(runningWars[threadID]);
        delete runningWars[threadID];
        return reply("War command stopped.");
      } else {
        return reply("No active war command.");
      }
    }

    // Get the mentioned user's ID
    const id = Object.keys(mentions)[0];
    if (!id) {
      return reply("Please mention a user to start the war.");
    }

    // Insult messages
    const fuck = [
      "gumagamit ka nalang bot ingay mo pa tanginaka ket nga siguro reboot ng cp mo di mo alam dami mong satsat ampota",
      "ginagalit mo si Jay tang ina kang tanga ka ahh feeling ranters e katiting kalang kay Jay",
      "paduduguin ko ulo mo ewan kona lang kung dika mag panic",
      "pabigat sa pamilya tanginaka lagay mo na cp mo paluin ka mamaya di kapa nag hugas plato HAHAHAHA tanga ampota",
      "asa sa magulang feeling coolkid ang cool mo naman tanginamo pwede kana mamatay",
      "syempre mag rereply ka dito tanga ka eh alam mong bot kakausapin mo ulol kanaba?",
      "feeling coolkid amputa babatukan lang kita e",
      "kaya paba? pag naluluha kana stop na ah leave na awa ako sayo eh bata",
      "baka ikaw yung 16 years old na nag cocomment sabi ng minor ah ulol HAHAHAHAHA",
      "Walis kana ng bahay nyo tamo lilipad tsinelas sa mukha mo mamaya",
      "tanginaka ginigigil mo bot ko sarap mong i sidekick with recall putanginaka.",
      "gulat ka no ? HAHAHAHA tanga ka kase d moto alam",
      "nagrereply ka palang minumura na kita tanginamo",
      "shempre rereply ka ule dito yakk ilalabas mo pagiging coolkid mo frfr istg",
      "baka pag in-english kita pati nanay mo mahimatay",
      "wala kang masabi? malamang tanga ka gago ka putangina kang nigga ka HAHAHAHAHA",
      "pokpok ka putang ina nagmana sa mama",
      "ano wala nabang mahanap na foreigner mama mo kasi walang wala na kayo tas dumagdag kapang pabigat ka HAHAHAHA putang ina mo mamatay kana",
      "wag kana mag Facebook bulok ka naman putang ina ka nigga",
      "sa isip ko palang kinantot na kita bobo",
      "mas malalim pa puke mo kesa sa iniisip ko",
      "delete Facebook kana tanga tang ina ka",
      "fuck you nigga, mabaho puke mo",
      "bye iyak na iyak kana jan e HAHAHA iyakin kapa naman tanga ka",
      "till next time gago bye na pasok kana sa aquarium mo bawal ka sa lupa mukha kang wtf",
      "Putang Ina mo wth, ur so immature asf, pinagaral Kaba ng magulang mo huh, Baka gusto mo pag pa seminar Kay Tyga, gusto mo pakantot kita Kay Tyga, kupal, bobo ABNO PUTANG INA MOO🖕🏾🤷🏾‍♂️🤮🤣🤣🤣, mahina Kapa bobo Duwag, hangal buboo HAHAHAHHAHAHAHAH🖕🏾🖕🏾🖕🏾",
      "Hangal Kaba huh? Sabi ka lang baka bobo ka🤣🤣,pinag sasabi mo huh?ge atay ka,bisakol kanga bulok pa🤣🤣💀☕",
      "Pinagsasabi mo huh???wtf,ur so immature,dumbasf kiddo,gusto mo pakantot kita Kay Fernando💀💀🤣, bulok mga pinag sasabi mo lolll spammer pa amp HHAHAHAHAHAHAHAHA💀🗿☕☕☕☕",
      "Sabi kalang baka bayot ka WHAHAHAHAHA,lolll,wag mo ipairal pagiging Bata,pangit Kasi humor,pang abno AHHAHAHA🤣🤣🤣",
      "TANGINA MO LAMUNIN MO YANG TAE MO PUTANGINA MO DAHIL DI AKO PATAY GUTOM SA PERA MONG BATA KA MUKHA KANG HALIPAROT CHAKO GALIT NA GALIT SAYO MGA MAGULANG MO DI KAPA NAKAKA TULONG SALOT KANA PUTANGINA MO🤣🤣🤣🤣",
      "pukenanginamo, bobo, tanga, walang pinag-aralan, mang mang, sinto². walang ma-oop. gago, hayop, shit, fuck, shibal, tonta/o.hayop ka. madapa ka sana, pwe. baho, basura, kanal, mapanghe🤣🤣🤣🖕🏾🖕🏾",
      "WTF HAHAHAHAHAHAH🤣🤣🤣",
      "HOY PUTANGINA MO YUNG MGA BARKADA MO NANGBABATO SA BAHAY NAMIN HA WAG KAYONG MANG BABATO SA BAHAY NAMIN HA PUTANGINA MO😡😡😡🤣🤣🤣🤣",
      "āsintādø sinasamba🙏 āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏",
      "Bobo🤣🤣",
      "Tanga-🤣🖕🏾",
      "Inutil🖕🏾",
      "Anoo,bat antagal mo mag type hina mooo HAHAHAHA🤣🤣🤣",
      "Buti alam mong bayot ka HAHAHAHAH🤣🤣",
      "Gusto mo pa kantut kita Kay Tyga WHAHAHAHAH🤣🤣",
      "OBOB KABA HAHAHAHAHHA🤣🤣🖕🏾",
      "INA MOO MAMATAY NA KAYO NANG PAMILYA MO HAHAHAHHA🤣🤣",
      "Sabog Kaba HAHAHAHAH🤣🤣",
      "Tara sama ka sakin may pupuntahan ko,Sama kana sakin pa tingin kita sa konduktor,BALIW NA EH AHHAHAHAHAHAH🤣🤣",
      "Gusto mo PATAYIN Kona kayo nang pamilya mo🤣🤣🤣",
      "OK LANG YAN,GANYAN TALAGA KAPAG,NASAPAK KA SA UTAK EH HAHAHA☕🗿",
      "GASTADORRR🤣🤣",
      "PUTA,DAMI MONG SATSAT,WAG KOLANG MALALAMAN NA NAIYAK KANA HAHAHAHAH🤣🤣",
      "KAPAL NMN NANG MUKHA MO NOHH BAKA GUSTO MO SAPKIN KO YANG UTAK MO🤣",
      "LOLL🤣🤣",
      "SLOW TYPER BA HAHAHAHHA🤣🤣",
      "MAHINA🥱",
      "BOBO🤡",
      "KUPAL🤣🤣",
      "ANO NAAA,NAIYAK KANABA HAHAHAHAHHAHAHAH🤣🤣🤣",
      "BISAKOL KANG HAMBOG KA ANO,NAIYAK KANABA HAHAHHA🤣🤣",
      "IYAKIN AMP HAHAHAHHAHA🤣🤣",
      "ANO PALAG HAHAHAHAHHA,PALIBHASA TANGA KA🤣🤣🤡",
      "āsintādø sinasamba🙏 āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏āsintādø sinasamba🙏",
      "TANGA TANGA TANGA🤡🤡🤡-TANGA TANGA TANGA🤡🤡🤡-TANGA TANGA TANGA🤡🤡🤡-TANGA TANGA TANGA🤡🤡🤡",
      "BOBO", "TANGA", "INUTIL", "BANO BA HAHAHAH🤣🤣🤣", "BAYOT", "BADING", "AKLA HAHAHAHAHA🤣🤣"
    ];

    const tag = await getName(id);

    // If a war is already running in this thread, notify the user
    if (runningWars[threadID]) {
      return reply("A war is already active in this chat.");
    }

    // Start sending messages repeatedly
    runningWars[threadID] = setInterval(() => {
      fuck.forEach((insult, i) => {
        setTimeout(() => {
          send({
            body: `${insult} @${tag}`,
            mentions: [{ tag, id }]
          });
        }, i * 500); // Adjust the delay as needed (500ms between messages)
      });
    }, fuck.length * 500 + 500); // Repeats after all insults have been sent

    reply(`War has started against ${tag}. Use "/war stop" to end it.`);
  }
};
