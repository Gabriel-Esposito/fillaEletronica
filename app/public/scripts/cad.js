let dados = ['','','','']

function nomeDoPaciente(){
    let name = document.getElementById('name').value
    let namePaciente = document.getElementById('pacienteNome')

    namePaciente.innerText = name
    dados[0] = namePaciente.outerText
    cadastrar()
}

function cpfDoPaciente(){
    let cpf = document.getElementById('cpf').value
    let cpfPaciente = document.getElementById('pacienteCPF')
    
    if(cpf.length == 11){
        cpfPaciente.innerText = `${cpf[0]}${cpf[1]}${cpf[2]}.${cpf[3]}${cpf[4]}${cpf[5]}.${cpf[6]}${cpf[7]}${cpf[8]}-${cpf[9]}${cpf[10]}`
    }else if(cpf.length < 11){
        cpfPaciente.innerText = ''
    }
    dados[1] = cpfPaciente.outerText
    cadastrar()
}

function consultaDoPaciente(){
    let tipoDeConsulta = document.getElementById('tipoConsulta').value
    let consultaPaciente = document.getElementById('pacienteConsulta')

    if(tipoDeConsulta == 'vazio'){
        consultaPaciente.innerHTML = ''
    }else {
        consultaPaciente.innerHTML = tipoDeConsulta
    }
    dados[2] = consultaPaciente.outerText
    cadastrar()
}

function semPrioridade(){
    let btnS = document.getElementById('sim')
    let btnN = document.getElementById('nao')
    let boxTipoPrioridade = document.getElementById('prioridade') 
    let prioridadePaciente = document.getElementById('pacientePrioridade')

    btnS.style.backgroundColor = 'rgb(8, 199, 8, 0.596)'
    btnS.style.color = 'rgba(255, 255, 255, 0.596)'

    btnN.style.backgroundColor = 'red'
    btnN.style.color = 'white'

    boxTipoPrioridade.style.display = 'none'
    prioridadePaciente.innerText = 'Não'
    dados[3] = 'Não'
    cadastrar()
}

function comPrioridade(){
    let btnS = document.getElementById('sim')
    let btnN = document.getElementById('nao')
    let boxTipoPrioridade = document.getElementById('prioridade')

    btnN.style.backgroundColor = 'rgba(255, 0, 0, 0.596)'
    btnN.style.color = 'rgba(255, 255, 255, 0.596)'

    btnS.style.backgroundColor = 'rgb(8, 199, 8)'
    btnS.style.color = 'white'

    boxTipoPrioridade.style.display = 'block'
    prioridadeDoPaciente()
    dados[3] = ''
    cadastrar()
}

function prioridadeDoPaciente(){
    let prioridade = document.getElementById('tipoDePrioridade').value
    let prioridadePaciente = document.getElementById('pacientePrioridade')

    prioridadePaciente.innerText = prioridade
    dados[3] = prioridadePaciente.outerText
    cadastrar()
}

function cadastrar(){
    let btnCadastro = document.getElementById('cadastrar')
    if(dados[0] != '' && dados[1] != '' && dados[2] != '' && dados[3] != ''){
        btnCadastro.style.backgroundColor = 'rgb(8, 199, 8)'
        btnCadastro.style.color = 'white'
        return 1
    }else{
        btnCadastro.style.backgroundColor = 'rgb(8, 199, 8, 0.596)'
        btnCadastro.style.color = 'rgba(255, 255, 255, 0.596)'
    }
}

function enviar(){
    if(cadastrar() == 1){
        console.log(dados)
        fetch('/cad',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({dados})
        })
        window.location.href = 'http://localhost:8082/cad'
    }
}