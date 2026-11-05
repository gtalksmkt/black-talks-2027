# Black Talks 2026

Landing da Black Friday do Grupo Talks: de 23 a 30/11/2026, 30% OFF nos cursos online
(cupom `BLACKTALKS`) e o Atualiza Talks ME com o 1º mês por R$ 9,90.

No ar: https://gtalksmkt.github.io/black-talks-2027/

## Onde mudar as coisas

Tudo fica no começo do `<script>` do `index.html`:

- `BLACK`: datas de início e fim, cupom, % de desconto, horas do contador (20h), segundos até o presente aparecer, WhatsApp da central e mensagens
- `CURSOS`: nome, banner, preço cheio, descrição e links de compra de cada curso online (o preço com desconto é calculado sozinho)
- `ATUALIZA`: preço do 1º mês, data de lançamento, link da landing e posição do banner no carrossel

## Como a página se comporta

- **Antes de 23/11**: a barra mostra quanto falta para a Black começar.
- **De 23 a 30/11**: contador de 20h que recomeça para cada visitante (nunca passa do dia 30, 23h59).
- **Depois de 30/11**: aviso de encerrada, preços cheios, sem presente.
- O presente aparece depois de 8 segundos na página, uma vez por aparelho.

Para ver cada fase antes da hora: `?preview=pre`, `?preview=live` ou `?preview=fim` no fim do link.
