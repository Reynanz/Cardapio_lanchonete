// ===== Dados das pizzas =====
const pizzas = [
    { id: 0, nome: "X-Burguer", preco: 12.00 },
    { id: 1, nome: "Cachorro-quente", preco: 5.00 },
    { id: 2, nome: "Pastel de Frango", preco: 5.00 },
    { id: 3, nome: "Pastel de Carne", preco: 5.00 },
    { id: 4, nome: "Pastel de Queijo", preco: 5.00 },
    { id: 5, nome: "Pastel de Pizza", preco: 5.00 },
    { id: 6, nome: "Coxinha", preco: 4.00 },
    { id: 7, nome: "Calafrango", preco: 4.00 },
    { id: 8, nome: "Enroladinho de Salsicha", preco: 4.00 },
    { id: 9, nome: "Salgado de Charque", preco: 4.00 },
    { id: 10, nome: "Bolinho de Presunto e Queijo", preco: 4.00 },
    { id: 11, nome: "Torta de Frango", preco: 5.00 },
    { id: 12, nome: "Bolo de Ovos", preco: 4.00 },
    { id: 13, nome: "Bolo de Leite", preco: 4.00 },
    { id: 14, nome: "Coca-cola 1L", preco: 6.00 },
    { id: 15, nome: "Guaraná 1L", preco: 6.00 },
    { id: 16, nome: "Coca-cola Lata 350ml", preco: 4.00 },
    { id: 17, nome: "Guaraná Lata 350ml", preco: 4.00 }
];

let total = 0;

// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-cardapio");
    const resumo = document.querySelector("#resumo tbody");

    // Monta tabela do cardápio
    pizzas.forEach(pizza => {
        let linha = document.createElement("tr");
        linha.dataset.id = pizza.id; // ID único

        let tdNome = document.createElement("td");
        tdNome.classList.add("pizzaname");
        tdNome.textContent = pizza.nome;

        let tdPreco = document.createElement("td");
        tdPreco.classList.add("preco");
        tdPreco.dataset.preco = pizza.preco;
        tdPreco.textContent = `R$ ${pizza.preco.toFixed(2).replace('.', ',')}`;

        let tdInput = document.createElement("td");
        let input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.value = 1;

        let btnContainer = document.createElement("div");
        btnContainer.classList.add("botoes");

        let btnMais = document.createElement("button");
        btnMais.textContent = "+";
        btnMais.onclick = () => increment(pizza.id);

        let btnMenos = document.createElement("button");
        btnMenos.textContent = "-";
        btnMenos.onclick = () => decrement(pizza.id);

        btnContainer.append(btnMais, btnMenos);
        tdInput.append(input, btnContainer);

        linha.append(tdNome, tdPreco, tdInput);
        tabela.appendChild(linha);
    });

    // Carrega dados do usuário do localStorage
    let usuario = getData();
    if (usuario && usuario.name && usuario.phone && usuario.address) {
        document.getElementById("nome").value = usuario.name;
        document.getElementById("telefone").value = usuario.phone;
        document.getElementById("endereco").value = usuario.address;
    }

    // Event delegation para excluir do resumo
    resumo.addEventListener("click", e => {
        if (e.target.classList.contains("excluir")) {
            let trResumo = e.target.closest("tr");
            let id = parseInt(trResumo.dataset.id);

            // Zera quantidade no cardápio
            let linhaCardapio = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
            if (linhaCardapio) {
                linhaCardapio.querySelector("input[type=number]").value = 0;
            }

            trResumo.remove();
            somaTotal();
        }
    });

    // Listener para inputs de quantidade
    document.querySelectorAll("#tabela-cardapio input[type=number]").forEach(inp => {
        inp.addEventListener("change", somaTotal);
    });

    // Calcula total inicial
    somaTotal();
});

// ===== Controle de quantidade =====
function increment(id) {
    let linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    let input = linha.querySelector("input[type=number]");
    input.value = parseInt(input.value || 0) + 1;
    somaTotal();
}

