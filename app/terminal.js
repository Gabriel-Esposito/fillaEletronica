const express = require('express');
const app = express();
const BancoDedados = require('./mysql/config');
const handlebars = require('express-handlebars');
const WebSocket = require('ws');
require('dotenv').config()
const ws = new WebSocket.Server({port: 8081})

//config handlebars
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true }}));
app.set('view engine', 'handlebars');

//config express
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const PORT = process.env.PORT_EXPRESS
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
        res.render('home')
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
    atualizaTabela()
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

    ws.on("close", () => {
        pcs = pcs.filter((pc) => pc !== ws)
    })
})

app.get('/t',function(req,res){
    res.render('tv')
})

app.post('/proximo',function(req,res){
    let next = proximoPaciente(req.body.setor)
    atualizaTV(next)
    setTimeout(()=>{
        atualizaTabela()
    },1000)
    res.redirect('/home')
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
        if(conferir != ''){
            res.render('dadosPac',conferir)
        }else{
            res.render('notDadosPac')
        }
    }else{
        res.redirect('/')
    }
})

app.listen(PORT,function(){
    console.log('servidor ligado em '+ PORT)
})

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

function proximoPaciente(setor){
    let loop = 0
    while(loop < 4){
       if(prioridade == 0){
        for(let i = 0; i < filaPacientes.length; i++){
            if(filaPacientes[i].prioridade == 'Não' && filaPacientes[i].consulta == setor){
                atendido(filaPacientes[i].id)
                prioridade = 1
                return [filaPacientes[i].senha,filaPacientes[i].consulta,senhaFormat(filaPacientes[i],0)]
            }
        }
        prioridade = 1
        }else if(prioridade == 1){
            for(let i = 0; i < filaPacientes.length; i++){
                if(filaPacientes[i].prioridade != 'Não' && filaPacientes[i].consulta == setor){
                    atendido(filaPacientes[i].id)
                    prioridade = 0
                    return [filaPacientes[i].senha,filaPacientes[i].consulta,senhaFormat(filaPacientes[i],1)]
                }
            }
            prioridade = 0
        }
        loop++
    }
}

function senhaFormat(paciente,pri){
    if(pri == 0){
        senhaFormatada = `${paciente.consulta[0]}${paciente.senha}`
    }else if(pri == 1){
        senhaFormatada = `P${paciente.consulta[0]}${paciente.senha}`
    }
    return senhaFormatada
}

function atendido(id){
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString();
    BancoDedados.query(`UPDATE pacientes SET atendido = 'Sim', dataatendido = '${dataFormatada} ${dataAtual.getHours()}:${dataAtual.getMinutes()}' WHERE id = '${id}'`)
}

function imprimirNovamente(cpf){
    pdfNovo = ''
    BancoDedados.query(`SELECT * FROM pacientes WHERE cpf = '${cpf}'`,function(err,results){
        if(err){
            console.log(err)
            return;
        }
        if(results.length > 0){
            if(results.length > 1){
                pdfNovo = results[results.length - 1]
                return;
            }
            pdfNovo = results[0]
        }
    })
}
function buscaPaciente(cod){
    BancoDedados.query(`SELECT * FROM pacientes WHERE codigo = '${cod}'`,function(err,results){
        if(err){
            console.log(err)
            return;
        }
        if(results.length > 0){
            let temp = results[0]
            if(temp.prioridade != 'Não'){
                conferir = {
                    nome : temp.nome,
                    cpf : `${temp.cpf[0]}${temp.cpf[1]}${temp.cpf[2]}.###.###-${temp.cpf[9]}${temp.cpf[10]}`,
                    senha : `P${temp.consulta[0]}${temp.senha}`,
                    consulta : temp.consulta,
                    prioridade : temp.prioridade,
                    atendido : temp.atendido,
                    codigo : temp.codigo,
                    data : temp.datacad,
                    dataAtendido : temp.dataatendido
                }
            }
            conferir = {
                nome : temp.nome,
                cpf : `${temp.cpf[0]}${temp.cpf[1]}${temp.cpf[2]}.###.###-${temp.cpf[9]}${temp.cpf[10]}`,
                senha : `${temp.consulta[0]}${temp.senha}`,
                consulta : temp.consulta,
                prioridade : temp.prioridade,
                atendido : temp.atendido,
                codigo : temp.codigo,
                data : temp.datacad
            }
        }else if(results.length == 0){
            conferir = []
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

    BancoDedados.query(`INSERT INTO pacientes (nome,cpf,consulta,prioridade,atendido,senha,codigo,datacad) VALUES ('${dadosDeCad[0]}','${dadosDeCad[1]}','${dadosDeCad[2]}','${dadosDeCad[3]}','Não','${s}','${c}','${dataFormatada} ${dataAtual.getHours()}:${dataAtual.getMinutes()}')`)
    pdf = {
        prioridade : dadosDeCad[3],
        nome : dadosDeCad[0],
        senha : s ,
        consulta : dadosDeCad[2],
        codigo: c,
        data : `${dataFormatada} ${dataAtual.getHours()}:${dataAtual.getMinutes()}`
    }
}

function atualizaTV(senhas){
    pcs.forEach(ws => {
        if(ws.isTv){
            let dadosJSONTv = JSON.stringify(senhas)
            setTimeout(() =>{
                console.log(senhas)
                ws.send(dadosJSONTv)
            },3000)
        }
    })
}

function atualizaTabela(){
    pcs.forEach(ws =>{
        if(!ws.isTv){
            let dadosJSON = JSON.stringify(filaPacientes)
            ws.send(dadosJSON)
        }
    })
}