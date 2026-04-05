# 🤖 USMAN-MD WhatsApp Bot

```
╭┈───〔 USMAN-MD 〕┈───⊷
├▢ 🤖 ᴏᴡɴᴇʀ: Usman Tech
├▢ 📜 ᴄᴏᴍᴍᴀɴᴅs: 384+
├▢ 📦 ᴘʀᴇғɪx: .
├▢ ⚙️ ᴍᴏᴅᴇ: public
├▢ 🏷️ ᴠᴇʀsɪᴏɴ: 2.0.0 Beta
╰───────────────────⊷
```

---

## 📱 Termux Setup Guide (Step by Step)

### Step 1 - Termux Install karo
**F-Droid se download karo (Play Store wala outdated hai):**
- https://f-droid.org/packages/com.termux/

---

### Step 2 - Termux open karo aur yeh commands chalao:

```bash
# Storage permission do
termux-setup-storage

# Packages update karo
pkg update -y && pkg upgrade -y

# Required tools install karo
pkg install nodejs git ffmpeg python wget -y

# Node version check karo (18+ hona chahiye)
node -v
```

---

### Step 3 - Bot download karo:

**Option A - GitHub se clone karo:**
```bash
git clone https://github.com/UsmanTech/USMAN-MD
cd USMAN-MD
```

**Option B - Files manually copy karo:**
```bash
mkdir USMAN-MD
cd USMAN-MD
# Phir sari files yahan paste karo
```

---

### Step 4 - NPM packages install karo:

```bash
npm install
```

Agar error aaye:
```bash
npm install --legacy-peer-deps
```

---

### Step 5 - Config set karo:

```bash
nano config.js
```

Yahan apni info bharein:
```javascript
ownerNumber: "923XXXXXXXXX",  // Apna number (92 se shuru)
ownerName: "Usman Tech",       // Apna naam
botName: "USMAN-MD",           // Bot ka naam
prefix: ".",                   // Command prefix
mode: "public",                // public / private / groups / inbox
```

`Ctrl+X` phir `Y` phir `Enter` daba ke save karo.

---

### Step 6 - Bot start karo:

```bash
node index.js
```

---

### Step 7 - QR Code scan karo:

1. WhatsApp kholo
2. `Menu (⋮)` > `Linked Devices`
3. `Link a Device` pe click karo
4. Terminal mein dikhne wala QR scan karo
5. ✅ Bot connected!

---

## 🔧 Background mein chalane ke liye (PM2):

```bash
# PM2 install karo
npm install -g pm2

# Bot start karo
pm2 start index.js --name USMAN-MD

# Hamesha on rakhne ke liye
pm2 startup
pm2 save

# Logs dekhne ke liye
pm2 logs USMAN-MD

# Restart karne ke liye
pm2 restart USMAN-MD

# Stop karne ke liye
pm2 stop USMAN-MD
```

---

## ⚙️ Available Commands

| Category | Commands |
|----------|----------|
| 🤖 AI | .ai, .gpt, .gemini, .codeai, .studyai, .imagine |
| 👑 Owner | .block, .unblock, .mode, .prefix, .settings, .update |
| 👥 Group | .kick, .promote, .demote, .tagall, .mute, .unmute, .ginfo, .link |
| 🎮 Fun | .joke, .quote, .shayari, .roast, .8ball, .ship, .kiss, .hug |
| 🔧 Tools | .sticker, .fancy, .binary, .base64, .calculate, .timenow |
| 📥 Download | .tiktok, .ytv, .song, .fb, .igdl, .pinterest |
| 🔍 Search | .wikipedia, .npm, .id |
| ⚙️ Settings | .welcome, .goodbye, .antilink, .antidelete, .autoread |

---

## 🚨 Common Errors & Fixes

### Error: `Cannot find module`
```bash
npm install
```

### Error: Node version low
```bash
pkg install nodejs-lts -y
```

### Error: ffmpeg not found
```bash
pkg install ffmpeg -y
```

### QR Code scan nahi ho raha
```bash
# auth_info_baileys folder delete karo aur restart karo
rm -rf auth_info_baileys
node index.js
```

### Bot slow hai
```bash
# Termux ko background pe rehne do
# Settings > Apps > Termux > Battery > Unrestricted
```

---

## 📱 WhatsApp Commands Examples

```
.menu          - Full menu dekho
.ai Hello      - AI se baat karo
.sticker       - Image reply karke sticker banao
.kick @user    - Group se user hatao (admin only)
.tagall msg    - Sab ko tag karo
.joke          - Joke suno
.calculate 2+2 - Calculator
.timenow       - Time dekho
.settings      - Bot settings
.mode private  - Private mode
.prefix !      - Prefix badlo
```

---

## 💡 Tips

1. **Battery Saver OFF karo** - Settings > Battery > Usman-MD > Unrestricted
2. **Internet stable rakhein** - WiFi prefer karein
3. **PM2 use karein** - Bot automatically restart hoga
4. **API Keys set karein** - AI features ke liye config.js mein

---

## 📞 Support

- 👤 **Owner:** Usman Tech
- 🤖 **Bot:** USMAN-MD v2.0.0 Beta

> *© Powered by Usman TechX*
