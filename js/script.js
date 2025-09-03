// ===== Variáveis globais =====
var total = 0;
var qtdItens = 0;
var nome = document.getElementById("nome");
var endereco = document.getElementById("endereco");
var obs = document.getElementById("obs");

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

// ===== Inicialização =====
document.addEventListener("DOMContentLoaded", () => {
    const tabela = document.getElementById("tabela-cardapio");
    const resumo = document.querySelector("#resumo tbody");

    // Monta tabela do cardápio
    lanches.forEach(lanche => {
        let linha = document.createElement("tr");
        linha.dataset.id = lanche.id; // ID único

        let trCategoria = document.createElement("tr");
        let thnomeCategoria = document.createElement("th");

        thnomeCategoria.classList.add("categorias");
        thnomeCategoria.colSpan = 3;

        let tdNome = document.createElement("td");
        tdNome.classList.add("lanchename");
        tdNome.dataset.quantidade = 0;
        tdNome.textContent = lanche.nome;

        let tdPreco = document.createElement("td");
        tdPreco.classList.add("preco");
        tdPreco.dataset.preco = lanche.preco;
        tdPreco.textContent = `R$ ${lanche.preco.toFixed(2).replace('.', ',')}`;

        let btnContainer = document.createElement("div");
        btnContainer.classList.add("botoes");

        let btnAdd = document.createElement("button");
        btnAdd.textContent = "Adicionar ao carrinho";
        btnAdd.onclick = () => addToCart(lanche.id);

        btnContainer.append(btnAdd);

        linha.append(tdNome, tdPreco, btnContainer);
        tabela.appendChild(linha);

        // Adiciona categorias
        switch (lanche.nome) {
            case "Cachorro-quente":
                thnomeCategoria.textContent = "Pastéis";
                trCategoria.append(thnomeCategoria);
                tabela.appendChild(trCategoria);
                break;
            case "Pastel de Pizza":
                thnomeCategoria.textContent = "Salgados";
                trCategoria.append(thnomeCategoria);
                tabela.appendChild(trCategoria);
                break;
            case "Bolinho de Presunto e Queijo":
                thnomeCategoria.textContent = "Tortas e Bolos";
                trCategoria.append(thnomeCategoria);
                tabela.appendChild(trCategoria);
                break;
            case "Bolo de Leite":
                thnomeCategoria.textContent = "Refrigerantes";
                trCategoria.append(thnomeCategoria);
                tabela.appendChild(trCategoria);
                break;
            default:
                break;
        }

    });

    // Carrega dados do usuário do localStorage
    let usuario = getData();
    if (usuario && usuario.name && usuario.address) {
        nome.value = usuario.name;
        endereco.value = usuario.address;
    }

    // Event delegation para excluir do resumo
    resumo.addEventListener("click", e => {
        if (e.target.classList.contains("excluir")) {
            let trResumo = e.target.closest("tr");
            let id = parseInt(trResumo.dataset.id);

            // Zera quantidade no cardápio
            let linhaCardapio = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
            if (linhaCardapio) {
                linhaCardapio.querySelector(".lanchename").dataset.quantidade = 0;
            }

            trResumo.remove();
            somaTotal();
        }
    });

    // Calcula total inicial
    somaTotal();
});

// ===== Adiciona ao carrinho =====
function addToCart(id) {
    let linha = document.querySelector(`#tabela-cardapio tr[data-id='${id}']`);
    let lancheqtd = linha.querySelector(".lanchename");
    lancheqtd.dataset.quantidade = parseInt(lancheqtd.dataset.quantidade || 0) + 1;
    somaTotal();
}

// ===== Soma o total =====
function somaTotal() {
    total = 0;
    qtdItens = 0;
    
    lanches.forEach(lanche => {
        let linhaCardapio = document.querySelector(`#tabela-cardapio tr[data-id='${lanche.id}']`);
        let qtd = parseInt(linhaCardapio.querySelector(".lanchename").dataset.quantidade || 0); 
        
        if (qtd > 0) {
            qtdItens += 1;
            let subtotal = lanche.preco * qtd;
            total += subtotal;
        }
    });

    document.getElementById("total").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    montarResumo();
}

// ===== Monta o resumo =====
function montarResumo() {
    const resumo = document.querySelector("#resumo tbody");
    resumo.innerHTML = "";

    lanches.forEach(lanche => {
        let linhaCardapio = document.querySelector(`#tabela-cardapio tr[data-id='${lanche.id}']`);
        let qtd = parseInt(linhaCardapio.querySelector(".lanchename").dataset.quantidade || 0); 
        
        if (qtd > 0) {
            let trResumo = document.createElement("tr");
            trResumo.dataset.id = lanche.id;

            let tdNome = document.createElement("td");
            tdNome.textContent = `${lanche.nome} x${qtd}`;

            let tdPreco = document.createElement("td");
            let subtotal = lanche.preco * qtd;
            tdPreco.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

            let tdExcluir = document.createElement("td");
            tdExcluir.innerHTML = `<button class="excluir">🗑️</button>`;

            trResumo.append(tdNome, tdPreco, tdExcluir);
            resumo.appendChild(trResumo);
        }
    });
}

// ===== Formulário =====
document.getElementById("form").addEventListener("submit", e => {
    e.preventDefault();

    if (total < 1) {
        showAlert("Erro!", "error", "<p>Por favor faça um pedido!</p>");
        return;
    }
    if (!nome.value.trim()) {
        showAlert("Erro!", "error", "<p>Por favor insira um nome!</p>");
        return;
    }
    if (!endereco.value.trim()) {
        showAlert("Erro!", "error", "<p>Por favor insira um endereço!</p>");
        return;
    }

    saveData({ name: nome.value.trim(), address: endereco.value.trim() });
    pedirnoWhats()
});

// ===== Funções auxiliares =====

// Exibe alerta com SweetAlert2
function showAlert(titulo, icone, mensagem) {
    Swal.fire({ title: titulo, icon: icone, html: mensagem });
}
// Salva dados no localStorage
function saveData(dados) {
    localStorage.setItem('pedido', JSON.stringify(dados));
}
// Recupera dados do localStorage
function getData() {
    const dados = localStorage.getItem('pedido');
    return dados ? JSON.parse(dados) : null;
}
// Gera o texto do pedido
function gerarPedido() {
    const resumo = document.querySelector("#resumo tbody");
    let ped = '';
    resumo.querySelectorAll("tr").forEach(tr => {
        let nomeQtd = tr.querySelector("td:first-child").textContent;
        let preco = tr.querySelector("td:nth-child(2)").textContent;
        ped += `\n- *${nomeQtd}* ${preco}\n`;
    });
    return ped
}
// Abre o WhatsApp com o pedido
function pedirnoWhats() {
    let pedido = gerarPedido()
    let mensagem = `Cliente: *${nome.value.trim()}*
    \nOlá, quero pedir:
    \n${pedido}
    \nTotal: *R$${total.toFixed(2).replace('.', ',')}*
    \nEndereço: ${endereco.value.trim()}
    \n*Obs: ${obs.value.trim()}*`;
    window.open(`https://wa.me/5579996805818?text=${encodeURIComponent(mensagem)}`);
}