/* ==================================================================
   ROLETA BLACK TALKS · prêmios e fatias
   Usado pela roleta (/blacktalks/roleta/) e pela página principal (/blacktalks/).
   ATENÇÃO: existe uma cópia igual no repositório black-talks-2027-roleta; mude os dois juntos.

   Cada fatia da roda tem a MESMA chance de sair. Para mudar as chances,
   repita ou tire prêmios da lista FATIAS. O de 6 meses aparece uma vez só.
   Com as 12 fatias abaixo:
     1 aula de degustação  3 fatias  (25%)
     1 mês grátis          3 fatias  (25%)
     2 meses grátis        2 fatias  (16,7%)
     3, 4, 5 meses grátis  1 fatia cada (8,3% cada)
     6 meses grátis        1 fatia   (8,3%)
   ================================================================== */
var ROLETA = {
  whats: '5585998302705',   // time comercial que entrega o prêmio
  /* Endereço do Apps Script da planilha de cadastros (instruções em leads-planilha.gs).
     Enquanto estiver vazio, os dados da pessoa chegam só na mensagem de WhatsApp do resgate. */
  leadsUrl: 'https://script.google.com/macros/s/AKfycbySD1NLCA_rMPrCjmwcvqxZ3nDs--0bzZudLgcCiEXW495M4F25xEc_qXBOdMqMzuPg/exec',
  /* sem data na página, mas a roleta encerra sozinha em "fim", igual à index.html */
  inicio: '',
  fim:    '2026-11-30T23:59:59-03:00',   // mesma data da index.html
  produto: 'Atualiza Talks ME'
};

var PREMIOS = {
  aula: { curto: '1 AULA',  sub: 'degustação',    nome: '1 aula de degustação' },
  m1:   { curto: '1 MÊS',   sub: 'grátis',        nome: '1 mês grátis' },
  m2:   { curto: '2 MESES', sub: 'grátis',        nome: '2 meses grátis' },
  m3:   { curto: '3 MESES', sub: 'grátis',        nome: '3 meses grátis' },
  m4:   { curto: '4 MESES', sub: 'grátis',        nome: '4 meses grátis' },
  m5:   { curto: '5 MESES', sub: 'grátis',        nome: '5 meses grátis' },
  m6:   { curto: '6 MESES', sub: 'prêmio máximo', nome: '6 meses grátis', destaque: true }
};

/* ordem das fatias na roda, começando no topo e seguindo no sentido horário */
var FATIAS = ['m1', 'aula', 'm2', 'm6', 'aula', 'm1', 'm3', 'aula', 'm2', 'm5', 'm1', 'm4'];

/* Desenha a roda dentro de um <svg viewBox="-200 -200 400 400">.
   Devolve o <g> que gira (para a animação). */
function desenharRoleta(svg, opt){
  opt = opt || {};
  var n = FATIAS.length, ang = 360 / n, R = 180;
  function pt(a, r){ var t = a * Math.PI / 180; return (r * Math.sin(t)).toFixed(2) + ' ' + (-r * Math.cos(t)).toFixed(2); }
  var h = '<defs>' +
    '<radialGradient id="rlRed" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(180)"><stop offset=".25" stop-color="#9E0A16"/><stop offset="1" stop-color="#E8303F"/></radialGradient>' +
    '<radialGradient id="rlBlk" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(180)"><stop offset=".25" stop-color="#050505"/><stop offset="1" stop-color="#1D1D21"/></radialGradient>' +
    '<radialGradient id="rlWht" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(180)"><stop offset=".25" stop-color="#D9D9DE"/><stop offset="1" stop-color="#FFFFFF"/></radialGradient>' +
    '</defs>';
  h += '<circle r="198" fill="#0E0E10"/><circle r="197" fill="none" stroke="#D31C2B" stroke-width="3"/><circle r="182" fill="none" stroke="#000" stroke-width="5"/>';
  h += '<g class="rl-rot">';
  for(var i = 0; i < n; i++){
    var k = FATIAS[i], p = PREMIOS[k], th = i * ang;
    var fill = p.destaque ? 'url(#rlWht)' : (i % 2 ? 'url(#rlBlk)' : 'url(#rlRed)');
    h += '<path d="M0 0L' + pt(th - ang / 2, R) + 'A' + R + ' ' + R + ' 0 0 1 ' + pt(th + ang / 2, R) + 'Z" fill="' + fill + '"/>';
    h += '<line x1="0" y1="0" x2="' + pt(th - ang / 2, R).replace(' ', '" y2="') + '" stroke="rgba(255,255,255,.16)" stroke-width="1.5"/>';
    var c1 = p.destaque ? '#D31C2B' : '#FFFFFF';
    var c2 = p.destaque ? '#0A0A0B' : (i % 2 ? '#FF4D5A' : 'rgba(255,255,255,.85)');
    h += '<g transform="rotate(' + th + ') translate(0 -110) rotate(-90)">' +
           '<text text-anchor="middle" y="5" fill="' + c1 + '" style="font:900 26px \'Barlow Condensed\',Impact,sans-serif;letter-spacing:.5px">' + p.curto + '</text>' +
           '<text text-anchor="middle" y="19" fill="' + c2 + '" style="font:800 9.5px Inter,system-ui,sans-serif;letter-spacing:1px;text-transform:uppercase">' + p.sub.toUpperCase() + '</text>' +
         '</g>';
    if(p.destaque) h += '<g transform="rotate(' + th + ') translate(0 -168)"><path d="M0-7 2 -2.2 7.2-2.2 3 1 4.5 6.2 0 3.2-4.5 6.2-3 1-7.2-2.2-2-2.2Z" fill="#D31C2B"/></g>';
  }
  h += '</g>';
  if(opt.luzes !== false){
    h += '<g class="rl-luzes">';
    for(var j = 0; j < 24; j++){
      h += '<circle class="rl-l ' + (j % 2 ? 'b' : 'a') + '" r="3.8" transform="rotate(' + (j * 15) + ') translate(0 -190)"/>';
    }
    h += '</g>';
  }
  h += '<circle r="50" fill="#050505" stroke="#D31C2B" stroke-width="5"/><circle r="38" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1"/>';
  svg.innerHTML = h;
  return svg.querySelector('.rl-rot');
}

/* ------------------------------------------------------------------
   Links entre as páginas: no site são /blacktalks/ e /blacktalks/roleta/.
   Na prévia do GitHub Pages essas rotas não existem, então só lá o link
   é trocado na hora do clique pelo endereço da prévia (no site nada muda).
   ------------------------------------------------------------------ */
var PREVIAS_BLACK = {
  '/blacktalks/roleta/': 'https://gtalksmkt.github.io/black-talks-2027-roleta/',
  '/blacktalks/':        'https://gtalksmkt.github.io/black-talks-2027/'
};
if(/\.github\.io$/.test(location.hostname)){
  ['click', 'auxclick'].forEach(function(ev){
    document.addEventListener(ev, function(e){
      var a = e.target && e.target.closest && e.target.closest('a[href^="/blacktalks/"]');
      if(!a) return;
      var m = a.getAttribute('href').match(/^(\/blacktalks\/(?:roleta\/)?)(.*)$/);
      if(m) a.href = PREVIAS_BLACK[m[1]] + m[2];
    }, true);
  });
}
