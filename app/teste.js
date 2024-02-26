const express = require('express');
const app = express();
const BancoDedados = require('./mysql/tabela');
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }))
app.set('view engine', 'handlebars')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

let pacientes_cad = []
let pacientes_num = 0
let dadosDecad = []

app.get('/',function(req,res){
    res.render('tv')
})

app.get('/pdf',function(req,res){
    let d = {
        senha: '182',
        consulta: 'Exames',
        codigo: 'haK67s',
        data: '24/02/2024'
    }
    res.render('pdf',d)
})

app.get('/c',function(req,res){
    //dados() //pag inicial
    res.render('dadosPac')
})
app.get('/cad',function(req,res){
    //cad() //cad user
    res.send('<h1>Tudo certo!</h1>')
})
app.get('/dados',function(req,res){
    res.render('teste')
})

app.post('/cad',function(req,res){
    dadosDecad = req.body.dados
    cad()
    res.send(req.body.dados)
})

function dados(){
    BancoDedados.findAll({order:[['id','DESC']]}).then(function(posts){
       // pacientes_cad = posts.dataValues
        pacientes_num = posts.length
        for(let i = 0; i < posts.length; i++){
            if(posts[i].atendido == 'false'){
                pacientes_cad.push(posts[i].dataValues)
            }
        }
        //console.log(pacientes_num)
        //console.log(pacientes_cad)

    })
}
function senha(){
    while(true){
        if(pacientes_num < 10){
            return `00${pacientes_num + 1}`
        }else if(pacientes_num > 9 && pacientes_num < 100){
            return `0${pacientes_num + 1}`
        }else if(pacientes_num > 99 && pacientes_num <= 999){
            return pacientes_num + 1
        }else if(pacientes_num > 1000){
            pacientes_num - 999
        }
    }
}

function codigo(){
    let valores = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','12345678901234567890123456']
    let codigoPaciente = ''
    for(let i = 0; i < 6; i++){
        let op = Math.floor(Math.random() * 3)
        let val = Math.floor(Math.random() * 26)
        codigoPaciente += valores[op][val]
    }
    return codigoPaciente
}

function cad(){
    BancoDedados.create({
        nome: `${dadosDecad[0]}`,
        cpf: `${dadosDecad[1]}`,
        consulta: `${dadosDecad[2]}`,
        prioridade: `${dadosDecad[3]}`,
        atendido: 'false',
        senha: senha(),
        codigo: codigo()
    })
}

app.listen(8082,function(){
    console.log('Servidor ligado!')
})