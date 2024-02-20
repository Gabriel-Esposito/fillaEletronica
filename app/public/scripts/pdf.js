const link = 'http://localhost:8082'

function letra(){
    let consulta = document.getElementById('cons').outerText
    let txt = document.getElementById('letra')
    txt.innerText = consulta[0]
}
function pdf(){
    print()
    setTimeout(() =>{
        window.location.href = `${link}/home`
    },4000)
}
letra()
pdf()