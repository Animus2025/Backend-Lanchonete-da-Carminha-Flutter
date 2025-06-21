const express = require('express'); // Importa o framework Express para criar rotas HTTP
const router = express.Router();    // Cria um roteador do Express para organizar as rotas deste módulo
const usuarioController = require('../controllers/usuarioController'); // Importa as funções que controlam a lógica dos usuários

// 1. Pré-cadastro: salva temporariamente os dados do usuário
// Quando o frontend faz um POST para /usuario/pre-cadastro, executa usuarioController.preCadastro
router.post('/pre-cadastro', usuarioController.preCadastro);

// 2. Finaliza cadastro: salva no banco após verificação do telefone
// Quando o frontend faz um POST para /usuario/finalizar-cadastro, executa usuarioController.finalizarCadastro
router.post('/finalizar-cadastro', usuarioController.finalizarCadastro);

// Login e redefinição de senha (opcional)
// POST /usuario/login chama a função de login do controller
router.post('/login', usuarioController.loginUsuario);
// POST /usuario/redefinir-senha chama a função de redefinição de senha do controller
router.post('/redefinir-senha-wpp', usuarioController.redefinirSenhaWpp);

router.put('/usuario/:id', usuarioController.atualizarUsuario);

// Exporta o roteador para ser usado no arquivo principal da aplicação (index.js)
module.exports = router;