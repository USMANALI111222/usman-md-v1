const jokes = [
  "Teacher: Why are you late?\nStudent: I was dreaming about a WhatsApp bot!\nTeacher: That's still no excuse! 😂",
  "Why don't scientists trust atoms?\nBecause they make up everything! 😂",
  "Meri zindagi ka sabse bada dukh?\nWifi ka password bhool jana! 😭",
  "Beta: Papa mobile dijiye\nPapa: Kal deta hoon\nBeta: Par aap kal bhi yahi kehte ho!\nPapa: Isliye toh kal keh raha hoon! 😂",
  "Doctor: Aap saste phone use karte ho?\nPatient: Nahi, premium phone liya hai\nDoctor: Toh battery khatam kyun hai zindagi ki? 😂",
];

const quotes = [
  "Zindagi mein mushkilein hain toh solutions bhi hain! 💪",
  "Kamyabi woh hoti hai jo mehnat se milti hai, luck se nahi! 🔥",
  "Kal ki parwah mat karo, aaj ko behtar banao! ✨",
  "Haar mat mano, koshish karte raho! 💯",
  "Sapne woh nahi jo neend mein aate hain, sapne woh hain jo sone nahi dete! 🌟",
];

const shaayari = [
  "Dil mera toot gaya hai,\nLekin umeed baaki hai,\nZindagi ki raah mein,\nMeri manzil baaki hai... 💔",
  "Mohabbat karna seekho,\nNafrat chhod do yaar,\nYeh duniya sundar hai,\nAgar dekho pyar se... ❤️",
  "Teri yaad mein kho gaya hoon,\nHar pal tujhe dhundta hoon,\nKaash tu mere paas hoti,\nIs tanhai mein... 🌙",
];

const roasts_list = [
  "Tujhe dekh ke laga tha gravity ne galti ki! 😂",
  "Teri tasveer camera ne bhi sad face ke saath khinchi hogi! 😂",
  "Tu itna tez hai jitni old Nokia ki battery life! 😂",
  "Brain hai tera? Ya sirf decoration ke liye rakha hai? 😂",
  "Teri wifi speed se tez mera tortoise hai! 🐢😂",
];

const eightball_answers = [
  "Bilkul! 🎱", "Haan! ✅", "Sahi ho tum! 👍",
  "Nahi bilkul nahi! ❌", "Shayad! 🤷", "Try karo! 💪",
  "Future unclear hai! 🔮", "Dubara poocho! 🔄",
  "Signs say yes! ✨", "Mujhe nahi pata! 😅",
];

const joke = {
  name: "joke",
  description: "Get a random joke",
  category: "fun",
  async execute({ reply }) {
    reply(jokes[Math.floor(Math.random() * jokes.length)]);
  },
};

const quote = {
  name: "quote",
  description: "Get a motivational quote",
  category: "fun",
  async execute({ reply }) {
    reply(quotes[Math.floor(Math.random() * quotes.length)]);
  },
};

const shayari = {
  name: "shayari",
  description: "Get Urdu shayari",
  category: "fun",
  async execute({ reply }) {
    reply(shaayari[Math.floor(Math.random() * shaayari.length)]);
  },
};

const roast = {
  name: "roast",
  description: "Roast someone",
  category: "fun",
  async execute({ sock, jid, msg, args, reply }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0];
    const roastText = roasts_list[Math.floor(Math.random() * roasts_list.length)];
    if (target) {
      await sock.sendMessage(
        jid,
        { text: `@${target.split("@")[0]} ${roastText}`, mentions: [target] },
        { quoted: msg }
      );
    } else {
      reply(roastText);
    }
  },
};

const eightball = {
  name: "8ball",
  description: "Ask the magic 8 ball",
  category: "fun",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Ask a question!\nUsage: .8ball Will I pass?");
    const answer = eightball_answers[Math.floor(Math.random() * eightball_answers.length)];
    reply(`🎱 *8Ball says:* ${answer}`);
  },
};

const ship = {
  name: "ship",
  description: "Ship two users",
  category: "fun",
  async execute({ sock, jid, msg, args, reply }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length < 2) return reply("❌ Tag 2 users!\nUsage: .ship @user1 @user2");
    const percent = Math.floor(Math.random() * 101);
    const bar = "█".repeat(Math.floor(percent / 10)) + "░".repeat(10 - Math.floor(percent / 10));
    await sock.sendMessage(
      jid,
      {
        text:
          `💘 *SHIP METER* 💘\n\n` +
          `@${mentioned[0].split("@")[0]} ❤️ @${mentioned[1].split("@")[0]}\n\n` +
          `[${bar}] ${percent}%\n\n` +
          (percent >= 70 ? "🔥 Perfect Match!" : percent >= 40 ? "💕 Good Pair!" : "😅 Maybe not..."),
        mentions: mentioned,
      },
      { quoted: msg }
    );
  },
};

