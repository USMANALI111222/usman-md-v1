const block = {
  name: "block",
  description: "Block a user",
  category: "owner",
  ownerOnly: true,
  async execute({ sock, msg, args, reply }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    if (!target) return reply("❌ Tag or provide a number!\nUsage: .block @user");
    await sock.updateBlockStatus(target, "block");
    reply(`✅ *Blocked:* @${target.split("@")[0]}`);
  },
};

const unblock = {
  name: "unblock",
  description: "Unblock a user",
  category: "owner",
  ownerOnly: true,
  async execute({ sock, msg, args, reply }) {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net" : null);
    if (!target) return reply("❌ Tag or provide a number!");
    await sock.updateBlockStatus(target, "unblock");
    reply(`✅ *Unblocked:* @${target.split("@")[0]}`);
  },
};

const leave = {
  name: "leave",
  description: "Bot leaves current group",
  category: "owner",
  ownerOnly: true,
  groupOnly: true,
  async execute({ sock, jid, reply }) {
    await reply("👋 *Leaving...*");
    await sock.groupLeave(jid);
  },
};

const mode = {
  name: "mode",
  description: "Change bot mode",
  category: "owner",
  ownerOnly: true,
  async execute({ args, reply }) {
    const modes = ["public", "private", "groups", "inbox"];
    if (!args[0] || !modes.includes(args[0].toLowerCase())) {
      return reply(`❌ Usage: .mode <${modes.join(" | ")}>`);
    }
    global.config.mode = args[0].toLowerCase();
    reply(`✅ *Mode changed to:* ${global.config.mode}`);
  },
};

const prefix_cmd = {
  name: "prefix",
  description: "Change bot prefix",
  category: "owner",
  ownerOnly: true,
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .prefix !");
    global.config.prefix = args[0];
    reply(`✅ *Prefix changed to:* ${args[0]}`);
  },
};

const botname = {
  name: "botname",
  description: "Change bot name",
  category: "owner",
  ownerOnly: true,
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .botname NewName");
    global.config.botName = args.join(" ");
    reply(`✅ *Bot name changed to:* ${global.config.botName}`);
  },
};

const ownername = {
  name: "ownername",
  description: "Change owner name",
  category: "owner",
  ownerOnly: true,
  async execute({ args, reply }) {
    if (!args[0]) return reply("❌ Usage: .ownername NewName");
    global.config.ownerName = args.join(" ");
    reply(`✅ *Owner name changed to:* ${global.config.ownerName}`);
  },
};

const statusview = {
  name: "statusview",
  description: "Toggle auto status view",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.statusView = !global.config.statusView;
    reply(`✅ *Status View:* ${global.config.statusView ? "ON" : "OFF"}`);
  },
};

const autoread = {
  name: "autoread",
  description: "Toggle auto read messages",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.autoRead = !global.config.autoRead;
    reply(`✅ *Auto Read:* ${global.config.autoRead ? "ON" : "OFF"}`);
  },
};

const autoreact = {
  name: "autoreact",
  description: "Toggle auto react",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.autoReact = !global.config.autoReact;
    reply(`✅ *Auto React:* ${global.config.autoReact ? "ON" : "OFF"}`);
  },
};

const anticall = {
  name: "anticall",
  description: "Toggle anti call",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.antiCall = !global.config.antiCall;
    reply(`✅ *Anti Call:* ${global.config.antiCall ? "ON" : "OFF"}`);
  },
};

const antilink = {
  name: "antilink",
  description: "Toggle anti link in groups",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.antiLink = !global.config.antiLink;
    reply(`✅ *Anti Link:* ${global.config.antiLink ? "ON" : "OFF"}`);
  },
};

const antidelete = {
  name: "antidelete",
  description: "Toggle anti delete",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.antiDelete = !global.config.antiDelete;
    reply(`✅ *Anti Delete:* ${global.config.antiDelete ? "ON" : "OFF"}`);
  },
};

const welcome_cmd = {
  name: "welcome",
  description: "Toggle welcome message",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.welcome = !global.config.welcome;
    reply(`✅ *Welcome:* ${global.config.welcome ? "ON" : "OFF"}`);
  },
};

const goodbye_cmd = {
  name: "goodbye",
  description: "Toggle goodbye message",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    global.config.goodbye = !global.config.goodbye;
    reply(`✅ *Goodbye:* ${global.config.goodbye ? "ON" : "OFF"}`);
  },
};

const settings_cmd = {
  name: "settings",
  description: "Show all settings",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    const c = global.config;
    reply(
      `╭┈───〔 *SETTINGS* 〕┈───⊷\n` +
      `├▢ 🤖 *Bot:* ${c.botName}\n` +
      `├▢ 👤 *Owner:* ${c.ownerName}\n` +
      `├▢ 📦 *Prefix:* ${c.prefix}\n` +
      `├▢ ⚙️ *Mode:* ${c.mode}\n` +
      `├▢ 👋 *Welcome:* ${c.welcome ? "ON" : "OFF"}\n` +
      `├▢ 👋 *Goodbye:* ${c.goodbye ? "ON" : "OFF"}\n` +
      `├▢ 📖 *AutoRead:* ${c.autoRead ? "ON" : "OFF"}\n` +
      `├▢ ❤️ *AutoReact:* ${c.autoReact ? "ON" : "OFF"}\n` +
      `├▢ 🔗 *AntiLink:* ${c.antiLink ? "ON" : "OFF"}\n` +
      `├▢ 🗑️ *AntiDelete:* ${c.antiDelete ? "ON" : "OFF"}\n` +
      `├▢ ☎️ *AntiCall:* ${c.antiCall ? "ON" : "OFF"}\n` +
      `├▢ 👁️ *StatusView:* ${c.statusView ? "ON" : "OFF"}\n` +
      `╰───────────────────⊷`
    );
  },
};

const update = {
  name: "update",
  description: "Check for bot update",
  category: "owner",
  ownerOnly: true,
  async execute({ reply }) {
    reply(
      `╭┈───〔 *UPDATE* 〕┈───⊷\n` +
      `├▢ 🏷️ *Current:* ${global.config.version}\n` +
      `├▢ 🔗 *Repo:* https://github.com/UsmanTech/USMAN-MD\n` +
      `├▢ 📝 *Check GitHub for latest updates*\n` +
      `╰───────────────────⊷`
    );
  },
};

module.exports = [
  block, unblock, leave, mode, prefix_cmd, botname, ownername,
  statusview, autoread, autoreact, anticall, antilink, antidelete,
  welcome_cmd, goodbye_cmd, settings_cmd, update
];
