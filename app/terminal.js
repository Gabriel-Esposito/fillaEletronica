const express = require('express');
const app = express();
const BancoDedados = require('./mysql/tabela');
const handlebars = require('express-handlebars');

//config handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true }}));
app.set('view engine', 'handlebars');

//config express
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const PORT = 8082
let senha = '@ADM'
let user = 'off'
let numPacientes = 0
let numPaciente = 0
let filaPacientes = []
let dadosDeCad = []
let pdf = []
let conferir = []

app.get('/',function(req,res){
    user = 'off'
    dados()
    res.render('login')
})
app.post('/login',function(req,res){
    if(req.body.senha == senha){
        user = 'on'
    }
})

app.get('/cad',function(req,res){
    if(user == 'on'){
        res.render('cad')
    }else{
        res.redirect('/')
    }
})
app.post('/cad',function(req,res){
    dadosDeCad = req.body.dados
    cadPaciente()
})
app.get('/pdf',function(req,res){
    if(user == 'on'){
        res.render('pdf', pdf)
    }else{
        res.redirect('/')
    }
})

app.get('/home',function(req,res){
    if(user == 'on'){
        dados()
        setTimeout(() =>{
            res.render('home',{pacientesLista: filaPacientes,numPacientes})
        },1300)
    }else{
        res.redirect('/')
    }
})

app.post('/conferir',function(req,res){
    buscaPaciente(req.body.codigo)
})
app.get('/conferir',function(req,res){
    if(user == 'on'){
        res.render('dadosPac',conferir)
    }else{
        res.redirect('/')
    }
})

app.listen(PORT,function(){
    console.log('servidor ligado em '+ PORT)
})

function dados(){
    filaPacientes = []
    BancoDedados.findAll({order:[['id','DESC']]}).then(function(posts){
        numPaciente = posts.length
        for(let i = 0; i < posts.length; i++){
            if(posts[i].atendido == 'Não'){
                filaPacientes.push(posts[i].dataValues)
                numPacientes = filaPacientes.length
            }
        }
    })
}
function buscaPaciente(cod){
    BancoDedados.findAll({order:[['id','DESC']]}).then(function(posts){
        for(let i = 0; i < posts.length; i++){
            if(posts[i].codigo == cod){
                let temp = posts[i].dataValues
                conferir = {
                    nome : temp.nome,
                    cpf : `${temp.cpf[0]}${temp.cpf[1]}${temp.cpf[2]}.###.###-${temp.cpf[9]}${temp.cpf[10]}`,
                    senha : `${temp.consulta[0]}${temp.senha}`,
                    consulta : temp.consulta,
                    prioridade : temp.prioridade,
                    atendido : temp.atendido,
                    codigo : temp.codigo,
                    data : temp.createdAt
                }
            }
        }
    })
}

function senhaPaciente(){
    while(true){
        if(numPaciente < 9){
            return `00${numPaciente + 1}`
        }else if(numPaciente > 8 && numPaciente < 99){
            return `0${numPaciente + 1}`
        }else if(numPaciente > 98 && numPaciente <= 998){
            return numPaciente + 1
        }else if(numPaciente >= 999){
            numPaciente - 999
        }
        console.log(numPaciente)
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

function cadPaciente(){
    let s = senhaPaciente()
    let c = codigo()
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString();
    BancoDedados.create({
        nome: `${dadosDeCad[0]}`,
        cpf: `${dadosDeCad[1]}`,
        consulta: `${dadosDeCad[2]}`,
        prioridade: `${dadosDeCad[3]}`,
        atendido: 'Não',
        senha: s,
        codigo: c
    })
    pdf = {
        senha : s ,
        consulta : dadosDeCad[2],
        codigo: c,
        data : dataFormatada
    }
}