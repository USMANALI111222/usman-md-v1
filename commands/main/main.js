const { getRuntime } = require("../../utils/helpers");

const ping = {
  name: "ping",
  alias: ["ping2"],
  description: "Check bot speed",
  category: "main",
  async execute({ sock, jid, msg, reply }) {
    const start = Date.now();
    const sent = await sock.sendMessage(jid, { text: "🏓 Pinging..." }, { quoted: msg });
    const end = Date.now();
    await sock.sendMessage(jid, {
      text:
        `╭┈───〔 *PING* 〕┈───⊷\n` +
        `├▢ 🏓 *Pong!*\n` +
        `├▢ ⚡ *Speed:* ${end - start}ms\n` +
        `├▢ ⏱️ *Runtime:* ${getRuntime()}\n` +
        `╰───────────────────⊷`,
    }, { quoted: msg });
  },
};

const alive = {
  name: "alive",
  description: "Check if bot is alive",
  category: "main",
  async execute({ sock, jid, msg }) {
    const config = global.config;
    await sock.sendMessage(jid, {
      text:
        `╭┈───〔 *${config.botName}* 〕┈───⊷\n` +
        `├▢ ✅ *Bot is Alive!*\n` +
        `├▢ 🤖 *Name:* ${config.botName}\n` +
        `├▢ 👤 *Owner:* ${config.ownerName}\n` +
        `├▢ ⏱️ *Uptime:* ${getRuntime()}\n` +
        `├▢ 📦 *Prefix:* ${config.prefix}\n` +
        `├▢ ⚙️ *Mode:* ${config.mode}\n` +
        `╰───────────────────⊷`,
    }, { quoted: msg });
  },
};

const uptime = {
  name: "uptime",
  description: "Show bot uptime",
  category: "main",
  async execute({ reply }) {
    reply(`⏱️ *Uptime:* ${getRuntime()}`);
  },
};

const owner = {
  name: "owner",
  description: "Get owner contact",
  category: "main",
  async execute({ sock, jid, msg }) {
    const config = global.config;
    await sock.sendMessage(jid, {
      text:
        `╭┈───〔 *OWNER* 〕┈───⊷\n` +
        `├▢ 👤 *Name:* ${config.ownerName}\n` +
        `├▢ 📱 *Number:* +${config.ownerNumber}\n` +
        `├▢ 🤖 *Bot:* ${config.botName}\n` +
        `╰───────────────────⊷`,
    }, { quoted: msg });
  },
};

const repo = {
  name: "repo",
  alias: ["github"],
  description: "Bot GitHub repo",
  category: "main",
  async execute({ reply }) {
    reply(
      `╭┈───〔 *REPO* 〕┈───⊷\n` +
      `├▢ 🔗 *GitHub:*\n` +
      `├▢ https://github.com/UsmanTech/USMAN-MD\n` +
      `╰───────────────────⊷`
    );
  },
};

const fetch_cmd = {
  name: "fetch",
  description: "Fetch bot info",
  category: "main",
  async execute({ sock, jid, msg }) {
    const config = global.config;
    const mem = process.memoryUsage();
    await sock.sendMessage(jid, {
      text:
        `╭┈───〔 *FETCH* 〕┈───⊷\n` +
        `├▢ 🤖 *Bot:* ${config.botName}\n` +
        `├▢ 🏷️ *Version:* ${config.version}\n` +
        `├▢ ⏱️ *Runtime:* ${getRuntime()}\n` +
        `├▢ 💾 *RAM:* ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
        `├▢ 📦 *Node:* ${process.version}\n` +
        `├▢ 🖥️ *Platform:* ${process.platform}\n` +
        `╰───────────────────⊷`,
    }, { quoted: msg });
  },
};

module.exports = [ping, alive, uptime, owner, repo, fetch_cmd];
