
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

function increment(btn){
    let quantidade = btn.parentElement.querySelector("input[type=number]");
    quantidade.value = parseInt(quantidade.value) + 1;
    return; 
}
function decrement(btn){
    let quantidade = btn.parentElement.querySelector("input[type=number]");
    quantidade.value = Math.max(0, parseInt(quantidade.value)-1);
    return; 
}


