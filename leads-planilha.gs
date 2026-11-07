/* ==================================================================
   BLACK TALKS · planilha de cadastros (Google Apps Script) · versão 2

   Recebe duas coisas do site:
   - aba "Presente": quem se cadastrou para ganhar os 2 cupons (index.html, seção #presente)
   - aba "Roleta":   quem comprou e girou a roleta (roleta.html), com o número do pedido

   Como atualizar o script que já está no ar (mantém o mesmo endereço /exec):
   1. Abra script.google.com > projeto "Roleta Black Talks".
   2. Apague o código do editor, cole este arquivo inteiro e salve (ícone de disquete).
   3. Confira se PLANILHA_ID (logo abaixo) continua com o ID da planilha
      "Roleta Black Talks · cadastros". Se estava preenchido antes, copie o mesmo valor.
   4. Implantar > Gerenciar implantações > lápis (editar) > Versão: "Nova versão" > Implantar.
      Importante: é "Gerenciar implantações", e não "Nova implantação", para o endereço
      continuar o mesmo que está em js/roleta.js (campo leadsUrl).
   5. Escolha a função "configurar" e clique em Executar: cria a aba "Presente" e
      põe o título "Pedido" na aba "Roleta".
   Para conferir: abrir o endereço /exec no navegador deve mostrar "versao": 2.

   Como criar do zero (só se a planilha se perder):
   1. Crie uma planilha no Google Planilhas. Extensões > Apps Script. Cole este arquivo.
   2. Implantar > Nova implantação > tipo "App da Web". Executar como: Eu.
      Quem pode acessar: Qualquer pessoa. Autorize (marque a caixinha das planilhas).
   3. Rode a função "configurar". Copie o "URL do app da Web" (termina em /exec)
      para js/roleta.js, no campo leadsUrl, e publique o site.

   A planilha em uso na Black Talks 2026 é "Roleta Black Talks · cadastros", no Drive
   da conta yuriyvvieira@gmail.com (o script fica em script.google.com, projeto
   "Roleta Black Talks", com o ID da planilha preenchido em PLANILHA_ID).

   Regras:
   - Presente: o mesmo e-mail ou WhatsApp entra uma vez só (cadastros repetidos não duplicam).
   - Roleta: o mesmo e-mail, WhatsApp ou número de pedido não gira de novo em outro aparelho.
     A coluna "Resgatado" fica para o time comercial marcar quem já pegou o prêmio,
     depois de conferir o pedido no WooCommerce (ou na central).
   ================================================================== */

/* Se o script foi criado fora da planilha (em script.google.com), cole aqui o ID dela:
   o trecho do endereço entre /d/ e /edit. Vazio = usa a planilha onde o script foi criado. */
var PLANILHA_ID = '';

var ABAS = {
  roleta:   { nome: 'Roleta',   colunas: ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Prêmio', 'Código do prêmio', 'Resgatado', 'Chave', 'Origem', 'Pedido'] },
  presente: { nome: 'Presente', colunas: ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Aceita receber e-mails e mensagens', 'Interesse', 'Origem'] }
};

function aba_(tipo){
  var cfg = ABAS[tipo];
  var ss = PLANILHA_ID ? SpreadsheetApp.openById(PLANILHA_ID) : SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(cfg.nome);
  if(!sh){
    sh = ss.insertSheet(cfg.nome);
    sh.setFrozenRows(1);
  }
  /* cria ou completa a linha de títulos (a aba Roleta antiga não tinha "Pedido") */
  var tit = sh.getRange(1, 1, 1, cfg.colunas.length);
  var atual = tit.getValues()[0];
  if(atual.join('|') !== cfg.colunas.join('|')){
    tit.setValues([cfg.colunas]).setFontWeight('bold');
  }
  return sh;
}

function json_(o){
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function soDigitos_(s){ return String(s || '').replace(/\D/g, ''); }
function pedido_(s){ return String(s || '').replace(/[^0-9A-Za-z-]/g, '').toUpperCase().slice(0, 20); }

/* Roleta: procura por e-mail, WhatsApp ou pedido */
function procurarRoleta_(sh, email, tel, pedido){
  var linhas = sh.getDataRange().getValues();
  for(var i = 1; i < linhas.length; i++){
    var e = String(linhas[i][2] || '').trim().toLowerCase();
    var t = soDigitos_(linhas[i][3]);
    var p = pedido_(linhas[i][9]);
    if((email && e === email) || (tel && t === tel) || (pedido && p === pedido)){
      return { premio: linhas[i][7], premioNome: linhas[i][4], codigo: linhas[i][5] };
    }
  }
  return null;
}

/* Presente: procura por e-mail ou WhatsApp */
function procurarPresente_(sh, email, tel){
  var linhas = sh.getDataRange().getValues();
  for(var i = 1; i < linhas.length; i++){
    var e = String(linhas[i][2] || '').trim().toLowerCase();
    var t = soDigitos_(linhas[i][3]);
    if((email && e === email) || (tel && t === tel)) return true;
  }
  return false;
}

function doPost(e){
  var d = {};
  try{ d = JSON.parse(e.postData.contents || '{}'); }catch(err){ return json_({ erro: 'dados' }); }
  var email = String(d.email || '').trim().toLowerCase().slice(0, 120);
  var tel = soDigitos_(d.telefone).slice(0, 13);
  var pedido = pedido_(d.pedido);
  if(!email && !tel) return json_({ erro: 'dados' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try{
    /* ---- cadastro do presente (2 cupons) ---- */
    if(d.acao === 'presente'){
      var shp = aba_('presente');
      if(procurarPresente_(shp, email, tel)) return json_({ ok: true, repetido: true });
      shp.appendRow([
        new Date(),
        String(d.nome || '').slice(0, 80),
        email,
        "'" + tel,                      // apóstrofo: a planilha guarda o número como texto
        d.aceite ? 'Sim' : 'Não',
        String(d.interesse || '').slice(0, 40),
        String(d.origem || '').slice(0, 200)
      ]);
      return json_({ ok: true });
    }

    /* ---- roleta (só para quem comprou) ---- */
    var sh = aba_('roleta');
    var achou = procurarRoleta_(sh, email, tel, pedido);

    if(d.acao === 'verificar'){
      return json_(achou ? { jaGirou: true, premio: achou.premio, codigo: achou.codigo } : { ok: true });
    }

    if(d.acao === 'registrar'){
      if(achou) return json_({ jaGirou: true, premio: achou.premio, codigo: achou.codigo });
      sh.appendRow([
        new Date(),
        String(d.nome || '').slice(0, 80),
        email,
        "'" + tel,
        String(d.premioNome || '').slice(0, 60),
        String(d.codigo || '').slice(0, 20),
        '',
        String(d.premio || '').slice(0, 10),
        String(d.origem || '').slice(0, 200),
        "'" + pedido
      ]);
      return json_({ ok: true });
    }

    return json_({ erro: 'acao' });
  }finally{
    lock.releaseLock();
  }
}

/* Abrir o endereço /exec no navegador só mostra que está funcionando (e qual versão está no ar) */
function doGet(){ return json_({ ok: true, roleta: 'Black Talks', versao: 2 }); }

/* Rode esta uma vez pelo editor: cria/atualiza as abas Roleta e Presente com os títulos */
function configurar(){ aba_('roleta'); aba_('presente'); }
