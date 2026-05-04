const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// ==========================================
// 📋 Carregando configurações
// ==========================================
const CONFIG = require('./config');

console.clear();
console.log('═══════════════════════════════════════════════');
console.log('🔍 WhatsApp Bot - Busca Avançada por Palavras-chave');
console.log('═══════════════════════════════════════════════\n');
console.log('📝 Palavras-chave para buscar:');
CONFIG.KEYWORDS.forEach((kw, i) => console.log(`   ${i+1}. ${kw}`));
console.log('\n⏱️  Este processo pode levar algum tempo...\n');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: CONFIG.PUPPETEER_ARGS
  }
});

// Variáveis globais
let allRecords = [];
let totalMessagesFound = 0;
let searchStats = {};

// Função para buscar por uma palavra-chave
async function searchKeyword(keyword) {
  try {
    console.log(`\n🔎 Buscando pela palavra-chave: "${keyword}"...`);
    
    const searchPromise = client.searchMessages(keyword, {
      limit: CONFIG.MAX_RESULTS_PER_KEYWORD
    });
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), CONFIG.TIMEOUT_MS)
    );
    
    const messages = await Promise.race([searchPromise, timeoutPromise]);
    
    if (!messages || messages.length === 0) {
      console.log(`   ℹ️  Nenhum resultado encontrado`);
      searchStats[keyword] = 0;
      return 0;
    }
    
    console.log(`   ✅ ${messages.length} mensagens encontradas`);
    searchStats[keyword] = messages.length;
    
    // Processar e salvar mensagens
    for (const msg of messages) {
      try {
        const chat = await msg.getChat();
        const contact = await msg.getContact();
        
        const name = contact.name || contact.pushname || chat.name || 'Desconhecido';
        const phone = msg.from.replace('@c.us', '').replace('@g.us', '');
        const chatType = chat.isGroup ? 'Grupo' : 'Pessoal';
        const messageDate = new Date(msg.timestamp * 1000).toLocaleString('pt-BR');
        const sender = msg.fromMe ? 'Eu' : name;
        
        // Calcular status
        const daysDiff = (Date.now() / 1000 - msg.timestamp) / 86400;
        let status = '🔴 Inativo';
        if (daysDiff <= 7) status = '🟢 Ativo';
        else if (daysDiff <= 30) status = '🟡 Semi-ativo';
        
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

        // Verificar limite total de mensagens
        if (totalMessagesFound >= CONFIG.MAX_TOTAL_MESSAGES) {
          console.log(`\n⚠️ Limite total de mensagens atingido: ${CONFIG.MAX_TOTAL_MESSAGES}`);
          break;
        }
      } catch (err) {
        // Continuar se houver erro ao processar uma mensagem
      }
    }

    return messages.length;
    
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`);
    searchStats[keyword] = 0;
    return 0;
  }
}

// Função para buscar mensagens recentes de todas as conversas
async function fetchRecentMessages() {
  try {
    console.log(`\n📥 Buscando mensagens recentes das conversas (máx ${CONFIG.MAX_RECENT_MESSAGES_TOTAL} mensagens no total)...`);

    const allChats = await client.getChats();
    console.log(`   📊 Total de conversas encontradas: ${allChats.length}`);
    
    // Limitar o número de conversas a processar, se configurado
    const chats = CONFIG.MAX_CHATS_TO_PROCESS > 0 
      ? allChats.slice(0, CONFIG.MAX_CHATS_TO_PROCESS)
      : allChats;
    
    if (CONFIG.MAX_CHATS_TO_PROCESS > 0 && allChats.length > CONFIG.MAX_CHATS_TO_PROCESS) {
      console.log(`   ⚡ Processando apenas as primeiras ${CONFIG.MAX_CHATS_TO_PROCESS} conversas para execução mais rápida`);
    }
    
    let allRecentMessages = [];

    // Primeiro, coletar mensagens de todas as conversas
    let chatIndex = 0;
    for (const chat of chats) {
      try {
        chatIndex++;
        const chatName = chat.name || 'Desconhecido';
        console.log(`   🔄 Processando conversa ${chatIndex}/${chats.length}: ${chatName.substring(0, 30)}...`);
        
        const messages = await chat.fetchMessages({ limit: CONFIG.MAX_RECENT_MESSAGES_PER_CHAT }); // Fetch messages per chat for recent selection

        if (!messages || messages.length === 0) {
          console.log(`      ⚠️  Nenhuma mensagem encontrada nesta conversa`);
          continue;
        }
        
        console.log(`      ✅ Encontradas ${messages.length} mensagens nesta conversa`);

        for (const msg of messages) {
          try {
            // Obter informações do contato sem usar getContact(), que tem problemas no novo WhatsApp Web
            const name = chat.name || msg._data.notifyName || 'Desconhecido';
            const phone = msg.from.replace('@c.us', '').replace('@g.us', '');
            const chatType = chat.isGroup ? 'Grupo' : 'Pessoal';
            const messageDate = new Date(msg.timestamp * 1000).toLocaleString('pt-BR');
            const sender = msg.fromMe ? 'Eu' : name;

            // Calcular status
            const daysDiff = (Date.now() / 1000 - msg.timestamp) / 86400;
            let status = '🔴 Inativo';
            if (daysDiff <= 7) status = '🟢 Ativo';
            else if (daysDiff <= 30) status = '🟡 Semi-ativo';

            allRecentMessages.push({
              keyword: '[Mensagens Recentes]',
              name: name.replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-\.]/g, ''),
              phone: phone,
              type: chatType,
              date: messageDate,
              sender: sender,
              message: (msg.body || `[${msg.type}]`).replace(/[\r\n]+/g, ' ').substring(0, 500),
              messageType: msg.type,
              status: status,
              chatName: chat.name || '',
              timestamp: msg.timestamp // Manter timestamp para ordenação
            });
          } catch (err) {
            console.log(`      ❌ Erro ao processar mensagem: ${err.message}`);
          }
        }
      } catch (err) {
        console.log(`      ❌ Erro ao buscar conversa: ${err.message}`);
      }
    }

    console.log(`   📦 Coletadas ${allRecentMessages.length} mensagens de todas as conversas`);
    
    // Filtrar mensagens por idade e ordenar por timestamp (mais recentes primeiro)
    const now = Date.now() / 1000;
    const maxAgeSeconds = CONFIG.MAX_DAYS_OLD * 24 * 60 * 60;

    allRecentMessages = allRecentMessages.filter(msg => {
      return (now - msg.timestamp) <= maxAgeSeconds;
    });
    
    console.log(`   🗓️  Após filtrar por idade (${CONFIG.MAX_DAYS_OLD} dias): ${allRecentMessages.length} mensagens`);

    // Ordenar por timestamp (mais recentes primeiro) e pegar apenas o número configurado
    allRecentMessages.sort((a, b) => b.timestamp - a.timestamp);
    const selectedMessages = allRecentMessages.slice(0, CONFIG.MAX_RECENT_MESSAGES_TOTAL);
    
    console.log(`   ✂️  Selecionadas as ${selectedMessages.length} mensagens mais recentes`);

    // Remover campo timestamp e adicionar aos registros
    selectedMessages.forEach(msg => {
      delete msg.timestamp;
      allRecords.push(msg);
      totalMessagesFound++;
    });

    console.log(`   ✅ ${selectedMessages.length} mensagens recentes obtidas de todas as conversas`);
    return selectedMessages.length;

  } catch (error) {
    console.log(`   ❌ Erro ao buscar mensagens recentes: ${error.message}`);
    return 0;
  }
}

// Função para salvar em arquivo
async function saveToFile() {
  if (allRecords.length === 0) {
    console.log('\n⚠️ Nenhum dado para salvar');
    return;
  }

  try {
    const csvWriter = createCsvWriter({
      path: CONFIG.EXPORT_FILE_NAME,
      header: [
        {id: 'keyword', title: 'Palavra-chave de Busca'},
        {id: 'name', title: 'Nome do Contato'},
        {id: 'phone', title: 'Número de Telefone'},
        {id: 'type', title: 'Tipo de Conversa'},
        {id: 'date', title: 'Data da Mensagem'},
        {id: 'sender', title: 'Remetente'},
        {id: 'message', title: 'Conteúdo da Mensagem'},
        {id: 'messageType', title: 'Tipo de Mensagem'},
        {id: 'status', title: 'Status de Atividade'},
        {id: 'chatName', title: 'Nome da Conversa'}
      ]
    });

    await csvWriter.writeRecords(allRecords);
    console.log(`\n💾 Arquivo salvo com sucesso: ${CONFIG.EXPORT_FILE_NAME}`);
    console.log(`📊 Total de registros salvos: ${allRecords.length}`);

    // Verificar se o arquivo foi realmente criado
    if (fs.existsSync(CONFIG.EXPORT_FILE_NAME)) {
      const stats = fs.statSync(CONFIG.EXPORT_FILE_NAME);
      console.log(`📁 Tamanho do arquivo: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      throw new Error('O arquivo não foi criado');
    }

  } catch (error) {
    console.error(`\n❌ Erro ao salvar arquivo: ${error.message}`);
    console.log('💡 Verifique as permissões do arquivo ou o espaço em disco');
    throw error; // Relançar para o chamador tratar
  }
}

