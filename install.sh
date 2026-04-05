#!/bin/bash
# ╔══════════════════════════════════════╗
# ║    USMAN-MD Bot - Termux Installer   ║
# ║         Powered by Usman Tech        ║
# ╚══════════════════════════════════════╝

echo ""
echo "╭┈───〔 USMAN-MD INSTALLER 〕───⊷"
echo "├▢ 🤖 WhatsApp MD Bot"
echo "├▢ 👤 Powered by Usman Tech"
echo "╰─────────────────────────────⊷"
echo ""

# Update packages
echo "📦 Updating packages..."
pkg update -y && pkg upgrade -y

# Install required packages
echo "📦 Installing dependencies..."
pkg install -y nodejs git ffmpeg python wget curl

# Check Node version
NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌ Node.js 18+ required! Installing..."
  pkg install nodejs-lts -y
fi

echo "✅ Node version: $(node -v)"

# Clone or use existing bot
if [ ! -d "USMAN-MD" ]; then
  echo "📥 Setting up USMAN-MD..."
  mkdir USMAN-MD
fi

cd USMAN-MD

# Install npm packages
echo "📦 Installing npm packages..."
npm install

echo ""
echo "╭┈───〔 SETUP COMPLETE 〕───⊷"
echo "├▢ ✅ All packages installed!"
echo "├▢ 📝 Edit config.js with your info"
echo "├▢ 🚀 Run: node index.js"
echo "╰──────────────────────────⊷"
echo ""
