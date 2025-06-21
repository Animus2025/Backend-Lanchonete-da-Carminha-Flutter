const express = require('express'); // Importa o framework Express para criar rotas HTTP
const router = express.Router();    // Cria um roteador do Express para organizar as rotas deste módulo
const whatsappController = require('../controllers/whatsappController'); // Importa o controller do WhatsApp
const { getSock } = require('../whatsappClient'); // Função para obter o socket do WhatsApp já conectado
const { formatarNumero } = require('../utils/formatarNumero'); // Função utilitária para padronizar o número

// Rota para enviar o código de verificação via WhatsApp
router.post('/verificar-numero', whatsappController.verificarNumero);

// Rota para confirmar o código recebido pelo usuário
router.post('/confirmar-codigo', whatsappController.confirmarCodigo);

router.post('/alterar-senha', whatsappController.alterarSenhaWpp);

// Exporta o roteador para ser usado no arquivo principal da aplicação (index.js)
module.exports = router;
