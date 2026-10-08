// Semana 05 - Objetos, Dados e Assincronismo
// Separei o código em partes para ficar mais fácil de estudar.

// PARTE 1 - VALIDANDO E SOMANDO PEDIDOS

const pedidos = [
  { cliente: "Bia", valor: 120, status: "pago" },
  { cliente: "Lucas", valor: 75, status: "pendente" },
  { cliente: "Ana", valor: 40.5, status: "pago" },
  { cliente: "", valor: 25, status: "pago" },
  { cliente: "Pedro", valor: -10, status: "pago" },
  { cliente: "Julia", valor: "80", status: "pago" }
];

// Um pedido só é válido se tiver nome e valor numérico maior que zero.
const pedidosValidos = pedidos.filter(pedido =>
  typeof pedido.cliente === "string" &&
  pedido.cliente.trim() !== "" &&
  typeof pedido.valor === "number" &&
  Number.isFinite(pedido.valor) &&
  pedido.valor > 0
);

const pedidosPagos = pedidosValidos.filter(pedido => pedido.status === "pago");
const totalFaturado = pedidosPagos.reduce((total, pedido) => total + pedido.valor, 0);
const textosPedidos = pedidosPagos.map(pedido =>
  `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`
);

console.log("===== PARTE 1 - ANÁLISE DE PEDIDOS =====");
console.log(`Pedidos recebidos: ${pedidos.length}`);
console.log(`Pedidos válidos: ${pedidosValidos.length}`);
console.log(`Pedidos pagos e válidos: ${pedidosPagos.length}`);
console.log(`Total faturado: R$ ${totalFaturado.toFixed(2)}`);
textosPedidos.forEach(texto => console.log(texto));

const resumoPedidos = document.querySelector("#resumo-pedidos");
resumoPedidos.textContent = `Pedidos válidos: ${pedidosValidos.length} | ` +
  `Pagos: ${pedidosPagos.length} | Total: R$ ${totalFaturado.toFixed(2)}`;

const listaPedidos = document.querySelector("#lista-pedidos");
textosPedidos.forEach(texto => {
  const item = document.createElement("li");
  item.textContent = texto;
  listaPedidos.append(item);
});

// Esta função será usada para mostrar o estado das duas buscas.
function mostrarStatus(elemento, estado, mensagem) {
  elemento.className = `status ${estado}`;
  elemento.textContent = mensagem;
}

// PARTE 2 - BUSCADOR DE CEP

const formCep = document.querySelector("#form-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const listaHistorico = document.querySelector("#historico-cep");
const historicoCeps = [];

// Crio o dt e o dd para mostrar cada informação do endereço.
function adicionarDadoCep(titulo, valor) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = titulo;
  dd.textContent = valor || "Não informado";
  resultadoCep.append(dt, dd);
}

function mostrarHistorico() {
  listaHistorico.replaceChildren();

  historicoCeps.forEach(pesquisa => {
    const item = document.createElement("li");
    item.textContent = `${pesquisa.cep} - ${pesquisa.cidade}/${pesquisa.uf}`;
    listaHistorico.append(item);
  });
}

formCep.addEventListener("submit", async (evento) => {
  evento.preventDefault(); // Não deixa a página recarregar.

  // Aceito CEP com hífen ou espaços, mas o resultado deve ter 8 dígitos.
  const cepDigitado = campoCep.value.trim();
  const cep = cepDigitado.replace(/[\s.-]/g, "");
  resultadoCep.replaceChildren();

  if (!/^\d{8}$/.test(cep)) {
    mostrarStatus(statusCep, "erro", "Digite um CEP válido com 8 números.");
    return;
  }

  mostrarStatus(statusCep, "carregando", "Buscando...");
  botaoCep.disabled = true;

  try {
    // O tempo limite de 5 segundos evita uma busca sem fim.
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000)
    });

    if (!resposta.ok) {
      throw new Error("Falha na conexão com o ViaCEP.");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      mostrarStatus(statusCep, "vazio", "CEP não encontrado.");
      return;
    }

    resultadoCep.replaceChildren();
    adicionarDadoCep("Rua", dados.logradouro);
    adicionarDadoCep("Bairro", dados.bairro);
    adicionarDadoCep("Cidade", dados.localidade);
    adicionarDadoCep("UF", dados.uf);

    historicoCeps.push({
      cep: cep,
      cidade: dados.localidade || "Não informada",
      uf: dados.uf || "--"
    });
    mostrarHistorico();

    // No sucesso, o aviso fica vazio porque o endereço já aparece na tela.
    mostrarStatus(statusCep, "sucesso", "");
  } catch (erro) {
    mostrarStatus(statusCep, "erro", "Falha na conexão. Tente novamente.");
    console.error("Erro na busca do CEP:", erro.message);
  } finally {
    botaoCep.disabled = false;
  }
});

// PARTE 3 - MINI POKÉDEX

const formPokemon = document.querySelector("#form-pokemon");
const campoPokemon = document.querySelector("#pokemon");
const botaoPokemon = document.querySelector("#botao-pokemon");
const statusPokemon = document.querySelector("#status-pokemon");
const resultadoPokemon = document.querySelector("#resultado-pokemon");

formPokemon.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = campoPokemon.value.trim().toLowerCase();
  resultadoPokemon.replaceChildren();

  if (nome === "") {
    mostrarStatus(statusPokemon, "erro", "Digite o nome de um Pokémon.");
    return;
  }

  mostrarStatus(statusPokemon, "carregando", "Buscando...");
  botaoPokemon.disabled = true;

  try {
    const resposta = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    // O erro 404 significa que o nome pesquisado não foi encontrado.
    if (resposta.status === 404) {
      mostrarStatus(statusPokemon, "vazio", "Pokémon não encontrado.");
      return;
    }

    if (!resposta.ok) {
      throw new Error("Falha na conexão com a PokéAPI.");
    }

    const dados = await resposta.json();
    const titulo = document.createElement("h3");
    titulo.textContent = dados.name;

    const imagem = document.createElement("img");
    imagem.src = dados.sprites.front_default || "";
    imagem.alt = `Imagem do Pokémon ${dados.name}`;

    const tipos = document.createElement("p");
    const nomesTipos = dados.types.map(item => item.type.name);
    tipos.textContent = `Tipos: ${nomesTipos.join(", ")}`;

    const informacoes = document.createElement("div");
    informacoes.append(titulo, tipos);
    resultadoPokemon.append(imagem, informacoes);

    mostrarStatus(statusPokemon, "sucesso", "");
  } catch (erro) {
    mostrarStatus(statusPokemon, "erro", "Falha na conexão. Tente novamente.");
    console.error("Erro na busca do Pokémon:", erro.message);
  } finally {
    botaoPokemon.disabled = false;
  }
});
