const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// ==========================================
// 📋 بارگذاری تنظیمات
// ==========================================
const CONFIG = require('./config');

console.clear();
console.log('═══════════════════════════════════════════════');
console.log('🔍 WhatsApp Bot - Advanced Keyword Search');
console.log('═══════════════════════════════════════════════\n');
console.log('📝 Keywords to search:');
CONFIG.KEYWORDS.forEach((kw, i) => console.log(`   ${i+1}. ${kw}`));
console.log('\n⏱️  This process may take some time...\n');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: CONFIG.PUPPETEER_ARGS
  }
});

// Global variables
let allRecords = [];
let totalMessagesFound = 0;
let searchStats = {};

// Function to search for a keyword
async function searchKeyword(keyword) {
  try {
    console.log(`\n🔎 Searching for keyword: "${keyword}"...`);
    
    const searchPromise = client.searchMessages(keyword, {
      limit: CONFIG.MAX_RESULTS_PER_KEYWORD
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), CONFIG.TIMEOUT_MS)
    );
    
    const messages = await Promise.race([searchPromise, timeoutPromise]);
    
    if (!messages || messages.length === 0) {
      console.log(`   ℹ️  No results found`);
      searchStats[keyword] = 0;
      return 0;
    }
    
    console.log(`   ✅ ${messages.length} messages found`);
    searchStats[keyword] = messages.length;
    
    // Process and save messages
    for (const msg of messages) {
      try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        
        const name = contact.name || contact.pushname || chat.name || 'Unknown';
        const phone = msg.from.replace('@c.us', '').replace('@g.us', '');
        const chatType = chat.isGroup ? 'Group' : 'Personal';
        const messageDate = new Date(msg.timestamp * 1000).toLocaleString('en-US');
        const sender = msg.fromMe ? 'Me' : name;
        
        // Calculate status
        const daysDiff = (Date.now() / 1000 - msg.timestamp) / 86400;
        let status = '🔴 Inactive';
        if (daysDiff <= 7) status = '🟢 Active';
        else if (daysDiff <= 30) status = '🟡 Semi-active';
        
        allRecords.push({
          keyword: keyword,
          name: name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-\.]/g, ''),
          phone: phone,
          type: chatType,
          date: messageDate,
          sender: sender,
          message: (msg.body || `[${msg.type}]`).replace(/[\r\n]+/g, ' ').substring(0, 500),
          messageType: msg.type,
          status: status,
          chatName: chat.name || ''
        });
        
        totalMessagesFound++;

        // Check total message limit
        if (totalMessagesFound >= CONFIG.MAX_TOTAL_MESSAGES) {
          console.log(`\n⚠️ Reached total message limit: ${CONFIG.MAX_TOTAL_MESSAGES}`);
          break;
        }
      } catch (err) {
        // Continue if there's an error processing a message
      }
    }

    return messages.length;
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    searchStats[keyword] = 0;
    return 0;
  }
}

// Function to fetch recent messages from all chats
async function fetchRecentMessages() {
  try {
    console.log(`\n📥 Fetching recent messages from chats (max ${CONFIG.MAX_RECENT_MESSAGES_TOTAL} total messages)...`);

    const allChats = await client.getChats();
    console.log(`   📊 Total chats found: ${allChats.length}`);
    
    // Limit the number of chats to process if configured
    const chats = CONFIG.MAX_CHATS_TO_PROCESS > 0 
      ? allChats.slice(0, CONFIG.MAX_CHATS_TO_PROCESS)
      : allChats;
    
    if (CONFIG.MAX_CHATS_TO_PROCESS > 0 && allChats.length > CONFIG.MAX_CHATS_TO_PROCESS) {
      console.log(`   ⚡ Processing only first ${CONFIG.MAX_CHATS_TO_PROCESS} chats for faster execution`);
    }
    
    let allRecentMessages = [];

    // First, collect messages from all chats
    let chatIndex = 0;
    for (const chat of chats) {
      try {
        chatIndex++;
        const chatName = chat.name || 'Unknown';
        console.log(`   🔄 Processing chat ${chatIndex}/${chats.length}: ${chatName.substring(0, 30)}...`);
        
        const messages = await chat.fetchMessages({ limit: CONFIG.MAX_RECENT_MESSAGES_PER_CHAT }); // Fetch messages per chat for recent selection

        if (!messages || messages.length === 0) {
          console.log(`      ⚠️  No messages found in this chat`);
          continue;
        }
        
        console.log(`      ✅ Found ${messages.length} messages in this chat`);

        for (const msg of messages) {
          try {
            // Get contact info without using getContact() which has issues in new WhatsApp Web
            const name = chat.name || msg._data.notifyName || 'Unknown';
            const phone = msg.from.replace('@c.us', '').replace('@g.us', '');
            const chatType = chat.isGroup ? 'Group' : 'Personal';
            const messageDate = new Date(msg.timestamp * 1000).toLocaleString('en-US');
            const sender = msg.fromMe ? 'Me' : name;

            // Calculate status
            const daysDiff = (Date.now() / 1000 - msg.timestamp) / 86400;
            let status = '🔴 Inactive';
            if (daysDiff <= 7) status = '🟢 Active';
            else if (daysDiff <= 30) status = '🟡 Semi-active';

            allRecentMessages.push({
              keyword: '[Recent Messages]',
              name: name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-\.]/g, ''),
              phone: phone,
              type: chatType,
              date: messageDate,
              sender: sender,
              message: (msg.body || `[${msg.type}]`).replace(/[\r\n]+/g, ' ').substring(0, 500),
              messageType: msg.type,
              status: status,
              chatName: chat.name || '',
              timestamp: msg.timestamp // Keep timestamp for sorting
            });
          } catch (err) {
            console.log(`      ❌ Error processing message: ${err.message}`);
          }
        }
      } catch (err) {
        console.log(`      ❌ Error fetching from chat: ${err.message}`);
      }
    }

    console.log(`   📦 Collected ${allRecentMessages.length} messages from all chats`);
    
    // Filter messages by age and sort by timestamp (most recent first)
    const now = Date.now() / 1000;
    const maxAgeSeconds = CONFIG.MAX_DAYS_OLD * 24 * 60 * 60;

    allRecentMessages = allRecentMessages.filter(msg => {
      return (now - msg.timestamp) <= maxAgeSeconds;
    });
    
    console.log(`   🗓️  After filtering by age (${CONFIG.MAX_DAYS_OLD} days): ${allRecentMessages.length} messages`);

    // Sort by timestamp (most recent first) and take only the configured number
    allRecentMessages.sort((a, b) => b.timestamp - a.timestamp);
    const selectedMessages = allRecentMessages.slice(0, CONFIG.MAX_RECENT_MESSAGES_TOTAL);
    
    console.log(`   ✂️  Selected top ${selectedMessages.length} most recent messages`);

    // Remove timestamp field and add to records
    selectedMessages.forEach(msg => {
      delete msg.timestamp;
      allRecords.push(msg);
      totalMessagesFound++;
    });

    console.log(`   ✅ ${selectedMessages.length} recent messages fetched from all chats`);
    return selectedMessages.length;

  } catch (error) {
    console.log(`   ❌ Error fetching recent messages: ${error.message}`);
    return 0;
  }
}

