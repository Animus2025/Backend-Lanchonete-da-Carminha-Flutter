const db = require('../database');

// Função para listar salgados do banco de dados
exports.listarProdutos = (req, res) => {
  const sql = `
    SELECT 
      nome_produto,
      categoria,
      estado,
      tipo_produto,
      preco_pronto,
      preco_congelado,
      imagem
    FROM produto
    WHERE tipo_produto = 'salgado'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar salgados:', err);
      return res.status(500).json({ error: 'Erro ao buscar salgados.' });
    }
    res.json(results);
  });
};

// Função para listar bebidas do banco de dados
exports.listarBebidas = (req, res) => {
  const sql = `
    SELECT 
      nome_produto,
      preco_pronto AS preco_pronto,
      imagem
    FROM produto
    WHERE tipo_produto = 'bebida'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao buscar bebidas:', err);
      return res.status(500).json({ error: 'Erro ao buscar bebidas.' });
    }
    res.json(results);
  });
};
