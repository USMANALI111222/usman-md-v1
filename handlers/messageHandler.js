const config = require("../config");
const { getContentType } = require("@whiskeysockets/baileys");
const logger = require("../utils/logger");
const { getRuntime } = require("../utils/helpers");
const fs = require("fs");
const path = require("path");

// Load all commands
const commandsPath = path.join(__dirname, "../commands");
const commands = new Map();

function loadCommands() {
  const folders = fs.readdirSync(commandsPath);
  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".js"));
    for (const file of files) {
      try {
        const cmd = require(path.join(folderPath, file));
        if (Array.isArray(cmd)) {
          cmd.forEach((c) => commands.set(c.name, c));
        } else if (cmd.name) {
          commands.set(cmd.name, cmd);
        }
      } catch (e) {
        logger.error(`Error loading command ${file}:`, e.message);
      }
    }
  }
  logger.info(`✅ Loaded ${commands.size} commands`);
}

loadCommands();
global.commands = commands;

async function handleMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  const isGroup = jid.endsWith("@g.us");
  const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
  const senderNum = sender?.replace("@s.whatsapp.net", "").replace(/[^0-9]/g, "");
  const fromMe = msg.key.fromMe;

  const isOwner =
    senderNum === config.ownerNumber.replace(/[^0-9]/g, "") ||
    senderNum === config.ownerNumber2?.replace(/[^0-9]/g, "") ||
    senderNum === config.ownerNumber3?.replace(/[^0-9]/g, "") ||
    fromMe;

  const msgType = getContentType(msg.message);
  const body =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    msg.message?.documentMessage?.caption ||
    "";

  // Auto Read
  if (config.autoRead) {
    await sock.readMessages([msg.key]);
  }

  // Auto React
  if (config.autoReact && body) {
    const emojis = ["❤️", "🔥", "👍", "😂", "🥳"];
    await sock.sendMessage(jid, {
      react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: msg.key },
    });
  }

  // Check prefix
  const prefix = config.prefix;
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();

  // Mode check
  if (config.mode === "private" && !isOwner) return;
  if (config.mode === "groups" && !isGroup) return;
  if (config.mode === "inbox" && isGroup && !isOwner) return;

  const command = commands.get(cmdName);
  if (!command) return;

  // Owner only check
  if (command.ownerOnly && !isOwner) {
    return sock.sendMessage(jid, { text: "❌ *This command is for owner only!*" });
  }

  // Group only check
  if (command.groupOnly && !isGroup) {
    return sock.sendMessage(jid, { text: "❌ *This command can only be used in groups!*" });
  }

  // Admin check
  let isAdmin = false;
  let isBotAdmin = false;
  if (isGroup) {
    try {
      const groupMeta = await sock.groupMetadata(jid);
      const admins = groupMeta.participants.filter((p) => p.admin);
      isAdmin = admins.some((a) => a.id === sender);
      isBotAdmin = admins.some(
        (a) => a.id === sock.user.id || a.id === sock.user.id.replace(/:.*/, "") + "@s.whatsapp.net"
      );
    } catch (e) {}
  }

  if (command.adminOnly && !isAdmin && !isOwner) {
    return sock.sendMessage(jid, { text: "❌ *This command is for group admins only!*" });
  }

  const ctx = {
    sock,
    msg,
    jid,
    sender,
    senderNum,
    isOwner,
    isGroup,
    isAdmin,
    isBotAdmin,
    args,
    body,
    msgType,
    prefix,
    reply: (text) => sock.sendMessage(jid, { text }, { quoted: msg }),
    react: (emoji) => sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }),
  };

  try {
    await ctx.react("⏳");
    await command.execute(ctx);
  } catch (e) {
    logger.error(`Error in command ${cmdName}:`, e);
    await ctx.reply(`❌ *Error:* ${e.message}`);
    await ctx.react("❌");
  }
}

module.exports = { handleMessage, commands };
