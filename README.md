# WhatsApp Chat Exporter

![Banner](assets/banner.svg)

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WhatsApp Web.js](https://img.shields.io/badge/whatsapp--web.js-v1.23.0-green)
![Build Status](https://img.shields.io/github/actions/workflow/status/RezaMahdaviiDev/whatsapp-chat-exporter/nodejs.yml)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Extract and export WhatsApp chat messages with phone numbers and keyword search to CSV - Perfect for data analysis and conversation backup.

## 📸 Screenshots

<div align="center">
  <!-- Add your screenshots here later -->
  <img src="https://via.placeholder.com/800x400?text=Terminal+Output+Example" alt="Terminal Output" width="800"/>
  <p><em>Real-time extraction process</em></p>
</div>

## ✨ Features

## ✨ Features

- 🔍 **Keyword Search** - Search for specific keywords across all your WhatsApp chats
- 📱 **Phone Number Extraction** - Automatically extract and save phone numbers from conversations
- 📊 **Recent Messages** - Fetch recent messages from all chats with configurable limits
- 📅 **Date Filtering** - Filter messages by age (days old)
- 📈 **Activity Status** - Automatically categorize contacts as Active, Semi-active, or Inactive
- 💾 **CSV Export** - Export all data to structured CSV files for easy analysis
- ⚙️ **Highly Configurable** - Easy-to-use configuration file for all settings
- 🚀 **Fast & Efficient** - Optimized for handling large numbers of chats
- 📝 **Detailed Logging** - Real-time progress tracking and statistics

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v14.0.0 or higher
- A WhatsApp account
- Active internet connection

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-chat-exporter.git
cd whatsapp-chat-exporter
```

2. Install dependencies:
```bash
npm install
```

3. Configure the bot by editing `config.js`:
```javascript
const CONFIG = {
  KEYWORDS: ['example', 'keyword1', 'keyword2'],  // Add your keywords
  MAX_RECENT_MESSAGES_TOTAL: 10,                  // Number of recent messages
  MAX_CHATS_TO_PROCESS: 50,                       // Limit chats for faster testing
  MAX_DAYS_OLD: 7,                                // Messages from last N days
  // ... more settings
};
```

## 🎯 Usage

1. Start the bot:
```bash
npm start
```

2. Scan the QR code with your WhatsApp mobile app:
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Tap "Link a Device"
   - Scan the QR code displayed in the terminal

3. Wait for the bot to complete:
   - The bot will search for your keywords
   - Extract recent messages from chats
   - Save everything to a CSV file

4. Find your exported data:
   - Default file: `WhatsApp_CRM_Export.csv`
   - Location: Project root directory

## ⚙️ Configuration

Edit `config.js` to customize the bot behavior:

### Basic Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `KEYWORDS` | Array of keywords to search | `['example']` |
| `EXPORT_FILE_NAME` | Output CSV filename | `'WhatsApp_CRM_Export.csv'` |

### Search Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `MAX_RESULTS_PER_KEYWORD` | Max results per keyword | `1000` |
| `TIMEOUT_MS` | Search timeout (ms) | `30000` |
| `DELAY_BETWEEN_SEARCHES` | Delay between searches (ms) | `2000` |

### Message Control

| Setting | Description | Default |
|---------|-------------|---------|
| `MAX_RECENT_MESSAGES_TOTAL` | Total recent messages to fetch | `3` |
| `MAX_RECENT_MESSAGES_PER_CHAT` | Messages per chat for selection | `2` |
| `MAX_CHATS_TO_PROCESS` | Limit chats (0 = all) | `50` |
| `MAX_TOTAL_MESSAGES` | Total message limit | `10` |
| `MAX_DAYS_OLD` | Message age limit (days) | `7` |

## 📊 Output Format

The CSV file includes the following columns:

- **Search Keyword** - The keyword that matched (or `[Recent Messages]`)
- **Contact Name** - Name of the contact or chat
- **Phone Number** - Extracted phone number
- **Chat Type** - Group or Personal
- **Message Date** - When the message was sent
- **Sender** - Who sent the message
- **Message Content** - The message text (truncated to 500 chars)
- **Message Type** - Type of message (chat, image, video, etc.)
- **Activity Status** - 🟢 Active / 🟡 Semi-active / 🔴 Inactive
- **Chat Name** - Full name of the chat

## 🔧 Troubleshooting

### QR Code doesn't appear
- Check your internet connection
- Make sure port is not blocked by firewall
- Try restarting the application

### Bot stops responding
- Increase `TIMEOUT_MS` in config
- Reduce `MAX_CHATS_TO_PROCESS` for testing
- Check your internet connection

### Too slow / Too many messages
- Reduce `MAX_CHATS_TO_PROCESS` (e.g., 20-50)
- Reduce `MAX_RECENT_MESSAGES_PER_CHAT` (e.g., 2-5)
- Reduce `MAX_DAYS_OLD` (e.g., 1-3 days)
- Set `MAX_TOTAL_MESSAGES` to limit overall messages

### No messages found
- Increase `MAX_DAYS_OLD` to include older messages
- Check if your keywords are correct
- Verify WhatsApp connection is active

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect WhatsApp's Terms of Service and privacy laws. The authors are not responsible for any misuse of this tool.

## 🙏 Acknowledgments

- Built with [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Uses [csv-writer](https://github.com/ryu1kn/csv-writer) for CSV export
- QR code display with [qrcode-terminal](https://github.com/gtanner/qrcode-terminal)

## 📧 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/whatsapp-chat-exporter/issues/new) on GitHub.

---

Made with ❤️ by Reza Mahdavi
