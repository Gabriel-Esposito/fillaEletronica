const mysql = require('mysql2')

const BancoDeDados = mysql.createConnection({
  host: 'localhost', // Endereço do servidor MySQL
  user: 'root', // Nome de usuário do MySQL
  password: '', // Senha do MySQL
  database: 'filaeletronica' // Nome do banco de dados
});

module.exports = BancoDeDados