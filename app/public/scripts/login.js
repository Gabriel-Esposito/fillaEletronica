const link = 'http://localhost:8082'

function btn(){
    let senha = document.getElementById('senhaUser').value
    let btn = document.getElementById('btn')

    if(senha.length != 0){
        btn.style.backgroundColor = 'rgb(47, 221, 47)'
        btn.style.color = 'white'
        return 1
    }else{
        btn.style.backgroundColor = 'rgba(47, 221, 47, 0.541)'
        btn.style.color = 'rgba(255, 255, 255, 0.705)'
    }
}

function entrar(){
    let senha = document.getElementById('senhaUser').value
    if(btn() == 1){
        fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({senha})
        })
        setTimeout(() => {
            window.location.href = `${link}/home`
        },1000)
    }
}