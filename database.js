const mysql = require('mysql2'); // Importa o módulo mysql2, que permite conectar e interagir com bancos MySQL

// Cria uma conexão com o banco de dados MySQL usando as configurações abaixo
const db = mysql.createConnection({
  host: 'localhost',        // Endereço do servidor MySQL (localhost = máquina local)
  user: 'root',             // Usuário do banco de dados (padrão do MySQL é 'root')
  password: '2104',       // Senha do usuário do banco de dados
  database: 'lanchonete' // Nome do banco de dados que será utilizado
});

// Tenta estabelecer a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    // Se ocorrer um erro na conexão, exibe mensagem de erro no console
    console.error('❌ Erro ao conectar no banco de dados:', err);
  } else {
    // Se conectar com sucesso, exibe mensagem de sucesso no console
    console.log('✅ Conectado ao banco de dados!');
  }
});

// Exporta o objeto de conexão para ser usado em outros arquivos do projeto
module.exports = db;


