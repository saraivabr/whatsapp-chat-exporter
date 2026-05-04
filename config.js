// ==========================================
// ⚙️ WHATSAPP CRM BOT - ARQUIVO DE CONFIGURAÇÃO
// ==========================================
//
// Este arquivo contém todas as configurações do robô
// Altere cada configuração conforme necessário
//
// ==========================================

const CONFIG = {
  // ==========================================
  // 📁 Arquivo de saída
  // ==========================================
  EXPORT_FILE_NAME: 'WhatsApp_CRM_Export.csv',

  // ==========================================
  // 🔍 Configurações de busca por palavras-chave
  // ==========================================

  // Palavras-chave que você deseja buscar
  // Coloque cada palavra-chave em uma linha separada
  KEYWORDS: [
    'exemplo',  // Exemplo - substitua pelas suas próprias palavras-chave
    // 'venda',
    // 'preço',
    // 'consultoria',
    // Adicione quantas palavras-chave quiser
  ],

  // Número máximo de resultados por palavra-chave
  // Número maior = mais resultados, mas mais tempo
  MAX_RESULTS_PER_KEYWORD: 1000,

  // ==========================================
  // 📨 Configurações de mensagens recentes (sem busca)
  // ==========================================

  // Número máximo de mensagens recentes de todas as conversas
  // Estas mensagens são salvas além dos resultados de busca
  MAX_RECENT_MESSAGES_TOTAL: 3,

  // Máximo de mensagens recentes por conversa (para melhor seleção)
  // Número maior = melhor seleção de mensagens recentes, mas mais lento
  MAX_RECENT_MESSAGES_PER_CHAT: 2,

  // Número máximo de conversas a processar (para testes mais rápidos)
  // 0 = todas as conversas, número positivo = limitado a este número
  MAX_CHATS_TO_PROCESS: 50,

  // Máximo total de mensagens (incluindo busca + recentes)
  // Se atingir este número, o salvamento é interrompido
  MAX_TOTAL_MESSAGES: 10,

  // Limite de idade das mensagens (em dias)
  // Apenas mensagens dos últimos N dias são salvas
  MAX_DAYS_OLD: 7,

  // ==========================================
  // ⏱️ Configurações de tempo e desempenho
  // ==========================================

  // Tempo de espera para cada busca (milissegundos)
  // Se sua internet for lenta, aumente este número
  TIMEOUT_MS: 30000,

  // Atraso entre buscas diferentes (milissegundos)
  // Para evitar bloqueio pelo WhatsApp
  DELAY_BETWEEN_SEARCHES: 2000,

  // ==========================================
  // 🔧 Configurações avançadas (normalmente não altere)
  // ==========================================

  // Configurações do Puppeteer para execução estável
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
// ⚠️  Atenção: Não altere esta parte do arquivo!
// ==========================================
// Esta seção verifica as configurações e não deve ser alterada

// Verificação das configurações obrigatórias
if (!CONFIG.EXPORT_FILE_NAME) {
  throw new Error('EXPORT_FILE_NAME é obrigatório');
}

if (!Array.isArray(CONFIG.KEYWORDS)) {
  throw new Error('KEYWORDS deve ser um array');
}

if (CONFIG.MAX_RECENT_MESSAGES_TOTAL < 0) {
  throw new Error('MAX_RECENT_MESSAGES_TOTAL não pode ser negativo');
}

if (CONFIG.MAX_RECENT_MESSAGES_PER_CHAT < 1) {
  throw new Error('MAX_RECENT_MESSAGES_PER_CHAT deve ser pelo menos 1');
}

if (CONFIG.MAX_TOTAL_MESSAGES < 1) {
  throw new Error('MAX_TOTAL_MESSAGES deve ser pelo menos 1');
}

if (CONFIG.MAX_DAYS_OLD < 1) {
  throw new Error('MAX_DAYS_OLD deve ser pelo menos 1');
}

if (CONFIG.MAX_CHATS_TO_PROCESS < 0) {
  throw new Error('MAX_CHATS_TO_PROCESS não pode ser negativo');
}

console.log('✅ Configuração carregada com sucesso!');
console.log(`📝 Palavras-chave para buscar: ${CONFIG.KEYWORDS.length}`);
console.log(`📨 Mensagens recentes para buscar: ${CONFIG.MAX_RECENT_MESSAGES_TOTAL}`);
console.log(`📊 Máximo de mensagens por conversa: ${CONFIG.MAX_RECENT_MESSAGES_PER_CHAT}`);
console.log(`💬 Máximo de conversas a processar: ${CONFIG.MAX_CHATS_TO_PROCESS === 0 ? 'Todas' : CONFIG.MAX_CHATS_TO_PROCESS}`);
console.log(`🎯 Limite total de mensagens: ${CONFIG.MAX_TOTAL_MESSAGES}`);
console.log(`📅 Idade máxima das mensagens: ${CONFIG.MAX_DAYS_OLD} dias`);

// ==========================================
// Exportação das configurações
// ==========================================
module.exports = CONFIG;
