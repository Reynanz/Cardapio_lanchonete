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

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input[type=checkbox]").forEach(chk => {
        chk.addEventListener("change", somaTotal);
    });
});


function increment(btn){
    let pai = btn.closest("tr");
    let quantidade = pai.querySelector("input[type=number]");
    quantidade.value = parseInt(quantidade.value) + 1;

    somaTotal();
    return;
}
function decrement(btn){
    let pai = btn.closest("tr");
    let quantidade = pai.querySelector("input[type=number]");
    quantidade.value = Math.max(0, parseInt(quantidade.value)-1);

    somaTotal()
    return; 
}

function somaTotal() {
    let linhas = document.querySelectorAll("tr"); 
    let totalGeral = 0;

    linhas.forEach(pizza => {
        let selecionado = pizza.querySelector("input[type=checkbox]");
        let quantidade = pizza.querySelector("input[type=number]");
        let precoEl = pizza.querySelector(".preco");

        if (selecionado && quantidade && precoEl) {
            let preco = parseFloat(precoEl.getAttribute("value"));
            let subtotal = parseInt(quantidade.value) * preco;


            if (selecionado.checked) {
                totalGeral += subtotal;
            }
        }
    });

 
    let total = document.getElementById("total");
    total.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");
}
