const Sequelize = require('sequelize');
const sequelize = new Sequelize('filaeletronica','root','',{
    host: "localhost",
    dialect: 'mysql'
})
sequelize.authenticate().then(function(){
    console.log('Conectado ao banco de dados!')
}).catch(function(erro){
    console.log('Falha ao se conectar'+ erro)
})

// Presione F5 para execultar o teste de conexão com o banco de dados
// Verifique se o XAMPP está ligado corretamente 