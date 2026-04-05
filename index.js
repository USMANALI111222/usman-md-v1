const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode,
  proto,
  getContentType,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const figlet = require("figlet");
const readline = require("readline");

const config = require("./config");
const { handleMessage } = require("./handlers/messageHandler");
const { handleGroupUpdate } = require("./handlers/groupHandler");
const logger = require("./utils/logger");

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

global.store = store;
global.config = config;
global.startTime = Date.now();

function question(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, (ans) => { rl.close(); resolve(ans.trim()); }));
}

async function startBot() {
  console.clear();
  console.log(
    chalk.cyan(
      figlet.textSync("USMAN-MD", { horizontalLayout: "full" })
    )
  );
  console.log(chalk.green("━".repeat(60)));
  console.log(chalk.yellow("  WhatsApp MD Bot | Powered by USMAN TECH"));
  console.log(chalk.green("━".repeat(60)));
  console.log("");

  const { state, saveCreds } = await useMultiFileAuthState("./auth_info_baileys");
  const { version } = await fetchLatestBaileysVersion();

  logger.info(`Using WA v${version.join(".")}`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  store?.bind(sock.ev);

  // ── Pairing Code Logic ─────────────────────────────────
  if (!sock.authState.creds.registered) {
    let phoneNumber = config.ownerNumber.replace(/[^0-9]/g, "");
    if (!phoneNumber) {
      phoneNumber = await question(chalk.yellow("📱 Enter your WhatsApp number (with country code, e.g. 923001234567): "));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, "");
    }
    console.log(chalk.cyan("\n⏳ Generating pairing code...\n"));
    await new Promise((r) => setTimeout(r, 3000));
    const code = await sock.requestPairingCode(phoneNumber);
    const formatted = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.green("━".repeat(60)));
    console.log(chalk.yellow(`\n  🔑 PAIRING CODE:  `) + chalk.bgGreen.black.bold(`  ${formatted}  `));
    console.log(chalk.green("\n━".repeat(60)));
    console.log(chalk.cyan("\n📱 How to use:"));
    console.log(chalk.white("  1. WhatsApp kholo"));
    console.log(chalk.white("  2. Menu (⋮) > Linked Devices"));
    console.log(chalk.white("  3. 'Link a Device' pe tap karo"));
    console.log(chalk.white("  4. 'Link with Phone Number' select karo"));
    console.log(chalk.white(`  5. Yeh code enter karo: ${chalk.bold(formatted)}`));
    console.log(chalk.green("\n━".repeat(60) + "\n"));
  }

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !==
        DisconnectReason.loggedOut;

      logger.warn("Connection closed. Reconnecting:", shouldReconnect);

      if (shouldReconnect) {
        setTimeout(() => startBot(), 3000);
      } else {
        logger.error("Logged out. Delete auth_info_baileys folder and restart.");
        process.exit(1);
      }
    } else if (connection === "open") {
      console.log(chalk.green("\n✅ Bot Connected Successfully!\n"));
      console.log(chalk.cyan(`🤖 Bot Name: ${config.botName}`));
      console.log(chalk.cyan(`👤 Owner: ${config.ownerName}`));
      console.log(chalk.cyan(`📦 Prefix: ${config.prefix}`));
      console.log(chalk.cyan(`⚙️  Mode: ${config.mode}`));
      console.log(chalk.green("━".repeat(60)));

      if (config.startupMessage) {
        try {
          await sock.sendMessage(config.ownerNumber + "@s.whatsapp.net", {
            text: `╭┈───〔 *${config.botName}* 〕┈───⊷\n├▢ ✅ *Bot Started Successfully!*\n├▢ 📦 Prefix: ${config.prefix}\n├▢ ⚙️ Mode: ${config.mode}\n╰───────────────────⊷`,
          });
        } catch (e) {}
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const msg of messages) {
      if (!msg.message) continue;
      try {
        await handleMessage(sock, msg);
      } catch (e) {
        logger.error("Message handler error:", e);
      }
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    try {
      await handleGroupUpdate(sock, update);
    } catch (e) {
      logger.error("Group handler error:", e);
    }
  });

  global.sock = sock;
  return sock;
}

startBot().catch((err) => {
  logger.error("Fatal error:", err);
  process.exit(1);
});
