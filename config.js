// ==========================================
// ⚙️ WHATSAPP CRM BOT - CONFIGURATION FILE
// ==========================================
//
// این فایل شامل تمام تنظیمات ربات است
// هر تنظیم را بر اساس نیاز خود تغییر دهید
//
// ==========================================

const CONFIG = {
  // ==========================================
  // 📁 فایل خروجی
  // ==========================================
  EXPORT_FILE_NAME: 'WhatsApp_CRM_Export.csv',

  // ==========================================
  // 🔍 تنظیمات جستجوی کلمات کلیدی
  // ==========================================

  // کلمات کلیدی که می‌خواهید جستجو کنید
  // هر کلمه کلیدی را در یک خط جداگانه قرار دهید
  KEYWORDS: [
    'example',  // نمونه - این را با کلمات کلیدی خود جایگزین کنید
    // 'فروش',
    // 'قیمت',
    // 'مشاوره',
    // هر تعداد کلمه کلیدی که می‌خواهید اضافه کنید
  ],

  // حداکثر تعداد نتایج برای هر کلمه کلیدی
  // عدد بالاتر = نتایج بیشتر اما زمان طولانی‌تر
  MAX_RESULTS_PER_KEYWORD: 1000,

  // ==========================================
  // 📨 تنظیمات پیام‌های اخیر (غیر جستجو)
  // ==========================================

  // حداکثر تعداد پیام‌های اخیر از همه چت‌ها
  // این پیام‌ها علاوه بر نتایج جستجو ذخیره می‌شوند
  MAX_RECENT_MESSAGES_TOTAL: 3,

  // حداکثر پیام‌های اخیر از هر چت (برای انتخاب بهتر)
  // عدد بالاتر = انتخاب بهتر پیام‌های اخیر، اما کندتر
  MAX_RECENT_MESSAGES_PER_CHAT: 2,

  // حداکثر تعداد چت‌ها برای پردازش (برای تست سریع‌تر)
  // 0 = همه چت‌ها، عدد مثبت = محدود به این تعداد چت
  MAX_CHATS_TO_PROCESS: 50,

  // حداکثر پیام‌های کل (شامل جستجو + اخیر)
  // اگر به این تعداد رسید، ذخیره متوقف می‌شود
  MAX_TOTAL_MESSAGES: 10,

  // محدودیت پیام‌های قدیمی (بر اساس روز)
  // فقط پیام‌های حداکثر این تعداد روز اخیر ذخیره می‌شوند
  MAX_DAYS_OLD: 7,

  // ==========================================
  // ⏱️ تنظیمات زمان و عملکرد
  // ==========================================

  // زمان انتظار برای هر جستجو (میلی‌ثانیه)
  // اگر اینترنت کند دارید، این عدد را افزایش دهید
  TIMEOUT_MS: 30000,

  // تاخیر بین جستجوهای مختلف (میلی‌ثانیه)
  // برای جلوگیری از بلاک شدن توسط WhatsApp
  DELAY_BETWEEN_SEARCHES: 2000,

  // ==========================================
  // 🔧 تنظیمات پیشرفته (معمولاً تغییر ندهید)
  // ==========================================

  // تنظیمات Puppeteer برای اجرای پایدار
  PUPPETEER_ARGS: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
  ]
};

// ==========================================
// ⚠️  هشدار: این فایل را تغییر ندهید!
// ==========================================
// این بخش برای بررسی تنظیمات است و نباید تغییر کند

// بررسی تنظیمات ضروری
if (!CONFIG.EXPORT_FILE_NAME) {
  throw new Error('EXPORT_FILE_NAME is required');
}

if (!Array.isArray(CONFIG.KEYWORDS)) {
  throw new Error('KEYWORDS must be an array');
}

if (CONFIG.MAX_RECENT_MESSAGES_TOTAL < 0) {
  throw new Error('MAX_RECENT_MESSAGES_TOTAL cannot be negative');
}

if (CONFIG.MAX_RECENT_MESSAGES_PER_CHAT < 1) {
  throw new Error('MAX_RECENT_MESSAGES_PER_CHAT must be at least 1');
}

if (CONFIG.MAX_TOTAL_MESSAGES < 1) {
  throw new Error('MAX_TOTAL_MESSAGES must be at least 1');
}

if (CONFIG.MAX_DAYS_OLD < 1) {
  throw new Error('MAX_DAYS_OLD must be at least 1');
}

if (CONFIG.MAX_CHATS_TO_PROCESS < 0) {
  throw new Error('MAX_CHATS_TO_PROCESS cannot be negative');
}

console.log('✅ Configuration loaded successfully!');
console.log(`📝 Keywords to search: ${CONFIG.KEYWORDS.length}`);
console.log(`📨 Recent messages to fetch: ${CONFIG.MAX_RECENT_MESSAGES_TOTAL}`);
console.log(`📊 Max messages per chat: ${CONFIG.MAX_RECENT_MESSAGES_PER_CHAT}`);
console.log(`💬 Max chats to process: ${CONFIG.MAX_CHATS_TO_PROCESS === 0 ? 'All' : CONFIG.MAX_CHATS_TO_PROCESS}`);
console.log(`🎯 Total message limit: ${CONFIG.MAX_TOTAL_MESSAGES}`);
console.log(`📅 Max message age: ${CONFIG.MAX_DAYS_OLD} days`);

// ==========================================
// خروجی تنظیمات
// ==========================================
module.exports = CONFIG;
