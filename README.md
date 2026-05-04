# WhatsApp Chat Exporter

![Banner](assets/banner.svg)

![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![WhatsApp Web.js](https://img.shields.io/badge/whatsapp--web.js-v1.23.0-green)
![Build Status](https://img.shields.io/github/actions/workflow/status/RezaMahdaviiDev/whatsapp-chat-exporter/nodejs.yml)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Extraia e exporte mensagens do WhatsApp com números de telefone e busca por palavras-chave para CSV — ideal para análise de dados e backup de conversas.

## ✨ Funcionalidades

- 🔍 **Busca por Palavras-chave** — Pesquise palavras-chave específicas em todas as suas conversas do WhatsApp
- 📱 **Extração de Números de Telefone** — Extrai e salva automaticamente os números de telefone das conversas
- 📊 **Mensagens Recentes** — Busca mensagens recentes de todas as conversas com limites configuráveis
- 📅 **Filtro por Data** — Filtre mensagens por idade (em dias)
- 📈 **Status de Atividade** — Categorize automaticamente contatos como Ativo, Semi-ativo ou Inativo
- 💾 **Exportação CSV** — Exporte todos os dados para arquivos CSV estruturados para fácil análise
- ⚙️ **Altamente Configurável** — Arquivo de configuração fácil de usar para todas as opções
- 🚀 **Rápido e Eficiente** — Otimizado para lidar com grande número de conversas
- 📝 **Log Detalhado** — Acompanhamento de progresso em tempo real com estatísticas

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v14.0.0 ou superior
- Uma conta no WhatsApp
- Conexão ativa com a internet

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/whatsapp-chat-exporter.git
cd whatsapp-chat-exporter
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o bot editando o arquivo `config.js`:
```javascript
const CONFIG = {
  KEYWORDS: ['exemplo', 'palavra1', 'palavra2'],  // Adicione suas palavras-chave
  MAX_RECENT_MESSAGES_TOTAL: 10,                  // Número de mensagens recentes
  MAX_CHATS_TO_PROCESS: 50,                       // Limitar conversas para testes mais rápidos
  MAX_DAYS_OLD: 7,                                // Mensagens dos últimos N dias
  // ... mais configurações
};
```

## 🎯 Uso

1. Inicie o bot:
```bash
npm start
```

2. Escaneie o QR code com o aplicativo do WhatsApp no seu celular:
   - Abra o WhatsApp no seu celular
   - Vá em Configurações → Dispositivos conectados
   - Toque em "Conectar um dispositivo"
   - Escaneie o QR code exibido no terminal

3. Aguarde o bot concluir:
   - O bot irá buscar suas palavras-chave
   - Extrair mensagens recentes das conversas
   - Salvar tudo em um arquivo CSV

4. Encontre os dados exportados:
   - Arquivo padrão: `WhatsApp_CRM_Export.csv`
   - Local: diretório raiz do projeto

## ⚙️ Configuração

Edite o arquivo `config.js` para personalizar o comportamento do bot:

### Configurações Básicas

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| `KEYWORDS` | Array de palavras-chave para buscar | `['exemplo']` |
| `EXPORT_FILE_NAME` | Nome do arquivo CSV de saída | `'WhatsApp_CRM_Export.csv'` |

### Configurações de Busca

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| `MAX_RESULTS_PER_KEYWORD` | Máximo de resultados por palavra-chave | `1000` |
| `TIMEOUT_MS` | Tempo limite de busca (ms) | `30000` |
| `DELAY_BETWEEN_SEARCHES` | Atraso entre buscas (ms) | `2000` |

### Controle de Mensagens

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| `MAX_RECENT_MESSAGES_TOTAL` | Total de mensagens recentes a buscar | `3` |
| `MAX_RECENT_MESSAGES_PER_CHAT` | Mensagens por conversa para seleção | `2` |
| `MAX_CHATS_TO_PROCESS` | Limitar conversas (0 = todas) | `50` |
| `MAX_TOTAL_MESSAGES` | Limite total de mensagens | `10` |
| `MAX_DAYS_OLD` | Limite de idade das mensagens (dias) | `7` |

## 📊 Formato de Saída

O arquivo CSV inclui as seguintes colunas:

- **Palavra-chave de Busca** — A palavra-chave que correspondeu (ou `[Mensagens Recentes]`)
- **Nome do Contato** — Nome do contato ou da conversa
- **Número de Telefone** — Número de telefone extraído
- **Tipo de Conversa** — Grupo ou Pessoal
- **Data da Mensagem** — Quando a mensagem foi enviada
- **Remetente** — Quem enviou a mensagem
- **Conteúdo da Mensagem** — Texto da mensagem (limitado a 500 caracteres)
- **Tipo de Mensagem** — Tipo de mensagem (texto, imagem, vídeo, etc.)
- **Status de Atividade** — 🟢 Ativo / 🟡 Semi-ativo / 🔴 Inativo
- **Nome da Conversa** — Nome completo da conversa

## 🔧 Solução de Problemas

### O QR code não aparece
- Verifique sua conexão com a internet
- Certifique-se de que a porta não está bloqueada pelo firewall
- Tente reiniciar o aplicativo

### O bot para de responder
- Aumente o valor de `TIMEOUT_MS` no arquivo de configuração
- Reduza `MAX_CHATS_TO_PROCESS` para testes
- Verifique sua conexão com a internet

### Muito lento / Muitas mensagens
- Reduza `MAX_CHATS_TO_PROCESS` (ex.: 20–50)
- Reduza `MAX_RECENT_MESSAGES_PER_CHAT` (ex.: 2–5)
- Reduza `MAX_DAYS_OLD` (ex.: 1–3 dias)
- Defina `MAX_TOTAL_MESSAGES` para limitar o total de mensagens

### Nenhuma mensagem encontrada
- Aumente `MAX_DAYS_OLD` para incluir mensagens mais antigas
- Verifique se suas palavras-chave estão corretas
- Confirme que a conexão com o WhatsApp está ativa

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir um Pull Request. Para mudanças significativas, abra uma issue primeiro para discutir o que você deseja alterar.

## 📝 Licença

Este projeto está licenciado sob a Licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Aviso Legal

Esta ferramenta é apenas para uso educacional e pessoal. Por favor, respeite os Termos de Serviço do WhatsApp e as leis de privacidade. Os autores não se responsabilizam por qualquer uso indevido desta ferramenta.

## 🙏 Agradecimentos

- Desenvolvido com [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- Usa [csv-writer](https://github.com/ryu1kn/csv-writer) para exportação CSV
- Exibição do QR code com [qrcode-terminal](https://github.com/gtanner/qrcode-terminal)

## 📧 Suporte

Se você encontrar algum problema ou tiver dúvidas, [abra uma issue](https://github.com/yourusername/whatsapp-chat-exporter/issues/new) no GitHub.

---

Feito com ❤️ por Reza Mahdavi