const lovetest = {
  name: "lovetest",
  description: "Love compatibility test",
  category: "fun",
  async execute({ sock, jid, msg, args, reply }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length < 2) return reply("❌ Tag 2 users!\nUsage: .lovetest @user1 @user2");
    const percent = Math.floor(Math.random() * 101);
    await sock.sendMessage(
      jid,
      {
        text:
          `💖 *LOVE TEST* 💖\n\n` +
          `@${mentioned[0].split("@")[0]} + @${mentioned[1].split("@")[0]}\n\n` +
          `❤️ Love: ${percent}%\n` +
          (percent > 80 ? "💍 Shaadi kar lo!" : percent > 50 ? "😍 Dil mil gaye!" : "😅 Abhi nahi!"),
        mentions: mentioned,
      },
      { quoted: msg }
    );
  },
};

const aura = {
  name: "aura",
  description: "Check your aura",
  category: "fun",
  async execute({ sock, jid, msg, sender }) {
    const auras = ["💜 Purple - Mysterious", "🔴 Red - Passionate", "🔵 Blue - Calm", "🟢 Green - Peaceful", "🟡 Yellow - Joyful", "⚫ Black - Powerful"];
    const aura = auras[Math.floor(Math.random() * auras.length)];
    await sock.sendMessage(jid, {
      text: `✨ *AURA CHECK* ✨\n\n@${sender.split("@")[0]}'s Aura:\n${aura}`,
      mentions: [sender],
    }, { quoted: msg });
  },
};

const coinflip = {
  name: "coinflip",
  alias: ["flip"],
  description: "Flip a coin",
  category: "fun",
  async execute({ reply }) {
    reply(`🪙 *Coin Flip:* ${Math.random() > 0.5 ? "Heads! 👑" : "Tails! 🦅"}`);
  },
};

const rate = {
  name: "rate",
  description: "Rate something",
  category: "fun",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .rate something");
    const score = Math.floor(Math.random() * 11);
    reply(`⭐ *Rating for "${args.join(" ")}"*\n\n${score}/10 ${"⭐".repeat(score)}${"☆".repeat(10 - score)}`);
  },
};

const dare = {
  name: "dare",
  description: "Get a dare challenge",
  category: "fun",
  async execute({ reply }) {
    const dares = [
      "Send your last photo to 5 people! 📸",
      "Change your profile pic to a cartoon for 1 hour! 🤪",
      "Send a voice note singing! 🎤",
      "Post a story with your most embarrassing photo! 😱",
      "Call your crush right now! 📞",
    ];
    reply(`🎯 *DARE:*\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
  },
};

const truth = {
  name: "truth",
  description: "Get a truth question",
  category: "fun",
  async execute({ reply }) {
    const truths = [
      "Apna pehla crush batao? 💕",
      "Kabhi kisi ki cheez churai? 😅",
      "Apne teacher se kabhi jhutha maaafi manga? 🙈",
      "Last time kab roya? 😢",
      "Apna sabse bada secret batao! 🤫",
    ];
    reply(`💭 *TRUTH:*\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
  },
};

const motivate = {
  name: "motivate",
  description: "Get motivation",
  category: "fun",
  async execute({ reply }) {
    const motivations = [
      "💪 Tum kar sakte ho! Bas koshish karo!",
      "🔥 Haar maan lena option nahi hai!",
      "⭐ Har mushkil ke baad asaani hai!",
      "🚀 Apne sapnon ko mat chhodo!",
      "✨ Tum bahut special ho! Yaad rakhna!",
    ];
    reply(motivations[Math.floor(Math.random() * motivations.length)]);
  },
};

const compatibility = {
  name: "compatibility",
  description: "Compatibility test",
  category: "fun",
  async execute({ sock, jid, msg }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length < 2) return;
    const percent = Math.floor(Math.random() * 101);
    await sock.sendMessage(jid, {
      text: `🔥 *COMPATIBILITY*\n\n@${mentioned[0].split("@")[0]} & @${mentioned[1].split("@")[0]}\n\n${percent}% compatible!`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};

const kiss = {
  name: "kiss",
  description: "Send a kiss",
  category: "fun",
  async execute({ sock, jid, msg, sender }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || sender;
    await sock.sendMessage(jid, {
      text: `😘 @${sender.split("@")[0]} kissed @${target.split("@")[0]}! 💋`,
      mentions: [sender, target],
    }, { quoted: msg });
  },
};

const hug = {
  name: "hug",
  description: "Send a hug",
  category: "fun",
  async execute({ sock, jid, msg, sender }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || sender;
    await sock.sendMessage(jid, {
      text: `🤗 @${sender.split("@")[0]} hugged @${target.split("@")[0]}! ❤️`,
      mentions: [sender, target],
    }, { quoted: msg });
  },
};

const slap = {
  name: "slap",
  description: "Slap someone",
  category: "fun",
  async execute({ sock, jid, msg, sender }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0];
    if (!target) return;
    await sock.sendMessage(jid, {
      text: `👋 @${sender.split("@")[0]} slapped @${target.split("@")[0]}! 😵`,
      mentions: [sender, target],
    }, { quoted: msg });
  },
};

const dance = {
  name: "dance",
  description: "Do a dance",
  category: "fun",
  async execute({ sock, jid, msg, sender }) {
    await sock.sendMessage(jid, {
      text: `💃 @${sender.split("@")[0]} is dancing! 🕺🎵`,
      mentions: [sender],
    }, { quoted: msg });
  },
};

module.exports = [
  joke, quote, shayari, roast, eightball, ship, lovetest,
  aura, coinflip, rate, dare, truth, motivate, compatibility,
  kiss, hug, slap, dance
];
