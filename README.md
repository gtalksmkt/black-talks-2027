# Black Talks 2026

Landing da Black Friday do Grupo Talks. Não divulga data nem tem contador, mas **encerra sozinha em 30/11/2026, às 23h59**
(horário de Brasília; veja "Como a página se comporta"). Quem faz um cadastro rápido no presente
ganha 2 cupons: **50% OFF em qualquer curso virtual** (`BLACK50`) e o **Atualiza Talks ME com o 1º mês
por R$ 9,90** (`ATUALIZA990`).

**Sem roleta desde 19/11/2026**: a seção, o banner do carrossel, o passo "Gire a roleta", a pergunta do FAQ, o
`roleta.html` e o `js/roleta.js` saíram desta landing. O projeto da roleta continua em
`gtalksmkt/black-talks-2027-roleta`, mas nada aqui aponta mais para ele.

## No site

| Projeto | Repositório | Endereço no site |
|---|---|---|
| Landing da Black | **gtalksmkt/black-talks-2027** (este) | https://emergencytalks.com.br/blacktalks/ |

- `index.html` na raiz, com `img/` ao lado.
- **Formulário do presente** (`#prForm`): `<form>` com botão `type="submit"`, campos com `name` (`nome`, `email`,
  `tel`) e o campo oculto `etapa=cadastro`. A plataforma captura o envio antes do `preventDefault()` do nosso JS.
- `window.__lpLoadedAt` é gravado no `<head>` (anti-spam da plataforma).
- **Não colar GTM nem Meta Pixel no HTML**: a plataforma injeta os containers e remove snippets fixos.

Prévia no GitHub Pages: https://gtalksmkt.github.io/black-talks-2027/

## O caminho de quem chega

1. **Presente** (`#presente`, logo depois do topo): mostra os 2 cupons bloqueados. A pessoa deixa nome,
   e-mail e WhatsApp, autoriza o contato e os cupons aparecem na hora, com confete.
   - O pop-up do presente aparece depois de 8 segundos (1 vez por visita) e leva para essa seção.
   - Se a pessoa fecha o pop-up, fica o botão "Garanta seu presente" no canto da tela, que também leva para lá.
   - Link direto para anúncios e posts: `https://emergencytalks.com.br/blacktalks/#presente`
2. **Cursos virtuais**: o botão "Comprar com 50% OFF" coloca o curso no carrinho do site da Emergency
   Talks (`/carrinho/?add-to-cart=ID`) e copia o cupom. Quem ainda não pegou os cupons vai antes para o
   cadastro e, depois dele, ganha o botão "Continuar" com o curso que tinha escolhido.
3. **Atualiza Talks ME**: os botões vermelhos do R$ 9,90 abrem direto a página de inscrição do Atualiza (`ATUALIZA.inscricao` = https://emergencytalks.com.br/produto/atualiza-talks/#inscricao, em nova aba). Não precisa de cupom nem de cadastro antes: o 1º mês por R$ 9,90 já vem aplicado lá. O `ATUALIZA990` do presente é só ilustrativo.

## O que precisa existir fora do site

- **WooCommerce** (emergencytalks.com.br): criar o cupom `BLACK50`, 50% de desconto, válido para os
  4 cursos virtuais, enquanto a Black estiver no ar. Em 07/11 ele ainda não existia.
- **Central / time comercial**: aceitar o cupom `ATUALIZA990` (1º mês do Atualiza Talks ME por R$ 9,90)
  (hoje o botão do Atualiza já leva à inscrição com o valor aplicado).
- **Planilha**: o Apps Script na versão 2 está no ar desde 09/11 (abrir o endereço /exec mostra `"versao": 2`).

## Onde mudar as coisas

Tudo fica no começo do `<script>` do `index.html`:

- `BLACK`: início (vazio = já no ar) e fim (30/11/2026 23h59; nenhuma data aparece no site), cupom dos
  cursos, % de desconto, segundos até o pop-up do presente, WhatsApp da central e mensagens
- `CURSOS`: nome, banner, preço cheio, descrição e link do carrinho de cada curso (o preço com desconto
  é calculado sozinho)
- `ATUALIZA`: preço do 1º mês, cupom, valor depois do 1º mês (`mensal`, R$ 299,90) e para residentes
  (`residente`, R$ 199,90), link da landing e posição do banner no carrossel. O valor depois do 1º mês
  aparece só no site, em letras miúdas ao lado do R$ 9,90; as artes falam só do 1º mês.

Trocar o nome de um cupom é só mudar ali: todos os textos da página acompanham.

## Como a página se comporta

- **No ar**: sem data e sem contador em lugar nenhum (barra do topo, hero e final da página).
- **Encerramento automático**: em 30/11/2026, 23h59, a página passa sozinha para o aviso de encerrada, preços cheios, sem presente. Para mudar o dia, troque `fim` em `BLACK` (index.html), por exemplo `'2026-12-01T00:00:00-03:00'`, e publique.
- Os cupons ficam salvos no aparelho da pessoa: ao voltar, ela já vê os códigos.

Para ver cada fase antes da hora: `?preview=pre`, `?preview=live` ou `?preview=fim` no fim do link.

## Planilha de cadastros

O formulário do presente manda para o Apps Script (endereço em `LEADS_URL`, logo depois de `ATUALIZA` no
`index.html`), na planilha "Roleta Black Talks · cadastros" (Drive da conta yuriyvvieira@gmail.com), aba **Presente**:
data, nome, e-mail, WhatsApp, autorização de contato, o que a pessoa queria comprar e a página de origem.
O mesmo e-mail ou WhatsApp entra uma vez só. Para testar de novo no mesmo navegador, use uma janela anônima.

## Imagens de compartilhamento

`img/og-black-talks.jpg` é gerada a partir de `fontes/og.html` com
`fontes/gerar-og.ps1` (Edge em modo headless). Mudou preço ou texto? Edite o HTML e rode o script.

## Foto do Atualiza Talks ME

`img/atualiza-corredor.webp` (corredor de emergência em vermelho) vai por trás de tudo que fala do Atualiza:
banner do Atualiza no carrossel do topo, seção `#atualiza`, cupom do Atualiza no presente e no pop-up,
e as imagens de compartilhamento. No `index.html` ela entra pela variável
CSS `--foto-at` (no `:root`): para trocar a foto, substitua o arquivo ou mude a variável.