// Function to save to file
async function saveToFile() {
  if (allRecords.length === 0) {
    console.log('\n⚠️ No data to save');
    return;
  }

  try {
    const csvWriter = createCsvWriter({
      path: CONFIG.EXPORT_FILE_NAME,
      header: [
        {id: 'keyword', title: 'Search Keyword'},
        {id: 'name', title: 'Contact Name'},
        {id: 'phone', title: 'Phone Number'},
        {id: 'type', title: 'Chat Type'},
        {id: 'date', title: 'Message Date'},
        {id: 'sender', title: 'Sender'},
        {id: 'message', title: 'Message Content'},
        {id: 'messageType', title: 'Message Type'},
        {id: 'status', title: 'Activity Status'},
        {id: 'chatName', title: 'Chat Name'}
      ]
    });

    await csvWriter.writeRecords(allRecords);
    console.log(`\n💾 File saved successfully: ${CONFIG.EXPORT_FILE_NAME}`);
    console.log(`📊 Total records saved: ${allRecords.length}`);

    // Verify file was actually created
    if (fs.existsSync(CONFIG.EXPORT_FILE_NAME)) {
      const stats = fs.statSync(CONFIG.EXPORT_FILE_NAME);
      console.log(`📁 File size: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      throw new Error('File was not created');
    }

  } catch (error) {
    console.error(`\n❌ Error saving file: ${error.message}`);
    console.log('💡 Try checking file permissions or disk space');
    throw error; // Re-throw to let caller handle it
  }
}

client.on('qr', (qr) => {
  console.log('⚡ Please scan the QR code below:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('\n✅ Connection successful! Starting search...\n');
  
  const startTime = Date.now();
  
  try {
    // Search for each keyword
    for (let i = 0; i < CONFIG.KEYWORDS.length; i++) {
      const keyword = CONFIG.KEYWORDS[i];
      const progress = ((i + 1) / CONFIG.KEYWORDS.length * 100).toFixed(1);
      
      console.log(`\n📊 Progress: ${progress}% (${i + 1}/${CONFIG.KEYWORDS.length})`);
      
      await searchKeyword(keyword);

      // Check total message limit
      if (totalMessagesFound >= CONFIG.MAX_TOTAL_MESSAGES) {
        console.log(`\n⚠️ Reached total message limit: ${CONFIG.MAX_TOTAL_MESSAGES}`);
        break;
      }

      // Delay between searches to prevent blocking
      if (i < CONFIG.KEYWORDS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_SEARCHES));
      }
    }
    
    // Fetch recent messages from all chats
    await fetchRecentMessages();
    
    // Final save
    await saveToFile();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Search completed successfully!\n');
    console.log('📊 Final statistics:');
    console.log(`   ├─ Keywords searched: ${CONFIG.KEYWORDS.length}`);
    console.log(`   ├─ Total messages found: ${totalMessagesFound}`);
    console.log(`   ├─ CSV records: ${allRecords.length}`);
    console.log(`   ├─ Execution time: ${duration} minutes`);
    console.log(`   └─ Output file: ${CONFIG.EXPORT_FILE_NAME}`);
    
    console.log('\n📈 Statistics per keyword:');
    Object.entries(searchStats).forEach(([kw, count]) => {
      console.log(`   - "${kw}": ${count} messages`);
    });
    
    console.log('\n👋 End of program. (Ctrl+C to exit)');
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Fatal error:', err);
    if (allRecords.length > 0) {
      await saveToFile();
      console.log('💾 Existing data saved before error');
    }
    process.exit(1);
  }
});

// Emergency exit handler
process.on('SIGINT', async () => {
  console.log('\n\n⚠️ Exit signal received...');
  if (allRecords.length > 0) {
    console.log('💾 Saving collected data...');
    await saveToFile();
    console.log('✅ Data saved');
  }
  process.exit(0);
});

client.initialize();