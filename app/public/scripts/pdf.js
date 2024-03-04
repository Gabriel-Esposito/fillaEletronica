const link = 'http://localhost:8082'

function letra(){
    let consulta = document.getElementById('cons').outerText
    let pri = document.getElementById('pri').outerText
    let txt = document.getElementById('letra')

    if(pri != 'Não'){
        txt.innerText = `P${consulta[0]}`
    }else{
        txt.innerText = consulta[0]
    }
}
function pdf(){
    print()
    setTimeout(() =>{
        window.location.href = `${link}/home`
    },2000)
}
letra()
pdf()