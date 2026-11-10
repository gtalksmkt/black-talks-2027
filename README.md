# Black Talks 2026

Landing da Black Friday do Grupo Talks. **Desde 10/11/2026 não divulga data nem tem contador**: está no ar
até alguém encerrar (veja "Como a página se comporta"). Quem faz um cadastro rápido no presente
ganha 2 cupons: **50% OFF em qualquer curso virtual** (`BLACK50`) e o **Atualiza Talks ME com o 1º mês
por R$ 9,90** (`ATUALIZA990`). Quem compra tem direito a girar a roleta.

No ar: https://gtalksmkt.github.io/black-talks-2027/

## O caminho de quem chega

1. **Presente** (`#presente`, logo depois do topo): mostra os 2 cupons bloqueados. A pessoa deixa nome,
   e-mail e WhatsApp, autoriza o contato e os cupons aparecem na hora, com confete.
   - O pop-up do presente aparece depois de 8 segundos (1 vez por visita) e leva para essa seção.
   - Se a pessoa fecha o pop-up, fica o botão "Garanta seu presente" no canto da tela, que também leva para lá.
   - Link direto para anúncios e posts: `https://gtalksmkt.github.io/black-talks-2027/#presente`
2. **Cursos virtuais**: o botão "Comprar com 50% OFF" coloca o curso no carrinho do site da Emergency
   Talks (`/carrinho/?add-to-cart=ID`) e copia o cupom. Quem ainda não pegou os cupons vai antes para o
   cadastro e, depois dele, ganha o botão "Continuar" com o curso que tinha escolhido.
3. **Atualiza Talks ME**: o botão abre o WhatsApp da central com o cupom `ATUALIZA990` na mensagem.
4. **Roleta** (`roleta.html`): só para quem comprou. A pessoa entra com nome, e-mail da compra, WhatsApp
   e **número do pedido** (está no e-mail de confirmação do WooCommerce), gira uma vez e ganha de
   1 aula de degustação a 6 meses grátis do Atualiza Talks ME. Para resgatar, chama o time comercial no
   WhatsApp com o código do prêmio e o número do pedido: **o time confere o pedido antes de liberar**.
   - Para mandar a roleta para quem comprou, já com o pedido preenchido:
     `https://gtalksmkt.github.io/black-talks-2027/roleta.html?pedido=NÚMERO`

## O que precisa existir fora do site

- **WooCommerce** (emergencytalks.com.br): criar o cupom `BLACK50`, 50% de desconto, válido para os
  4 cursos virtuais, enquanto a Black estiver no ar. Em 07/11 ele ainda não existia.
- **Central / time comercial**: aceitar o cupom `ATUALIZA990` (1º mês do Atualiza Talks ME por R$ 9,90)
  e conferir o pedido antes de entregar o prêmio da roleta.
- **Planilha**: o Apps Script na versão 2 está no ar desde 09/11 (abrir o endereço /exec mostra `"versao": 2`).

## Onde mudar as coisas

Tudo fica no começo do `<script>` do `index.html`:

- `BLACK`: início e fim (vazios = no ar e sem data para acabar; nenhuma data aparece no site), cupom dos
  cursos, % de desconto, segundos até o pop-up do presente, WhatsApp da central e mensagens
- `CURSOS`: nome, banner, preço cheio, descrição e link do carrinho de cada curso (o preço com desconto
  é calculado sozinho)
- `ATUALIZA`: preço do 1º mês, cupom, valor depois do 1º mês (`mensal`, R$ 299,90) e para residentes
  (`residente`, R$ 199,90), link da landing e posição do banner no carrossel. O valor depois do 1º mês
  aparece só no site, em letras miúdas ao lado do R$ 9,90; as artes falam só do 1º mês.

Trocar o nome de um cupom é só mudar ali: todos os textos da página acompanham.

## Como a página se comporta

- **No ar** (desde 10/11/2026): sem data e sem contador em lugar nenhum (barra do topo, hero e final da página).
- **Para encerrar**: preencha `fim` em `BLACK` (index.html) e em `ROLETA` (js/roleta.js) com data e hora, por
  exemplo `'2026-12-01T00:00:00-03:00'`, e publique. Dali em diante aparece o aviso de encerrada, preços
  cheios, sem presente e sem roleta.
- Os cupons ficam salvos no aparelho da pessoa: ao voltar, ela já vê os códigos.

Para ver cada fase antes da hora: `?preview=pre`, `?preview=live` ou `?preview=fim` no fim do link.

## Planilha de cadastros

Os dois formulários mandam para o mesmo Apps Script (endereço em `js/roleta.js`, campo `leadsUrl`),
na planilha "Roleta Black Talks · cadastros" (Drive da conta yuriyvvieira@gmail.com):

- aba **Presente**: data, nome, e-mail, WhatsApp, autorização de contato, o que a pessoa queria comprar
  e a página de origem. O mesmo e-mail ou WhatsApp entra uma vez só.
- aba **Roleta**: data, nome, e-mail, WhatsApp, prêmio, código do prêmio, "Resgatado" (para o time
  comercial marcar), pedido. O mesmo e-mail, WhatsApp ou pedido não gira de novo.

Prêmios e fatias da roleta ficam em `js/roleta.js` (`ROLETA`, `PREMIOS`, `FATIAS`). Cada fatia tem a
mesma chance; o prêmio de 6 meses tem uma fatia só. Para testar de novo no mesmo navegador, use uma
janela anônima.

## Imagens de compartilhamento

`img/og-black-talks.jpg` e `img/og-roleta.jpg` são geradas a partir de `fontes/og.html` com
`fontes/gerar-og.ps1` (Edge em modo headless). Mudou preço ou texto? Edite o HTML e rode o script.

## Foto do Atualiza Talks ME

`img/atualiza-corredor.webp` (corredor de emergência em vermelho) vai por trás de tudo que fala do Atualiza:
banner do Atualiza e da roleta no carrossel do topo, seção `#atualiza`, cupom do Atualiza no presente e no pop-up,
seção da roleta, topo do `roleta.html` e as imagens de compartilhamento. No `index.html` ela entra pela variável
CSS `--foto-at` (no `:root`): para trocar a foto, substitua o arquivo ou mude a variável.
