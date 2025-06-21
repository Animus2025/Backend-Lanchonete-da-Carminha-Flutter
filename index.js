// Importa os módulos principais do projeto
const express = require('express'); // Framework para criar o servidor HTTP e rotas
const cors = require('cors');       // Middleware para liberar requisições de outros domínios (CORS)
require('./whatsappClient')         // Inicializa o cliente do WhatsApp (escuta e responde mensagens)

// Importa os arquivos de rotas da aplicação
const usuarioRoutes = require('./routes/usuario');    // Rotas relacionadas a usuários (cadastro, login, etc)
const produtoRoutes = require('./routes/produto');    // Rotas relacionadas a produtos
const whatsappRoutes = require('./routes/whatsapp');  // Rotas para integração com WhatsApp (enviar código, etc)

const app = express(); // Cria a aplicação Express

// Middlewares globais
app.use(cors());           // Permite que a API seja acessada de qualquer origem (frontend, mobile, etc)
app.use(express.json());   // Faz o Express entender requisições com corpo em JSON

// Define as rotas principais da API
app.use('/usuario', usuarioRoutes);    // Tudo que começar com /usuario vai para usuarioRoutes
app.use('/produto', produtoRoutes);   // Tudo que começar com /produtos vai para produtoRoutes
app.use('/whatsapp', whatsappRoutes);  // Tudo que começar com /whatsapp vai para whatsappRoutes

// Rota simples para testar se a API está online
app.get('/', (req, res) => {
  res.send('🔥 API da Carminha tá ON!');
});

// Inicia o servidor na porta 3000, aceitando conexões de qualquer IP (0.0.0.0)
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});


