const { gerarCodigo, codigosVerificacao } = require('../utils/gerarCodigo');
const { formatarNumero } = require('../utils/formatarNumero');
const { getSock } = require('../whatsappClient');
const db = require('../database'); // Adicione esta linha para acessar o banco

const numerosVerificados = new Set();
exports.numerosVerificados = numerosVerificados;

// Função para gerar e registrar um novo código de verificação para um número
exports.verificarNumero = async (req, res) => {
  const { numero } = req.body;
  console.log('Entrou na função verificarNumero');
  try {
    const numeroFormatado = formatarNumero(numero);
    const codigo = gerarCodigo(numeroFormatado).toString(); // Garante que é string

    // Armazena com a estrutura COMPLETA (incluindo numeroEsperado)
    codigosVerificacao[numeroFormatado] = {
      codigo: codigo, // Já é string
      numeroEsperado: numeroFormatado, // Adicionado!
      criadoEm: Date.now()
    };

    const sock = getSock();
    if (sock) {
      await sock.sendMessage(
        `${numeroFormatado}@s.whatsapp.net`,
        { text: `Seu código de verificação é: ${codigo}` }
      );
      console.log(`✅ Código ${codigo} enviado para ${numeroFormatado}`);
    } else {
      console.error('❌ WhatsApp não está conectado!');
    }
    
    console.log('📌 Código armazenado:', codigosVerificacao[numeroFormatado]);
    return res.status(200).json({
      message: 'Código gerado e enviado pelo WhatsApp!', 
      codigo: codigo,
      numero: numero
    });
    // Resto do código (envio WhatsApp)...
  } catch (error) {
    console.error('❌ Erro ao gerar código:', error);
    return res.status(500).json({ error: 'Erro ao gerar código.' });
  }
};

// Função para confirmar o código de verificação enviado pelo usuário

exports.confirmarCodigo = (req, res) => {
  const { numero, codigo } = req.body;
  const numeroFormatado = formatarNumero(numero);
  const registro = codigosVerificacao[numeroFormatado];

  console.log('🔍 Tentando validar:', { numeroFormatado, codigo });
  console.log('📦 Códigos disponíveis:', codigosVerificacao);

  if (!registro) {
    return res.status(404).json({ error: "Código não encontrado para este número." });
  }

  // Garante que ambos são strings na comparação
  if (
    registro.codigo.toString() !== codigo.toString() ||
    registro.numeroEsperado !== numeroFormatado
  ) {
    return res.status(401).json({ error: "Código ou número incorreto!" });
  }

  numerosVerificados.add(numeroFormatado);
  delete codigosVerificacao[numeroFormatado];

  return res.status(200).json({ message: "Número verificado com sucesso!" });
};

// Função para enviar código de alteração de senha via WhatsApp
exports.alterarSenhaWpp = async (req, res) => {
  const { numero } = req.body;
  if (!numero) {
    return res.status(400).json({ error: "Número é obrigatório!" });
  }

  const numeroFormatado = formatarNumero(numero);

  // Verifica se o número existe no banco de dados
  db.query(
    'SELECT * FROM usuario WHERE telefone = ? LIMIT 1',
    [numeroFormatado],
    async (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro ao buscar usuário.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Número não cadastrado.' });
      }

      // Gera o código de 6 dígitos e armazena em memória
      const codigo = gerarCodigo(numeroFormatado).toString();
      codigosVerificacao[numeroFormatado] = {
        codigo: codigo,
        numeroEsperado: numeroFormatado,
        criadoEm: Date.now()
      };

      // Envia o código via WhatsApp
      const sock = getSock();
      if (sock) {
        await sock.sendMessage(
          `${numeroFormatado}@s.whatsapp.net`,
          { text: `Seu código para alterar a senha é: ${codigo}` }
        );
        console.log(`✅ Código de alteração de senha ${codigo} enviado para ${numeroFormatado}`);
        return res.status(200).json({ message: 'Código enviado pelo WhatsApp!' });
      } else {
        console.error('❌ WhatsApp não está conectado!');
        return res.status(500).json({ error: 'WhatsApp não está conectado.' });
      }
    }
  );
};

exports.enviarResumoPedidoWpp = async (req, res) => {
  const {
    id_usuario,
    nome_usuario,
    email,
    pedidoId,
    dataRetirada,
    horarioRetirada,
    formaPagamento,
    statusPagamento,
    itens,
    subtotal,
    descontos,
    total
  } = req.body;

  const db = require('../database');
  const { getSock } = require('../whatsappClient');
  const { formatarNumero } = require('../utils/formatarNumero');
  const sock = getSock();
  if (!sock) {
    console.error('❌ WhatsApp não está conectado!');
    return res.status(500).json({ error: 'WhatsApp não está conectado.' });
  }
  console.log('Enviando resumo para id_usuario:', id_usuario);

  // Busca o telefone do usuário no banco de dados
  let numero;
  try {
    const [rows] = await db.promise().query(
      'SELECT telefone FROM usuario WHERE id_usuario = ? LIMIT 1',
      [id_usuario]
    );
    if (!rows.length) {
      console.error('Usuário não encontrado para envio do WhatsApp.');
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    numero = rows[0].telefone;
  } catch (err) {
    console.error('Erro ao buscar telefone do usuário:', err);
    return res.status(500).json({ error: 'Erro ao buscar telefone do usuário.' });
  }

  const numeroFormatado = formatarNumero(numero);

  // Monta a lista de itens
  const itensTexto = itens.map(item =>
    `● ${item.quantidade}unid. | ${item.nome} | ${item.estado} | ${item.unidade} - R$ ${item.preco_unitario.toFixed(2)} | Total - R$ ${item.total.toFixed(2)}`
  ).join('\n');

  // Monta a mensagem
  const mensagem = 
`📦 Novo Pedido Recebido! 📦
Cliente: ${nome_usuario}
Telefone: ${numero}
E-mail: ${email}
Pedido: #${pedidoId}
Data de retirada: ${dataRetirada} às ${horarioRetirada}
Forma de pagamento: ${formaPagamento}
Status do pagamento: ${statusPagamento}
Itens do pedido:
${itensTexto}
Valores:
● Subtotal: R$ ${subtotal.toFixed(2)}
● Descontos: R$ ${descontos.toFixed(2)}
● Total: R$ ${total.toFixed(2)}`;

  try {
    await sock.sendMessage(
      `${numero}@s.whatsapp.net`,
      { text: mensagem }
    );
    console.log(`✅ Resumo do pedido enviado para ${numero}`);
    return res.status(200).json({ success: true, message: 'Resumo do pedido enviado pelo WhatsApp!' });
  } catch (err) {
    console.error('Erro ao enviar mensagem pelo WhatsApp:', err);
    return res.status(500).json({ error: 'Erro ao enviar mensagem pelo WhatsApp.' });
  }
};

exports.enviarMensagemCancelamentoWpp = async ({
  numero,
  nome,
  id_pedido,
  data_retirada,
  horario_retirada
}) => {
  const sock = getSock();
  if (!sock) {
    console.error('❌ WhatsApp não está conectado!');
    return;
  }
 
  const mensagem = 
`❌ Pedido Cancelado ❌
Olá, ${nome}!
Seu pedido #${id_pedido} para retirada em ${data_retirada} às ${horario_retirada} foi cancelado conforme solicitado.
Se precisar de algo, estamos à disposição!`;

  await sock.sendMessage(
    `${numero}@s.whatsapp.net`,
    { text: mensagem }
  );
  console.log(`✅ Mensagem de cancelamento enviada para ${numero}`);
};