client.on('qr', (qr) => {
  console.log('⚡ Por favor, escaneie o QR code abaixo:\n');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('\n✅ Conexão bem-sucedida! Iniciando busca...\n');
  
  const startTime = Date.now();
  
  try {
    // Buscar por cada palavra-chave
    for (let i = 0; i < CONFIG.KEYWORDS.length; i++) {
      const keyword = CONFIG.KEYWORDS[i];
      const progress = ((i + 1) / CONFIG.KEYWORDS.length * 100).toFixed(1);
      
      console.log(`\n📊 Progresso: ${progress}% (${i + 1}/${CONFIG.KEYWORDS.length})`);
      
      await searchKeyword(keyword);

      // Verificar limite total de mensagens
      if (totalMessagesFound >= CONFIG.MAX_TOTAL_MESSAGES) {
        console.log(`\n⚠️ Limite total de mensagens atingido: ${CONFIG.MAX_TOTAL_MESSAGES}`);
        break;
      }

      // Atraso entre buscas para evitar bloqueio
      if (i < CONFIG.KEYWORDS.length - 1) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_SEARCHES));
      }
    }
    
    // Buscar mensagens recentes de todas as conversas
    await fetchRecentMessages();
    
    // Salvar final
    await saveToFile();
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);
    
    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ Busca concluída com sucesso!\n');
    console.log('📊 Estatísticas finais:');
    console.log(`   ├─ Palavras-chave buscadas: ${CONFIG.KEYWORDS.length}`);
    console.log(`   ├─ Total de mensagens encontradas: ${totalMessagesFound}`);
    console.log(`   ├─ Registros CSV: ${allRecords.length}`);
    console.log(`   ├─ Tempo de execução: ${duration} minutos`);
    console.log(`   └─ Arquivo de saída: ${CONFIG.EXPORT_FILE_NAME}`);
    
    console.log('\n📈 Estatísticas por palavra-chave:');
    Object.entries(searchStats).forEach(([kw, count]) => {
      console.log(`   - "${kw}": ${count} mensagens`);
    });
    
    console.log('\n👋 Fim do programa. (Ctrl+C para sair)');
    process.exit(0);
    
  } catch (err) {
    console.error('\n❌ Erro fatal:', err);
    if (allRecords.length > 0) {
      await saveToFile();
      console.log('💾 Dados existentes salvos antes do erro');
    }
    process.exit(1);
  }
});

// Tratador de saída de emergência
process.on('SIGINT', async () => {
  console.log('\n\n⚠️ Sinal de saída recebido...');
  if (allRecords.length > 0) {
    console.log('💾 Salvando dados coletados...');
    await saveToFile();
    console.log('✅ Dados salvos');
  }
  process.exit(0);
});

client.initialize();