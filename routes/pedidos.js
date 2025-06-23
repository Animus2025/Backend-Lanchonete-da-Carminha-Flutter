const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Importa o controller de pedidos
// que contém a lógica para criar pedidos
router.post('/pedidos', pedidoController.criarPedido);
module.exports = router;