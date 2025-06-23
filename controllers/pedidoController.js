const db = require('../database');
const { enviarMensagemCancelamentoWpp } = require('./whatsappController');

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

exports.getPedidosPendentes = (req, res) => {
  const id_usuario = req.params.id_usuario;

  // Busca os pedidos pendentes do usuário
  const sqlPedidos = `
    SELECT * FROM pedido
    WHERE id_usuario = ? AND status = 'Pendente'
    ORDER BY data_retirada DESC, horario_retirada DESC
  `;

  db.query(sqlPedidos, [id_usuario], (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos:', err);
      return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }

    if (!pedidos.length) return res.json([]);

    // Para cada pedido, busca os produtos relacionados
    const pedidosComProdutos = [];
    let pedidosProcessados = 0;

    pedidos.forEach((pedido) => {
      const sqlProdutos = `
        SELECT 
          pp.quantidade,
          pp.preco_unitario,
          p.nome_produto AS nome,
          p.imagem,
          pp.estado
        FROM pedido_produto pp
        JOIN produto p ON pp.id_produto = p.id_produto
        WHERE pp.id_pedido = ?
      `;
      db.query(sqlProdutos, [pedido.id_pedido], (err2, produtos) => {
        pedidosComProdutos.push({
          ...pedido,
          produtos: produtos.map(prod => ({
            nome: prod.nome,
            imagem: prod.imagem,
            quantidade: prod.quantidade,
            preco_unitario: prod.preco_unitario,
            estado: prod.estado || '', // pode ser null para bebidas
          })),
        });
        pedidosProcessados++;
        if (pedidosProcessados === pedidos.length) {
          // Retorna todos os pedidos com seus produtos
          res.json(pedidosComProdutos);
        }
      });
    });
  });
};

exports.cancelarPedido = async (req, res) => {
  const { id_pedido } = req.body;
  if (!id_pedido) {
    return res.status(400).json({ error: 'ID do pedido não informado.' });
  }

  // 1. Atualiza o status do pedido para "Cancelado"
  db.query(
    'UPDATE pedido SET status = ? WHERE id_pedido = ?',
    ['Cancelado', id_pedido],
    async (err, result) => {
      if (err) {
        console.error('Erro ao cancelar pedido:', err);
        return res.status(500).json({ error: 'Erro ao cancelar pedido.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      // 2. Busca dados do usuário e do pedido para enviar WhatsApp
      db.query(
        `SELECT u.telefone, u.nome_usuario, p.id_usuario, p.id_pedido, p.data_retirada, p.horario_retirada
         FROM pedido p
         JOIN usuario u ON p.id_usuario = u.id_usuario
         WHERE p.id_pedido = ? LIMIT 1`,
        [id_pedido],
        async (err2, rows) => {
          if (!err2 && rows.length) {
            const pedido = rows[0];
            // Envia mensagem de cancelamento no WhatsApp
            await enviarMensagemCancelamentoWpp({
              numero: pedido.telefone,
              nome: pedido.nome_usuario,
              id_pedido: pedido.id_pedido,
              data_retirada: pedido.data_retirada,
              horario_retirada: pedido.horario_retirada,
            });
          }
          // Não bloqueia o retorno mesmo se der erro no WhatsApp
          return res.json({ success: true });
        }
      );
    }
  );
};

exports.getPedidosCancelados = (req, res) => {
  const id_usuario = req.params.id_usuario;

  // Busca os pedidos cancelados do usuário
  const sqlPedidos = `
    SELECT * FROM pedido
    WHERE id_usuario = ? AND status = 'Cancelado'
    ORDER BY data_retirada DESC, horario_retirada DESC
  `;

  db.query(sqlPedidos, [id_usuario], (err, pedidos) => {
    if (err) {
      console.error('Erro ao buscar pedidos cancelados:', err);
      return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
    }

    if (!pedidos.length) return res.json([]);

    // Para cada pedido, busca os produtos relacionados
    const pedidosComProdutos = [];
    let pedidosProcessados = 0;

    pedidos.forEach((pedido) => {
      const sqlProdutos = `
        SELECT 
          pp.quantidade,
          pp.preco_unitario,
          p.nome_produto AS nome,
          p.imagem,
          pp.estado
        FROM pedido_produto pp
        JOIN produto p ON pp.id_produto = p.id_produto
        WHERE pp.id_pedido = ?
      `;
      db.query(sqlProdutos, [pedido.id_pedido], (err2, produtos) => {
        pedidosComProdutos.push({
          ...pedido,
          produtos: produtos.map(prod => ({
            nome: prod.nome,
            imagem: prod.imagem,
            quantidade: prod.quantidade,
            preco_unitario: prod.preco_unitario,
            estado: prod.estado || '', // pode ser null para bebidas
          })),
        });
        pedidosProcessados++;
        if (pedidosProcessados === pedidos.length) {
          // Retorna todos os pedidos com seus produtos
          res.json(pedidosComProdutos);
        }
      });
    });
  });
};