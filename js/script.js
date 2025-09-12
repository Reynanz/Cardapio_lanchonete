import { obterProdutosCardapio, atualizarEstoque } from "./firebase-front.js";

// ===== Variáveis =====
let total = 0;
let qtdItens = 0;
let lanches = [];
let historico = [];
// Elementos do DOM
const nome = document.getElementById("nome");
const endereco = document.getElementById("endereco");
const obs = document.getElementById("obs");
const resumoTbody = document.querySelector("#resumo tbody");
const carrinhoContainer = document.getElementById("carrinho");
const btnCarrinho = document.getElementById("btn-carrinho");
const lastAddedItem = document.getElementById("lastItem");



// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", () => {
    obterProdutosCardapio(produtos => {
        lanches = produtos
        montarCardapio(lanches);
    });
    carregarUsuario();
    somaTotal();
    montarResumo();
    btnCarrinho.addEventListener("click", toggleCarrinho);
    document.getElementById("form").addEventListener("submit", enviarPedido);
});

// ===== Funções =====

// Adiciona item ao carrinho
function addToCart(id) {
    const linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    const lancheQtd = linha.querySelector(".lanchename");
    lancheQtd.dataset.quantidade = parseInt(lancheQtd.dataset.quantidade || 0) + 1;

    if (!historico.includes(id)) historico.push(id);

    somaTotal();
    montarResumo();
    atualizarLastItem();
}
//
function montarCardapio() {
    const tabela = document.getElementById("tabela-cardapio");
    tabela.innerHTML = "";

    lanches.forEach(p => {
        const ths = tabela.querySelectorAll("th");
        const existe = Array.from(ths).some(th => th.textContent.trim() === p.categoria);

        // Cria linha do lanche
        let trLanche = document.createElement("tr");
        trLanche.dataset.id = p.id
        trLanche.dataset.categoria = p.categoria

        let lancheNometd = document.createElement("td");
        lancheNometd.classList.add("lanchename");
        lancheNometd.textContent = p.nome + " ";

        let estoqueSpan = document.createElement("span");
        estoqueSpan.classList.add("estoque-disponivel");
        estoqueSpan.textContent = `(Disponível: ${p.quantidade})`;
        lancheNometd.appendChild(estoqueSpan);

        lancheNometd.dataset.quantidade = 0;
        lancheNometd.dataset.disponivel = p.quantidade;

        let lanchePrecotd = document.createElement("td");
        lanchePrecotd.classList.add("preco");
        lanchePrecotd.textContent = `R$ ${p.preco.toFixed(2).replace('.', ',')}`;

        let tdBtn = document.createElement("td");
        let btnAdd = document.createElement("button");
        btnAdd.textContent = "Adicionar ao carrinho";
        btnAdd.classList.add("btnadd")

        if (p.quantidade < 1) {
            btnAdd.classList.replace("btnadd", "btndisable");
            btnAdd.disabled = true;
            btnAdd.textContent = "Indisponível";
        } 
        btnAdd.onclick = () => addToCart(p.id);
        tdBtn.appendChild(btnAdd);

        trLanche.append(lancheNometd, lanchePrecotd, tdBtn);

        if (!existe) {
            // Cria nova categoria
            let trCategoria = document.createElement("tr");
            let categoriaNome = document.createElement("th");
            categoriaNome.textContent = p.categoria;
            categoriaNome.colSpan = 3;
            categoriaNome.classList.add("categorias");
            trCategoria.appendChild(categoriaNome);
            tabela.append(trCategoria);
            tabela.append(trLanche);
        } else {
            // Categoria já existe → encontra a linha e adiciona depois
            const trCategoriaExistente = Array.from(tabela.querySelectorAll("tr")).find(tr => {
                const th = tr.querySelector("th");
                return th && th.textContent.trim() === p.categoria;
            });
            trCategoriaExistente.insertAdjacentElement("afterend", trLanche);
        }
    });
}

// Soma total
function somaTotal() {
    total = 0;
    qtdItens = 0;
    lanches.forEach(lanche => {
        const linha = document.querySelector(`#tabela-cardapio tr[data-id='${lanche.id}']`);
        const qtd = parseInt(linha.querySelector(".lanchename").dataset.quantidade || 0);
        if (qtd > 0) {
            qtdItens++;
            total += lanche.preco * qtd;
        }
    });

    document.getElementById("total").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    notification();
}

