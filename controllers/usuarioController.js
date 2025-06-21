const bcrypt = require('bcrypt');
const db = require('../database');
const { numerosVerificados, codigosVerificacao } = require('./whatsappController');
const { formatarNumero } = require('../utils/formatarNumero');

const cadastrosPendentes = {};

// Pré-cadastro: salva temporariamente os dados do usuário
exports.preCadastro = async (req, res) => {
  const { nome_usuario, email, senha, numero, endereco, cpf } = req.body;
  if (!nome_usuario || !numero || !cpf || !endereco || !senha) {
    return res.status(400).json({ error: "Dados obrigatórios ausentes!" });
  }

  const numeroFormatado = formatarNumero(numero);
  cadastrosPendentes[numeroFormatado] = { nome_usuario, email, senha, numero: numeroFormatado, endereco, cpf };
  res.status(201).json({ message: "Pré-cadastro realizado. Verifique seu número via WhatsApp." });
};

// Finaliza cadastro: salva no banco de dados usando os dados do pré-cadastro
exports.finalizarCadastro = async (req, res) => {
  const { numero, codigo } = req.body;
  if (!numero || !codigo) {
    return res.status(400).json({ error: "Número e código são obrigatórios!" });
  }

  const numeroFormatado = formatarNumero(numero);
  const dados = cadastrosPendentes[numeroFormatado];

  if (!dados) {
    return res.status(400).json({ error: "Nenhum pré-cadastro encontrado para este número." });
  }

  // (Opcional) Se quiser validar o código, descomente as linhas abaixo:
  // const registro = codigosVerificados[numeroFormatado];
  // if (!registro || registro.codigo !== codigo) {
  //   return res.status(401).json({ error: "Código de verificação inválido!" });
  // }

  try {
    const hashedPassword = await bcrypt.hash(dados.senha, 10);
    const sql = `INSERT INTO usuario (nome_usuario, email, senha, telefone, endereco, cpf) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(
      sql,
      [
        dados.nome_usuario,
        dados.email || null,
        hashedPassword,
        dados.numero,
        dados.endereco,
        dados.cpf
      ],
      (err, result) => {
        if (err) {
          console.error("🔥 ERRO AO CADASTRAR USUÁRIO:", err);
          return res.status(500).json({ error: "Erro ao cadastrar usuário." });
        }

        // Limpa o pré-cadastro após inserir
        delete cadastrosPendentes[numeroFormatado];

        res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: result.insertId });
      }
    );
  } catch (err) {
    console.error("🔥 ERRO INTERNO:", err);
    res.status(500).json({ error: "Erro interno." });
  }
};

// Login do usuário
exports.loginUsuario = (req, res) => {
  const { email, numero, senha } = req.body;
  if ((!email && !numero) || !senha) return res.status(400).json({ error: "Informe email ou número e a senha!" });

  const numeroFormatado = numero ? formatarNumero(numero) : null;
  const sql = `SELECT * FROM usuario WHERE email = ? OR telefone = ? LIMIT 1`;

  db.query(sql, [email, numeroFormatado], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor!" });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado!" });

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ error: "Senha incorreta!" });

    res.json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        numero: usuario.telefone // Retorna como "numero" para manter padrão na resposta
      }
    });
  });
};

// Redefinição de senha do usuário
exports.redefinirSenhaWpp = async (req, res) => {
  const { numero, novaSenha } = req.body;
  if (!numero || !novaSenha) return res.status(400).json({ error: "Informe o número e a nova senha." });

  const numeroFormatado = formatarNumero(numero);
  try {
    const hashedSenha = await bcrypt.hash(novaSenha, 10);
    const sql = `UPDATE usuario SET senha = ? WHERE telefone = ?`;
    db.query(sql, [hashedSenha, numeroFormatado], (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao redefinir senha." });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário com esse número não encontrado." });

      res.json({ message: "Senha redefinida com sucesso!" });
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao redefinir senha." });
  }
};