
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
    let pai = btn.closest("tr");
    let quantidade = pai.querySelector("input[type=number]");
    quantidade.value = parseInt(quantidade.value) + 1;
    somaTotal(pai,quantidade.value);
    return;
}
function decrement(btn){
    let pai = btn.closest("tr");
    let quantidade = pai.querySelector("input[type=number]");
    quantidade.value = Math.max(0, parseInt(quantidade.value)-1);
    somaTotal(pai, quantidade.value)
    return; 
}

function somaTotal(pizza, count){
    let selecionado = pizza.querySelector("input[type=checkbox]");
    let contador = count;
    let valor = pizza.querySelector(".preco");
    valor = parseFloat(valor.getAttribute("value"))
    let soma = contador * valor;
    let total = document.getElementById("total")


    if (selecionado.checked){
        total.textContent = "R$" + String(soma.toFixed(2))
        return;
    } else{
        return;
    }
}
