const db = require('../database');

exports.criarPedido = (req, res) => {
  console.log('Body recebido:', req.body);
  const {
    id_usuario,
    data_retirada,
    horario_retirada,
    tipo_pagamento,
    forma_pagamento,
    status,
    valor_total,
    produtos
  } = req.body;

  // 1. Insere na tabela pedido
  const sqlPedido = `
    INSERT INTO pedido (id_usuario, data_retirada, horario_retirada, status, valor_total, tipo_pagamento, forma_pagamento)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sqlPedido,
    [id_usuario, data_retirada, horario_retirada, status, valor_total, tipo_pagamento, forma_pagamento],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir pedido:', err);
        return res.status(500).json({ error: 'Erro ao inserir pedido.' });
      }
      const id_pedido = result.insertId;

      // 2. Insere os produtos do pedido na tabela pedido_produto
      const sqlProduto = `
        INSERT INTO pedido_produto (id_pedido, id_produto, quantidade, preco_unitario)
        VALUES ?
      `;
      const values = produtos.map(prod => [
        id_pedido,
        prod.id_produto,
        prod.quantidade,
        prod.preco_unitario
      ]);
      db.query(sqlProduto, [values], (err2) => {
        if (err2) {
          console.error('Erro ao inserir produtos do pedido:', err2);
          return res.status(500).json({ error: 'Erro ao inserir produtos do pedido.' });
        }

        // 3. Insere o pagamento na tabela pagamento
        const sqlPagamento = `
          INSERT INTO pagamento (id_pedido, status_pagamento)
          VALUES (?, ?)
        `;
        db.query(
          sqlPagamento,
          [id_pedido, 'Pendente'],
          (err3) => {
            if (err3) {
              console.error('Erro ao inserir pagamento:', err3);
              return res.status(500).json({ error: 'Erro ao inserir pagamento.' });
            }

            // Retorna o id do pedido criado para o frontend
            return res.status(201).json({ message: 'Pedido criado com sucesso!', id_pedido });

          }
        );
      });
    }
  );
};