// Notificação de itens no carrinho
function notification() {
    const notify = document.getElementById("numItems");
    if (qtdItens === 0) {
        notify.style.display = "none";
    } else {
        notify.style.display = "flex";
    }
    notify.textContent = qtdItens;
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
    historico = historico.filter(hId => {
        const l = document.querySelector(`#tabela-cardapio tr[data-id='${hId}']`);
        return parseInt(l.querySelector(".lanchename").dataset.quantidade || 0) > 0;
    });
    montarResumo();
    somaTotal();
    atualizarLastItem();
}

// Toggle carrinho
function toggleCarrinho() {
    let res = document.getElementById("resumo")
    montarResumo();
    if (carrinhoContainer.classList.contains("carrinho-fechado")) {
        carrinhoContainer.classList.replace("carrinho-fechado", "carrinho-aberto");
        btnCarrinho.textContent = "❌";

        res.style.display = "block";
        setTimeout(() => {
            res.style.transform = "scale(1)";
            res.style.pointerEvents = "auto"
        }, 100)

    } else {
        btnCarrinho.textContent = "🛒";
        carrinhoContainer.classList.replace("carrinho-aberto", "carrinho-fechado");

        res.style.transform = "scale(0)";
        res.style.pointerEvents = "none"
        res.style.display = "none";
    }
    atualizarLastItem();
}

function atualizarLastItem() {
    if (historico.length === 0) {
        lastAddedItem.style.display = "none";
        lastAddedItem.style.transform = "scale(0)";
        btnCarrinho.style.borderRadius = "50%";
        return;
    }

    // pega o último item válido do histórico
    for (let i = historico.length - 1; i >= 0; i--) {
        const id = historico[i];
        const linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
        const qtd = parseInt(linha.querySelector(".lanchename").dataset.quantidade || 0);
        if (qtd > 0) {
            const lanche = lanches.find(l => l.id === id);
            lastAddedItem.textContent = `${lanche.nome} x ${qtd}`;
            lastAddedItem.style.display = "block";
            setTimeout(() => {
                btnCarrinho.style.borderRadius = "50% 0 0 50%";
                lastAddedItem.style.transform = "scale(1)";
            }, 100);
            return;
        }
    }

    // se nenhum item válido encontrado
    lastAddedItem.style.display = "none";
    lastAddedItem.style.transform = "scale(0)";
    btnCarrinho.style.borderRadius = "50%";
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

    let estoqueInsuficiente = [];
    resumoTbody.querySelectorAll("tr").forEach(tr => {
        const id = tr.dataset.id;
        const qtd = parseInt(tr.querySelector("td:first-child").textContent.split('x')[1]);
        const lanche = lanches.find(l => l.id == id);
        if (qtd > lanche.quantidade) {
            estoqueInsuficiente.push(`${lanche.nome} (disponível: ${lanche.quantidade}, pedido: ${qtd})`);
        }
    });

    if (estoqueInsuficiente.length > 0) {
        return Swal.fire(
            "Estoque insuficiente!",
            `Os seguintes itens não têm quantidade suficiente:<br>${estoqueInsuficiente.join('<br>')}`,
            "error"
        );
    }

    salvarUsuario();
    abrirWhatsApp();
}

// Gera texto do pedido
function gerarPedido() {
    let ped = '';
    resumoTbody.querySelectorAll("tr").forEach(tr => {
        const id = tr.dataset.id;
        const qtd = parseInt(tr.querySelector("td:first-child").textContent.split('x')[1]);
        const lanche = lanches.find(l => l.id == id);
        const novoEstoque = lanche.quantidade - qtd;
        ped += `\n- *${lanche.nome} x${qtd}* R$ ${(lanche.preco * qtd).toFixed(2).replace('.', ',')}\n`;
        atualizarEstoque(id, novoEstoque); // Passa o novo valor absoluto
    });
    return ped;
}

// Abre WhatsApp
function abrirWhatsApp() {
    const pedido = gerarPedido();
    const mensagem = `Cliente: *${nome.value.trim()}*\nOlá, quero pedir:\n${pedido}\nTotal: *R$${total.toFixed(2).replace('.', ',')}*\nEndereço: ${endereco.value.trim()}\n*Obs: ${obs.value.trim()}*`;
    window.open(`https://wa.me/5579999204686?text=${encodeURIComponent(mensagem)}`);
}

