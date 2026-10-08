# Semana 05 - Objetos, Dados e Assincronismo

## Sobre o projeto

Nesta atividade fiz uma página em JavaScript com três partes: análise de pedidos, buscador de CEP e uma Mini Pokédex. A ideia foi praticar objetos, arrays, funções assíncronas e a mudança de informações na página usando o DOM.

## Arquivos

- **index.html**: contém os campos, os botões e os lugares onde os resultados aparecem.
- **app.js**: tem os pedidos de exemplo, as validações, as buscas nas APIs e os eventos dos formulários.

## Como executar

1. Deixar `index.html` e `app.js` na mesma pasta.
2. Abrir `index.html` no Chrome ou no Opera.
3. Pressionar **F12** e selecionar a aba **Console**.
4. Testar os campos do CEP e do Pokémon na página.

As buscas precisam de internet. Se o navegador bloquear a execução do arquivo local, posso iniciar um servidor simples na pasta usando `python -m http.server 8000` e abrir `http://localhost:8000/`.

## Parte 1 - Análise de pedidos

Criei um array chamado `pedidos`. Cada objeto tem `cliente`, `valor` e `status`.

Primeiro usei `filter()` para separar os pedidos com nome preenchido e valor numérico maior que zero. Depois utilizei outro `filter()` para pegar somente os pedidos com status `pago`.

Usei `reduce()` para somar os valores dos pedidos pagos e `map()` para montar os textos com os nomes e os valores. Com `toFixed(2)`, os preços ficam com duas casas decimais.

Exemplo do que aparece no Console:

```text
===== PARTE 1 - ANÁLISE DE PEDIDOS =====
Pedidos recebidos: 6
Pedidos válidos: 3
Pedidos pagos e válidos: 2
Total faturado: R$ 160.50
Bia — R$ 120.00
Ana — R$ 40.50
```

## Parte 2 - Buscador de CEP

No formulário, utilizo `trim()` para retirar espaços nas pontas e uma expressão regular para limpar hífen, pontos e espaços. Depois verifico se o CEP tem exatamente 8 números usando `/^\d{8}$/`.

Com `fetch()` e `async/await`, busco os dados no ViaCEP. O programa mostra rua, bairro, cidade e UF criando elementos `dt` e `dd` com `createElement()` e `textContent`.

Também fiz um array chamado `historicoCeps`, que guarda os CEPs encontrados durante o uso da página.

**Exemplos para testar:**

- `01001-000`: deve trazer os dados do endereço, quando a API estiver disponível.
- `123`: mostra que o CEP é inválido.
- Um CEP de 8 dígitos que não exista: mostra "CEP não encontrado", se a API responder com `erro`.
- Sem conexão: mostra uma mensagem de falha.

## Parte 3 - Mini Pokédex

O campo de busca recebe o nome de um Pokémon. Eu uso `trim()` para retirar espaços nas pontas e `toLowerCase()` para converter o texto para minúsculo.

A busca usa a PokéAPI. Se o Pokémon existir, aparecem nome, imagem e tipos. Se a API responder com 404, aparece a mensagem "Pokémon não encontrado".

**Exemplos para testar:**

- `pikachu`: deve trazer nome, imagem e tipo.
- `bulbasaur`: outro Pokémon conhecido para testar.
- `pokemoninventado`: deve mostrar "Pokémon não encontrado".
- Campo vazio: pede para digitar um nome.

## Os quatro estados da tela

- **Carregando:** enquanto espero a API, aparece "Buscando..." e o botão fica desabilitado.
- **Erro:** quando a conexão falha ou a API retorna um erro HTTP que não seja o 404 esperado na Pokédex, aparece um aviso.
- **Vazio:** quando o CEP ou Pokémon não é encontrado.
- **Sucesso:** os resultados aparecem na página e o aviso de status é limpo.

Usei `try/catch/finally` para tratar erros. No `finally`, o botão volta a ficar habilitado mesmo se a busca não funcionar. Também coloquei um tempo limite de 5 segundos para as requisições.

Não usei `innerHTML` para colocar os dados vindos das APIs na página. Preferi `createElement()` e `textContent` para tratar as informações como texto.

## Parte 4 - Reflexão: por que Promise.all pode ser mais rápido?

Quando uso vários `await` seguidos, uma requisição pode ter que terminar para só depois começar a próxima. Com `Promise.all`, posso iniciar várias buscas independentes ao mesmo tempo e esperar todas juntas. Assim, muitas vezes o tempo total é menor, porque as requisições acontecem ao mesmo tempo, em vez de uma depois da outra.

Exemplo:

```js
const busca1 = fetch("https://viacep.com.br/ws/01001000/json/");
const busca2 = fetch("https://pokeapi.co/api/v2/pokemon/pikachu");
const respostas = await Promise.all([busca1, busca2]);
```

**Observação:** `Promise.all` é mais útil quando uma operação não depende do resultado da outra. Se uma das promises rejeitar, o `Promise.all` também rejeita.

## APIs usadas

- [ViaCEP](https://viacep.com.br/) - consulta de endereços por CEP.
- [PokéAPI](https://pokeapi.co/docs/v2) - consulta de dados de Pokémon.

## O que aprendi

Pratiquei como validar dados antes de usá-los, receber JSON de uma API, atualizar informações da página sem recarregar e mostrar mensagens diferentes dependendo do resultado da busca.

