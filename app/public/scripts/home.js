const link = 'http://localhost:8082'

const soket = new WebSocket('ws://192.168.0.106:8081')

soket.addEventListener('open', (event) => {
    soket.send('entrou!')
})

soket.addEventListener('message',(event) => {
    let dadosBackJson = JSON.parse(event.data)
    addDados(dadosBackJson)
})

function addDados(dadosBack){
    let tabela = document.getElementById('container')
    let numPacientesBack = document.getElementById('numPacBack')

    numPacientesBack.innerText = dadosBack.length

    for(let i = 0; i < dadosBack.length; i++){
        tabela.innerHTML += `<div class="paciente"><p id="nomePac"><span class="material-symbols-outlined">person</span>${dadosBack[i].nome}</p><p id="consultaPac">${dadosBack[i].consulta}</p><p id="senhaPac">${dadosBack[i].senha}</p></div>`
    }
    
}

function btnCadastro(){
    window.location.href = `${link}/cad`
}

function btnChamar(){
    let setor = document.getElementById('setorLivre').value
    let btn = document.getElementById('btn-prox')
    if(setor != 'vazio'){
        btn.style.backgroundColor = 'rgb(47, 221, 47)'
        btn.style.cursor = 'pointer'
        btn.style.color = 'white'
        return 1
    }else{
        btn.style.backgroundColor = 'rgba(47, 221, 47, 0.541)'
        btn.style.color = 'rgba(255, 255, 255, 0.705)'
        btn.style.cursor = 'auto'
    }
}

function btnCPF(){
    let cpf = document.getElementById('cpfPDF').value
    let btn = document.getElementById('cpf-pdf')
    if(cpf.length == 11){
        btn.style.backgroundColor = 'rgb(248, 225, 17)'
        btn.style.cursor = 'pointer'
        btn.style.color = 'black'
        return 1
    }else{
        btn.style.backgroundColor = 'rgba(248, 225, 17, 0.541)'
        btn.style.color = 'rgba(255, 255, 255, 0.705)'
        btn.style.cursor = 'auto'
    }
}

function btnCodigo(){
    let codigo = document.getElementById('codigoSePaciente').value
    let btn = document.getElementById('btn-conferir')
    if(codigo.length == 6){
        btn.style.backgroundColor = 'rgb(248, 33, 17)'
        btn.style.cursor = 'pointer'
        btn.style.color = 'white'
        return 1
    }else{
        btn.style.backgroundColor = 'rgba(248, 33, 17, 0.541)'
        btn.style.color = 'rgba(255, 255, 255, 0.705)'
        btn.style.cursor = 'auto'
    }
}

function proximo(){
    let setor = document.getElementById('setorLivre').value
    if(btnChamar() == 1){
        fetch('/proximo',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({setor})
        })
    }
}

function imprimirNovamente(){
    let cpf = document.getElementById('cpfPDF').value
    let cpf2 = `${cpf[0]}${cpf[1]}${cpf[2]}.${cpf[3]}${cpf[4]}${cpf[5]}.${cpf[6]}${cpf[7]}${cpf[8]}-${cpf[9]}${cpf[10]}`
    if(btnCPF() == 1){
        fetch('/reImprimir',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({cpf2})
        })
        setTimeout(() => {
            window.location.href = `${link}/reImprimir`
        },1000)
    }
}

function conferir(){
    let codigo = document.getElementById('codigoSePaciente').value
    if(btnCodigo() == 1){
        fetch('/conferir',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({codigo})
        })
        setTimeout(() => {
            window.location.href = `${link}/conferir`
        },1000)
    }
}