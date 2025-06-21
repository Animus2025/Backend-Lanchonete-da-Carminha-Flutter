const bcrypt = require('bcrypt'); // Importa o bcrypt para criptografar senhas
const db = require('../database'); // Importa a conexão com o banco de dados MySQL
const { formatarNumero } = require('../utils/formatarNumero'); // Importa função para padronizar números de telefone

// Função para gerar o hash (criptografia) da senha do usuário
exports.hashSenha = (senha) => bcrypt.hash(senha, 10);

// Função para salvar um novo usuário no banco de dados
exports.salvarUsuario = (usuario, callback) => {
  const numeroFormatado = formatarNumero(usuario.numero); // Padroniza o número antes de salvar
  const sql = `INSERT INTO usuario (nome_usuario, email, senha, telefone, endereco, cpf) VALUES (?, ?, ?, ?, ?, ?)`;
  // Executa a query de inserção no banco, passando os dados do usuário
  db.query(sql, [
    usuario.nome_usuario,
    usuario.email || null, // Se não houver email, salva como null
    usuario.senha,
    numeroFormatado,
    usuario.endereco,
    usuario.cpf
  ], callback); // O callback será chamado após a query (para tratar sucesso ou erro)
};

// Função para buscar um usuário pelo email ou número
exports.buscarUsuarioPorEmailOuNumero = (email, numero, callback) => {
  const numeroFormatado = numero ? formatarNumero(numero) : null; // Padroniza o número se informado
  const sql = `SELECT * FROM usuario WHERE email = ? OR telefone = ? LIMIT 1`;
  // Executa a query de busca no banco
  db.query(sql, [email, numeroFormatado], callback);
};

// Função para atualizar a senha de um usuário pelo número
exports.atualizarSenha = (numero, novaSenha, callback) => {
  const numeroFormatado = formatarNumero(numero); // Padroniza o número antes de atualizar
  const sql = `UPDATE usuario SET senha = ? WHERE telefone = ?`;
  // Executa a query de atualização no banco
  db.query(sql, [novaSenha, numeroFormatado], callback);
};