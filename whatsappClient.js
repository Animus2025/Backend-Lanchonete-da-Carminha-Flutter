const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const { formatarNumero } = require('./utils/formatarNumero');

let sockGlobal = null;
let isReady = false;

// Objeto para armazenar os códigos de verificação
const codigosVerificacao = {};
module.exports.codigosVerificacao = codigosVerificacao;
const numerosVerificados = new Set();

// Função principal para conectar ao WhatsApp
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📲 Escaneie o QR abaixo com seu WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      isReady = false;
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Conexão encerrada. Reconectando?', shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp!');
      sockGlobal = sock;
      isReady = true;
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages && m.messages[0];
    if (!msg || !msg.message || msg.key.fromMe) return;

    const texto = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (/código/i.test(texto)) {
      const remetente = msg.key.remoteJid.replace('@s.whatsapp.net', '');
      const numeroFormatado = formatarNumero(remetente);

      const registro = Object.values(codigosVerificacao).find(r => r.numeroEsperado === numeroFormatado);

      if (registro && registro.codigo) {
        await sock.sendMessage(msg.key.remoteJid, { text: `Seu código de verificação é: ${registro.codigo}` });
        console.log(`✅ Código ${registro.codigo} enviado para ${numeroFormatado}`);
      }
      // else removido: agora apenas ignora se não encontrar código
    }
  });
}

// Função para obter o socket do WhatsApp se estiver pronto
function getSock() {
  if (!isReady) {
    console.error('❌ Socket ainda não está pronto!');
    return null;
  }
  return sockGlobal;
}

// Inicia a conexão ao carregar o módulo
connectToWhatsApp();

module.exports = {
  getSock,
};