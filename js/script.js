// Dados das pizzas
const pizzas = [
    { nome: "Pizza de Quatro Queijos", preco: 39.90 },
    { nome: "Pizza de Frango com Catupiry", preco: 37.90 },
    { nome: "Pizza Portuguesa", preco: 38.90 },
    { nome: "Pizza de Frango com Bacon", preco: 41.90 },
    { nome: "Pizza de Marguerita", preco: 39.90 },
    { nome: "Pizza de Calabresa", preco: 38.90 },
    { nome: "Pizza de Pepperoni", preco: 39.90 },
    { nome: "Pizza de Peito de Peru", preco: 40.90 },
    { nome: "Pizza de Brigadeiro", preco: 42.90 },
    { nome: "Pizza de Chocolate Branco", preco: 39.90 },
    { nome: "Pizza de Sorvete", preco: 39.25 },
    { nome: "Coca-cola 2L", preco: 16.00 },
    { nome: "Sprite Limão 2L", preco: 14.50 },
    { nome: "Fanta 2L", preco: 14.50 },
    { nome: "Coca-cola Lata 350ml", preco: 7.90 },
    { nome: "Sprite Limão Lata 350ml", preco: 5.00 },
    { nome: "Fanta Lata 350ml", preco: 5.00 }
];

// Monta tabela dinamicamente
document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-cardapio");

    pizzas.forEach(pizza => {
        let linha = document.createElement("tr");

        // Criar células
        let tdNome = document.createElement("td");
        tdNome.classList.add("pizzaname");
        tdNome.textContent = pizza.nome;

        let tdPreco = document.createElement("td");
        tdPreco.classList.add("preco");
        tdPreco.setAttribute("data-preco", pizza.preco);
        tdPreco.textContent = `R$${pizza.preco.toFixed(2).replace(".", ",")}`;

        let tdInput = document.createElement("td");

        // Criar input
        let input = document.createElement("input");
        input.type = "number";
        input.value = 0;
        input.min = 0;

        // Criar container de botões
        let btnContainer = document.createElement("div");
        btnContainer.classList.add("botoes");

        let btnMais = document.createElement("button");
        btnMais.textContent = "+";
        btnMais.onclick = () => increment(btnMais);

        let btnMenos = document.createElement("button");
        btnMenos.textContent = "-";
        btnMenos.onclick = () => decrement(btnMenos);

        btnContainer.append(btnMais, btnMenos);

        // Adicionar input e container na célula
        tdInput.append(input, btnContainer);

        // Adicionar células na linha
        linha.append(tdNome, tdPreco, tdInput);

        tabela.appendChild(linha);
    });

    // Adiciona listener para atualização do total
    document.querySelectorAll("input[type=number]").forEach(inp => {
        inp.addEventListener("change", somaTotal);
    });
});

// Incrementa e decrementa
function increment(btn) {
    let qtd = btn.closest("tr").querySelector("input[type=number]");
    qtd.value = parseInt(qtd.value || 0) + 1;
    somaTotal();
}

function decrement(btn) {
    let qtd = btn.closest("tr").querySelector("input[type=number]");
    qtd.value = Math.max(0, parseInt(qtd.value || 0) - 1);
    somaTotal();
}
var total = 0;
// Soma total + resumo
function somaTotal() {
    total = 0
    let linhas = document.querySelectorAll("#tabela-cardapio tr");

    let resumo = document.querySelector("#resumo tbody");
    resumo.innerHTML = "";

    linhas.forEach(linha => {
        let qtd = parseInt(linha.querySelector("input[type=number]").value) || 0;
        let preco = parseFloat(linha.querySelector(".preco").dataset.preco);
        let nome = linha.querySelector(".pizzaname").textContent;

        if (qtd > 0) {
            let subtotal = qtd * preco;
            total += subtotal;
            resumo.innerHTML += `
        <tr>
          <td>${nome}  x${qtd}</td>
          <td>R$${subtotal.toFixed(2).replace(".", ",")}</td>
        </tr>
      `;
        }
    });

    document.getElementById("total").textContent = "R$ " + total.toFixed(2).replace(".", ",");
}
// Validação form
document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();
    let nome = document.getElementById("nome").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    if (total < 1) {
        Swal.fire({
            title: 'Erro!',
            text: 'Por favor faça um pedido!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }
    if (!nome) {
        Swal.fire({
            title: 'Erro!',
            text: 'Por favor insira um nome!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }
    if (!/^\d{11}$/.test(telefone)) {
        Swal.fire({
            title: 'Erro!',
            text: 'Por favor insira um telefone válido (11 dígitos).',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    confirmarPedido()

});

function confirmarPedido() {
    Swal.fire({
        title: 'Confirmação do Pedido',
        text: 'Deseja confirmar seu pedido?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'}).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Pedido Confirmado!',
                    text: `Total: R$${total.toFixed(2).replace(".", ",")}`,
                    icon: 'success',
                    confirmButtonText: 'Fechar'
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: 'Pedido Cancelado!',
                    text: 'Que pena, você cancelou o pedido!',
                    icon: 'error',
                    confirmButtonText: 'Fechar'
                });
            }
        })

}
