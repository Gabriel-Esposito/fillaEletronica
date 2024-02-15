const mysql = require('./config');

const BancoDeDados = mysql.sequelize.define('pacientes',{
    nome: {
        type: mysql.Sequelize.STRING
    },
    cpf: {
        type: mysql.Sequelize.STRING
    },
    consulta: {
        type: mysql.Sequelize.STRING
    },
    prioridade: {
        type: mysql.Sequelize.STRING
    },
    atendido: {
        type: mysql.Sequelize.STRING
    },
    senha: {
        type: mysql.Sequelize.STRING
    },
    codigo: {
        type: mysql.Sequelize.STRING
    }
})

//BancoDeDados.sync({force: false}) // código para criar tabela de teste

module.exports = BancoDeDados