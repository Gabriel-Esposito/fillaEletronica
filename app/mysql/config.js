const mysql = require('mysql2')

const BancoDeDados = mysql.createConnection({
  host: 'localhost', // Endereço do servidor MySQL
  user: 'root', // Nome de usuário do MySQL
  password: '', // Senha do MySQL
  database: 'filaeletronica' // Nome do banco de dados
});

module.exports = BancoDeDados

function dados(){
  filaPacientes = []
  BancoDedados.query('SELECT * FROM pacientes', function(err, results) {
      if (err) {
        console.error('Erro ao executar consulta:', err);
        return;
      }
      numPaciente = results.length
      for(let i = 0; i < results.length; i++){
          if(results[i].atendido == 'Não'){
              filaPacientes.push(results[i])
          }
      }
  });
}