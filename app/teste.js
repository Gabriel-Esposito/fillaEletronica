const express = require('express');
const app = express();
const BancoDedados = require('./mysql/tabela');
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars.engine({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true } }))
app.set('view engine', 'handlebars')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

let pacientes_cad = ''
let pacientes_num = 0

app.get('/',function(req,res){
    //dados() //pag inicial
    res.render('cad')
})
app.get('/cad',function(req,res){
    cad() //cad user
    res.send('teste')
})
app.get('/dados',function(req,res){
    res.render('teste',{posts: pacientes_cad})
})

function dados(){
    BancoDedados.findAll({order:[['id','DESC']]}).then(function(posts){
        pacientes_cad = posts
        pacientes_num = pacientes_cad.length
        console.log(`dado server: ${pacientes_num} || dados mysql: ${posts.length}`)
    })
}
function senha(){
    while(true){
        if(pacientes_num < 10){
            return `00${pacientes_num++}`
        }else if(pacientes_num > 9 && pacientes_num < 100){
            return `0${pacientes_num++}`
        }else if(pacientes_num > 99 && pacientes_num <= 999){
            return pacientes_num++
        }else if(pacientes_num > 1000){
            pacientes_num - 999
        }
    }
}

function cad(){
    while(true){
        console.log(pacientes_num)
        if(pacientes_num != '000'){
            BancoDedados.create({
                nome: 'Jg',
                cpf: '123.123.123-12',
                consulta: 'Dentista',
                prioridade: 'True',
                atendido: 'true',
                senha: senha(),
                codigo: '12345678'
            })
            break
        }
    }
    
}

app.listen(8080,function(){
    console.log('Servidor ligado!')
})