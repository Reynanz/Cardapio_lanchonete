
function validation() {
    let nome = document.getElementById('nome').value
    let telefone = document.getElementById('telefone').value
    
    if (nome === ""){
        alert("Por favor insira um nome!")
        event.preventDefault()
        return;
    }

    if (telefone === ""){
        alert("Por favor insira um telefone!")
        event.preventDefault()
        return;
    } else if (isNaN(telefone)){
        alert("Por favor insira um telefone válido!")
        event.preventDefault()
        return;
    } else if (telefone.length !== 11){
        alert("Por favor insira um telefone válido!")
        event.preventDefault()
        return;
    } else {
        alert("Pedido feito com sucesso!")
    }
}