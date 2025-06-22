const bcrypt = require('bcrypt');
const db = require('../database');
const { codigosVerificacao } = require('./whatsappController');
const { formatarNumero } = require('../utils/formatarNumero');

const cadastrosPendentes = {};

// Pré-cadastro
exports.preCadastro = async (req, res) => {
  const { nome_usuario, email, senha, numero, endereco, cpf } = req.body;
  if (!nome_usuario || !numero || !cpf || !endereco || !senha) {
    return res.status(400).json({ error: "Dados obrigatórios ausentes!" });
  }

  const numeroFormatado = formatarNumero(numero);
  cadastrosPendentes[numeroFormatado] = {
    nome_usuario,
    email,
    senha,
    numero: numeroFormatado,
    endereco,
    cpf,
  };

  res.status(201).json({ message: "Pré-cadastro realizado. Verifique seu número via WhatsApp." });
};

// Finalizar cadastro
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

        delete cadastrosPendentes[numeroFormatado];

        res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: result.insertId });
      }
    );
  } catch (err) {
    console.error("🔥 ERRO INTERNO:", err);
    res.status(500).json({ error: "Erro interno." });
  }
};

// Login
exports.loginUsuario = (req, res) => {
  const { email, numero, senha } = req.body;
  if ((!email && !numero) || !senha) {
    return res.status(400).json({ error: "Informe email ou número e a senha!" });
  }

  const numeroFormatado = numero ? formatarNumero(numero) : null;
  const sql = `SELECT * FROM usuario WHERE email = ? OR telefone = ? LIMIT 1`;

  db.query(sql, [email, numeroFormatado], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor!" });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado!" });

    const usuario = results[0];
    console.log("🟢 Login retornando:", usuario); // Aqui está OK
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) return res.status(401).json({ error: "Senha incorreta!" });

    res.json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome_usuario: usuario.nome_usuario,
        email: usuario.email,
        numero: usuario.telefone,
        cpf: usuario.cpf,
        endereco: usuario.endereco
      }
    });
  });
};

// Redefinir senha
exports.redefinirSenhaWpp = async (req, res) => {
  const { numero, novaSenha } = req.body;
  if (!numero || !novaSenha) {
    return res.status(400).json({ error: "Informe o número e a nova senha." });
  }

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

// Atualizar dados do usuário
exports.atualizarUsuario = (req, res) => {
  console.log("🔧 Requisição PUT chegou!");
  console.log("ID:", req.params.id);
  console.log("Body:", req.body);

  const { id } = req.params;
  const { nome_usuario, email, telefone, cpf, endereco } = req.body;

  const sql = `UPDATE usuario SET nome_usuario = ?, email = ?, telefone = ?, cpf = ?, endereco = ? WHERE id = ?`;
  db.query(sql, [nome_usuario, email, telefone, cpf, endereco, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao atualizar usuário." });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({
      id,
      nome_usuario,
      email,
      numero: telefone,
      cpf,
      endereco
    });
  });
};

