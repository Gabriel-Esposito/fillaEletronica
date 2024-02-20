const link = 'http://localhost:8082'

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