function decrement(id) {
    let linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    let input = linha.querySelector("input[type=number]");
    input.value = Math.max(0, parseInt(input.value || 0) - 1);
    somaTotal();
}

// ===== Soma total e resumo =====
function somaTotal() {
    total = 0;
    const resumo = document.querySelector("#resumo tbody");
    resumo.innerHTML = "";

    pizzas.forEach(pizza => {
        let linhaCardapio = document.querySelector(`#tabela-cardapio tr[data-id='${pizza.id}']`);
        let qtd = parseInt(linhaCardapio.querySelector("input[type=number]").value || 0);
        if (qtd > 0) {
            let trResumo = document.createElement("tr");
            trResumo.dataset.id = pizza.id;

            let tdNome = document.createElement("td");
            tdNome.textContent = `${pizza.nome} x${qtd}`;

            let tdPreco = document.createElement("td");
            let subtotal = pizza.preco * qtd;
            tdPreco.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

            let tdExcluir = document.createElement("td");
            tdExcluir.innerHTML = `<button class="excluir">🗑️</button>`;

            trResumo.append(tdNome, tdPreco, tdExcluir);
            resumo.appendChild(trResumo);

            total += subtotal;
        }
    });

    document.getElementById("total").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ===== Formulário =====
document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();

    if (total < 1) {
        showAlert("Erro!", "error", "<p>Por favor faça um pedido!</p>");
        return;
    }

    const telefoneValido = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    let nome = document.getElementById("nome").value.trim();
    let telefone = document.getElementById("telefone").value.trim();
    let endereco = document.getElementById("endereco").value.trim();

    if (!nome) {
        showAlert("Erro!", "error", "<p>Por favor insira um nome!</p>");
        return;
    }
    if (!telefoneValido.test(telefone)) {
        showAlert("Erro!", "error", "<p>Por favor insira um telefone válido (ex: (11) 91234-5678).</p>");
        return;
    }
    if (!endereco) {
        showAlert("Erro!", "error", "<p>Por favor insira um endereço!</p>");
        return;
    }

    saveData({ name: nome, phone: telefone, address: endereco });
    confirmarPedido();
});

// ===== Confirmação do pedido =====
function confirmarPedido() {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    let obs = document.getElementById("obs").value.trim();

    Swal.fire({
        title: 'Confirmação do Pedido!',
        html: `
            <p>Deseja confirmar seu pedido?</p>
            ${gerarResumoParaAlerta()}
            <p style='font-size:14px;'>Obs: *${obs}*</p>
            <p>Total: R$ ${total.toFixed(2).replace('.', ',')}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            showAlert("Pedido Enviado!", "success", `
                <p>Cliente: ${nome}</p>
                <p>Endereço: ${endereco}</p>
                <p>Tempo de espera: 30m</p>
            `);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            showAlert("Pedido Cancelado!", "error", "Que pena! Você cancelou o pedido.");
        }
    });
}

// ===== Funções auxiliares =====
function showAlert(titulo, icone, mensagem) {
    Swal.fire({ title: titulo, icon: icone, html: mensagem });
}

function saveData(dados) {
    localStorage.setItem('pedido', JSON.stringify(dados));
}

function getData() {
    const dados = localStorage.getItem('pedido');
    return dados ? JSON.parse(dados) : null;
}

function gerarResumoParaAlerta() {
    const resumo = document.querySelector("#resumo tbody");
    let html = "<table style='font-size:14px; text-align:justify; max-width:100%;'>";

    resumo.querySelectorAll("tr").forEach(tr => {
        const nomeQtd = tr.querySelector("td:first-child").textContent;
        const preco = tr.querySelector("td:nth-child(2)").textContent;
        html += `<tr><td>${nomeQtd}</td><td>${preco}</td></tr>`;
    });

    html += "</table>";
    return html;
}
