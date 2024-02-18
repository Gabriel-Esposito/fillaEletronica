function codigo(){
    let valores = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz','12345678901234567890123456']
    let codigoPaciente = ''

    for(let i = 0; i < 6; i++){
        let op = Math.floor(Math.random() * 3)
        let val = Math.floor(Math.random() * 26)
        codigoPaciente += valores[op][val]
        //console.log(`op: ${op} | val: ${val} | valorFinal: ${valores[op][val]}`)
    }
    return codigoPaciente
}
console.log(codigo())