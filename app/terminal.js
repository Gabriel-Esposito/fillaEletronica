const express = require('express');
const app = express();
const BancoDedados = require('./mysql/tabela');
const handlebars = require('express-handlebars');
const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 8081})

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
let pcs = []
let numPaciente = 0
let filaPacientes = []
let dadosDeCad = []
let pdf = []
let conferir = []
let pdfNovo = ''
let prioridade = 0

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

app.get('/home',function(req,res){
    if(user == 'on'){
        dados()
        setTimeout(() =>{
            res.render('home')
        },1300)
    }else{
        res.redirect('/')
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

ws.on('connection', (ws) => {
    console.log('Servidor WS ligado')
    pcs.push(ws)

    ws.on('message', (mensagem) => {
        if(mensagem == 'isTV'){
            ws.isTv = true
        }else if(mensagem == 'entrou!'){
            atualizaTabela()
        }
    })
})

app.get('/t',function(req,res){
    res.render('tv')
})

app.post('/proximo',function(req,res){
    let proximoPaciente = priPaciente()

    if(prioridade == 0){
        atualizaTV([filaPacientes[0].senha,filaPacientes[0].consulta]) 
        prioridade = 1
    }else if(prioridade == 1 && proximoPaciente == undefined){
        atualizaTV([filaPacientes[0].senha,filaPacientes[0].consulta])
        filaPacientes[0].atendido = 'Sim'
    }else if(prioridade == 1 && proximoPaciente != undefined){
        atualizaTV(proximoPaciente)
        prioridade = 0
    }else {
        console.log('ERRO')
    }
    let t = BancoDedados.findOne()
    setTimeout(()=>{
        res.redirect('/home')
    },200)
})

app.post('/reImprimir',function(req,res){
    imprimirNovamente(req.body.cpf2)
})
app.get('/reImprimir',function(req,res){
    if(user == 'on'){
        if(pdfNovo != ''){
            res.render('pdf',pdfNovo)
        }else{
            console.log(` 3 pdfNovo : ${pdfNovo} | vazio? ${pdfNovo == ''}`)
            res.render('notPdf')
        }
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
    BancoDedados.findAll({order:[['id','ASC']]}).then(function(posts){
        numPaciente = posts.length
        for(let i = 0; i < posts.length; i++){
            if(posts[i].atendido == 'Não'){
                filaPacientes.push(posts[i].dataValues)
                numPacientes = filaPacientes.length
            }
        }
    })
}

function priPaciente(){
    for(let i = 0; i < filaPacientes.length; i++){
        if(filaPacientes[i].prioridade != 'Não'){
            filaPacientes[i].atendido = 'Sim'
            return [filaPacientes[i].senha,filaPacientes[i].consulta]
        }
    }
}

function imprimirNovamente(cpf){
    pdfNovo = ''
    console.log(` 1 pdfNovo : ${pdfNovo} | vazio? ${pdfNovo == ''}`)
    BancoDedados.findAll({order:[['id','ASC']]}).then(function(posts){
        for(let i = 0; i < posts.length; i++){
            console.log('entrou!')
            if(posts[i].cpf == cpf){
                console.log('cpf enconttrado')
                if(posts[i].atendido == 'Não'){
                    pdfNovo = posts[i].dataValues
                    console.log(` 2 pdfNovo : ${pdfNovo} | vazio? ${pdfNovo == ''}`)
                    break
                }else{
                    console.log('n')
                }
            }
        }
    })
    console.log(pdfNovo)
}

function buscaPaciente(cod){
    BancoDedados.findAll({order:[['id','ASC']]}).then(function(posts){
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

function atualizaTV(senhas){
    pcs.forEach(ws => {
        if(ws.isTv){
            let dadosJSONTv = JSON.stringify(senhas)
            ws.send(dadosJSONTv)
        }
    })
}
function atualizaTabela(){
    pcs.forEach(ws =>{
        if(ws != ws.isTv){
            let dadosJSON = JSON.stringify(filaPacientes)
            ws.send(dadosJSON)
        }
    })
}