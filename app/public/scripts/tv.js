const soket = new WebSocket('ws://192.168.0.106:8081')

soket.addEventListener('open',(event) =>{
    soket.send('isTV')
})
soket.addEventListener('message',(event) => {
    let atual = document.getElementById('atual')
    let senha1 = document.getElementById('senha1')
    let setor1 = document.getElementById('setor1')
    let senha2 = document.getElementById('senha2')
    let setor2 = document.getElementById('setor2')
    let senha3 = document.getElementById('senha3')
    let setor3 = document.getElementById('setor3')
    let dados_back = [event.data,0,0,0,0,0,0]
    atual.innerText = dados_back[0]
    senha1.innerText = dados_back[1]
    setor1.innerText = dados_back[2]
    senha2.innerText = dados_back[3]
    setor2.innerText = dados_back[4]
    senha3.innerText = dados_back[5]
    setor3.innerText = dados_back[6]
    ouvir()
    console.log(event.data)
})

function ouvir(){
    let audios = [a0 = document.getElementById('a0'),a1 = document.getElementById('a1'),a2 = document.getElementById('a2'),a3 = document.getElementById('a3'),a4 = document.getElementById('a4'),a5 = document.getElementById('a5'),a6 = document.getElementById('a6'),a7 = document.getElementById('a7'),a8 = document.getElementById('a8'),a9 = document.getElementById('a9')]
    let chamada = document.getElementById('chamada')
    let senha = document.getElementById('senha')
    let num = document.getElementById('atual').outerText

    chamada.play()
    setTimeout(() => {
        senha.play()
    },3000)
    setTimeout(() => {
        audios[num[0]].play()
    },4000)
    setTimeout(() => {
        audios[num[1]].play()
    },5000)
    setTimeout(() => {
        audios[num[2]].play()
    },6000)
}
