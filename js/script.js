// ===== Variáveis =====
let total = 0;
let qtdItens = 0;
const nome = document.getElementById("nome");
const endereco = document.getElementById("endereco");
const obs = document.getElementById("obs");
const resumoTbody = document.querySelector("#resumo tbody");
const carrinhoContainer = document.getElementById("carrinho");
const btnCarrinho = document.getElementById("btn-carrinho");

// ===== Dados dos lanches =====
const lanches = [
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

// Categorias
const categorias = {
    "Lanches": [0],
    "Pastéis": [1,2,3,4,5],
    "Salgados": [6,7,8,9],
    "Tortas e Bolos": [10,11,12,13],
    "Refrigerantes": [14,15,16,17]
};

// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", () => {
    montarCardapio();
    carregarUsuario();
    btnCarrinho.addEventListener("click", toggleCarrinho);
    document.getElementById("form").addEventListener("submit", enviarPedido);
});

// ===== Funções =====

// Monta o cardápio com categorias
function montarCardapio() {
    const tabela = document.getElementById("tabela-cardapio");
    tabela.innerHTML = "";

    for (let cat in categorias) {
        let trCat = document.createElement("tr");
        let thCat = document.createElement("th");
        thCat.colSpan = 3;
        thCat.textContent = cat;
        thCat.classList.add("categorias");
        trCat.appendChild(thCat);
        tabela.appendChild(trCat);

        categorias[cat].forEach(id => {
            let lanche = lanches[id];
            let tr = document.createElement("tr");
            tr.dataset.id = lanche.id;

            let tdNome = document.createElement("td");
            tdNome.classList.add("lanchename");
            tdNome.dataset.quantidade = 0;
            tdNome.textContent = lanche.nome;

            let tdPreco = document.createElement("td");
            tdPreco.classList.add("preco");
            tdPreco.dataset.preco = lanche.preco;
            tdPreco.textContent = `R$ ${lanche.preco.toFixed(2).replace('.', ',')}`;

            let tdBtn = document.createElement("td");
            let btnAdd = document.createElement("button");
            btnAdd.textContent = "Adicionar ao carrinho";
            btnAdd.onclick = () => addToCart(lanche.id);
            tdBtn.appendChild(btnAdd);

            tr.append(tdNome, tdPreco, tdBtn);
            tabela.appendChild(tr);
        });
    }
}

// Adiciona item ao carrinho
function addToCart(id) {
    const linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    const lancheQtd = linha.querySelector(".lanchename");
    lancheQtd.dataset.quantidade = parseInt(lancheQtd.dataset.quantidade || 0) + 1;
    somaTotal();
    montarResumo();
}

// Soma total
function somaTotal() {
    total = 0;
    qtdItens = 0;

    lanches.forEach(lanche => {
        const linha = document.querySelector(`#tabela-cardapio tr[data-id='${lanche.id}']`);
        const qtd = parseInt(linha.querySelector(".lanchename").dataset.quantidade || 0);
        if (qtd > 0) {
            qtdItens += 1;
            total += lanche.preco * qtd;
        }
    });

    document.getElementById("total").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Monta resumo
function montarResumo() {
    resumoTbody.innerHTML = "";

    lanches.forEach(lanche => {
        const linha = document.querySelector(`#tabela-cardapio tr[data-id='${lanche.id}']`);
        const qtd = parseInt(linha.querySelector(".lanchename").dataset.quantidade || 0);
        if (qtd > 0) {
            const tr = document.createElement("tr");
            tr.dataset.id = lanche.id;

            const tdNome = document.createElement("td");
            tdNome.textContent = `${lanche.nome} x${qtd}`;

            const tdPreco = document.createElement("td");
            tdPreco.textContent = `R$ ${(lanche.preco * qtd).toFixed(2).replace('.', ',')}`;

            const tdExcluir = document.createElement("td");
            tdExcluir.innerHTML = `<button class="excluir">🗑️</button>`;
            tdExcluir.querySelector("button").onclick = () => removeItem(lanche.id);

            tr.append(tdNome, tdPreco, tdExcluir);
            resumoTbody.appendChild(tr);
        }
    });
}

// Remove item
function removeItem(id) {
    const linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    linha.querySelector(".lanchename").dataset.quantidade = 0;
    montarResumo();
    somaTotal();
}

// Toggle carrinho
function toggleCarrinho() {
    if (carrinhoContainer.classList.contains("carrinho-fechado")) {
        carrinhoContainer.classList.replace("carrinho-fechado", "carrinho-aberto");
        btnCarrinho.textContent = "❌";
        montarResumo();
    } else {
        btnCarrinho.textContent = "🛒";
        carrinhoContainer.classList.replace("carrinho-aberto", "carrinho-fechado");
    }
}

// Salva e carrega usuário
function carregarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('pedido')) || {};
    if (usuario.name) nome.value = usuario.name;
    if (usuario.address) endereco.value = usuario.address;
}
function salvarUsuario() {
    localStorage.setItem('pedido', JSON.stringify({ name: nome.value.trim(), address: endereco.value.trim() }));
}

// Envia pedido
function enviarPedido(e) {
    e.preventDefault();
    if (total < 1) return Swal.fire("Erro!", "Por favor faça um pedido!", "error");
    if (!nome.value.trim()) return Swal.fire("Erro!", "Por favor insira um nome!", "error");
    if (!endereco.value.trim()) return Swal.fire("Erro!", "Por favor insira um endereço!", "error");

    salvarUsuario();
    abrirWhatsApp();
}

// Gera texto do pedido
function gerarPedido() {
    let ped = '';
    resumoTbody.querySelectorAll("tr").forEach(tr => {
        const nomeQtd = tr.querySelector("td:first-child").textContent;
        const preco = tr.querySelector("td:nth-child(2)").textContent;
        ped += `\n- *${nomeQtd}* ${preco}\n`;
    });
    return ped;
}

// Abre WhatsApp
function abrirWhatsApp() {
    const pedido = gerarPedido();
    const mensagem = `Cliente: *${nome.value.trim()}*\nOlá, quero pedir:\n${pedido}\nTotal: *R$${total.toFixed(2).replace('.', ',')}*\nEndereço: ${endereco.value.trim()}\n*Obs: ${obs.value.trim()}*`;
    window.open(`https://wa.me/5579996805818?text=${encodeURIComponent(mensagem)}`);
}
