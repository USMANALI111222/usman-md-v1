const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const sticker = {
  name: "sticker",
  alias: ["s", "stiker"],
  description: "Convert image/video to sticker",
  category: "tools",
  async execute({ sock, jid, msg, reply }) {
    const config = global.config;
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imgMsg = msg.message?.imageMessage || quoted?.imageMessage;
    const vidMsg = msg.message?.videoMessage || quoted?.videoMessage;

    if (!imgMsg && !vidMsg) return reply("❌ Reply to an image or video!\nUsage: .sticker");

    await reply("⏳ *Creating sticker...*");

    try {
      const mediaMsg = imgMsg || vidMsg;
      const media = await sock.downloadMediaMessage(
        { message: { imageMessage: imgMsg, videoMessage: vidMsg }, ...msg },
        "buffer"
      );

      const tmpIn = path.join("/tmp", `stk_in_${Date.now()}.${imgMsg ? "jpg" : "mp4"}`);
      const tmpOut = path.join("/tmp", `stk_out_${Date.now()}.webp`);
      fs.writeFileSync(tmpIn, media);

      if (imgMsg) {
        execSync(`ffmpeg -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2" "${tmpOut}" -y`);
      } else {
        execSync(`ffmpeg -i "${tmpIn}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2,fps=15" -t 6 "${tmpOut}" -y`);
      }

      await sock.sendMessage(
        jid,
        {
          sticker: fs.readFileSync(tmpOut),
          ...(config.packName ? { packName: config.packName, packPublish: config.packPublish } : {}),
        },
        { quoted: msg }
      );

      fs.unlinkSync(tmpIn);
      fs.unlinkSync(tmpOut);
    } catch (e) {
      reply("❌ Error creating sticker. Make sure ffmpeg is installed!\nTermux: `pkg install ffmpeg`");
    }
  },
};

const calculate = {
  name: "calculate",
  alias: ["calc", "math"],
  description: "Calculate math expression",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .calculate 2+2");
    try {
      const expr = args.join(" ").replace(/[^0-9+\-*/().% ]/g, "");
      const result = eval(expr);
      reply(`🧮 *Calculator*\n\n📝 Expression: ${expr}\n✅ Result: *${result}*`);
    } catch {
      reply("❌ Invalid expression!");
    }
  },
};

const timenow = {
  name: "timenow",
  alias: ["time", "date"],
  description: "Get current time and date",
  category: "utility",
  async execute({ reply }) {
    const now = new Date();
    reply(
      `╭┈───〔 *TIME* 〕┈───⊷\n` +
      `├▢ 📅 *Date:* ${now.toLocaleDateString("en-PK")}\n` +
      `├▢ ⏰ *Time:* ${now.toLocaleTimeString("en-PK")}\n` +
      `├▢ 🌍 *Timezone:* PKT (UTC+5)\n` +
      `╰───────────────────⊷`
    );
  },
};

const id = {
  name: "id",
  description: "Get user/group ID",
  category: "utility",
  async execute({ jid, sender, isGroup, reply }) {
    reply(
      `╭┈───〔 *ID INFO* 〕┈───⊷\n` +
      `├▢ 👤 *Your ID:* ${sender}\n` +
      (isGroup ? `├▢ 👥 *Group ID:* ${jid}\n` : "") +
      `╰───────────────────⊷`
    );
  },
};

const binary = {
  name: "binary",
  description: "Convert text to binary",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .binary hello");
    const text = args.join(" ");
    const bin = text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    reply(`📟 *Binary:*\n${bin}`);
  },
};

const dbinary = {
  name: "dbinary",
  description: "Decode binary to text",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .dbinary 01101000 01100101");
    try {
      const text = args.join(" ").split(" ").map((b) => String.fromCharCode(parseInt(b, 2))).join("");
      reply(`📝 *Decoded:* ${text}`);
    } catch {
      reply("❌ Invalid binary!");
    }
  },
};

const base64 = {
  name: "base64",
  description: "Encode text to Base64",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .base64 text");
    const encoded = Buffer.from(args.join(" ")).toString("base64");
    reply(`🔐 *Base64:*\n${encoded}`);
  },
};

const unbase64 = {
  name: "unbase64",
  description: "Decode Base64",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .unbase64 dGV4dA==");
    try {
      const decoded = Buffer.from(args.join(" "), "base64").toString("utf-8");
      reply(`📝 *Decoded:* ${decoded}`);
    } catch {
      reply("❌ Invalid Base64!");
    }
  },
};

const urlencode = {
  name: "urlencode",
  description: "URL encode text",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .urlencode text here");
    reply(`🔗 *URL Encoded:*\n${encodeURIComponent(args.join(" "))}`);
  },
};

const urldecode = {
  name: "urldecode",
  description: "URL decode text",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .urldecode text%20here");
    try {
      reply(`📝 *URL Decoded:*\n${decodeURIComponent(args.join(" "))}`);
    } catch {
      reply("❌ Invalid URL encoded text!");
    }
  },
};

const fancy = {
  name: "fancy",
  description: "Convert text to fancy style",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .fancy your text");
    const text = args.join(" ");
    const fancyChars = {
      a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰",
      h: "𝓱", i: "𝓲", j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷",
      o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽", u: "𝓾",
      v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃",
    };
    const fancyText = text.toLowerCase().split("").map((c) => fancyChars[c] || c).join("");
    reply(`✨ *Fancy Text:*\n${fancyText}`);
  },
};

const tiny_cmd = {
  name: "tiny",
  description: "Convert text to tiny",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .tiny your text");
    const map = {
      a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",
      m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",q:"ᵠ",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ"
    };
    const result = args.join(" ").toLowerCase().split("").map((c) => map[c] || c).join("");
    reply(`🔡 *Tiny Text:*\n${result}`);
  },
};

const uptime_cmd = {
  name: "uptime",
  description: "Show bot uptime",
  category: "utility",
  async execute({ reply }) {
    const { getRuntime } = require("../../utils/helpers");
    reply(`⏱️ *Bot Uptime:* ${getRuntime()}`);
  },
};

const npmpkg = {
  name: "npm",
  description: "Check NPM package info",
  category: "utility",
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .npm package-name");
    try {
      const res = await fetch(`https://registry.npmjs.org/${args[0]}`);
      const data = await res.json();
      reply(
        `📦 *NPM Package*\n\n` +
        `🏷️ *Name:* ${data.name}\n` +
        `📌 *Latest:* ${data["dist-tags"]?.latest}\n` +
        `📝 *Description:* ${data.description}\n` +
        `👤 *Author:* ${data.author?.name || "Unknown"}`
      );
    } catch {
      reply("❌ Package not found!");
    }
  },
};

module.exports = [
  sticker, calculate, timenow, id, binary, dbinary,
  base64, unbase64, urlencode, urldecode, fancy, tiny_cmd, uptime_cmd, npmpkg
];

