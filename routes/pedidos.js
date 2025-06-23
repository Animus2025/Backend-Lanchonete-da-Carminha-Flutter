const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Importa o controller de pedidos
// que contém a lógica para criar pedidos
router.post('/pedido', pedidoController.criarPedido);

router.get('/pendentes/:id_usuario', pedidoController.getPedidosPendentes);
router.post('/cancelar', pedidoController.cancelarPedido);
router.get('/cancelados/:id_usuario', pedidoController.getPedidosCancelados);

module.exports = router;