const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/salgados', produtoController.listarProdutos);
router.get('/bebidas', produtoController.listarBebidas);

module.exports = router;