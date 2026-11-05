/* ==================================================================
   ROLETA BLACK TALKS · planilha de cadastros (Google Apps Script)

   Como ligar (5 minutos, uma vez só):
   1. Crie uma planilha no Google Planilhas (ex.: "Roleta Black Talks").
   2. Menu Extensões > Apps Script. Apague o que estiver lá e cole este arquivo inteiro.
   3. Clique em Implantar > Nova implantação > tipo "App da Web".
      - Executar como: Eu
      - Quem pode acessar: Qualquer pessoa
   4. Autorize com a conta Google do Grupo Talks e copie o "URL do app da Web"
      (termina em /exec).
   5. Cole esse endereço em js/roleta.js, no campo leadsUrl, e publique o site.

   A partir daí, cada cadastro vira uma linha na aba "Roleta", e o mesmo e-mail
   ou WhatsApp não consegue girar de novo em outro celular ou computador.
   A coluna "Resgatado" fica para o time comercial marcar quem já pegou o prêmio.
   ================================================================== */

var ABA = 'Roleta';
var COLUNAS = ['Data', 'Nome', 'E-mail', 'WhatsApp', 'Prêmio', 'Código do prêmio', 'Resgatado', 'Chave', 'Origem'];

function aba_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ABA);
  if(!sh){
    sh = ss.insertSheet(ABA);
    sh.appendRow(COLUNAS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
  }
  return sh;
}

function json_(o){
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function soDigitos_(s){ return String(s || '').replace(/\D/g, ''); }

function procurar_(sh, email, tel){
  var linhas = sh.getDataRange().getValues();
  for(var i = 1; i < linhas.length; i++){
    var e = String(linhas[i][2] || '').trim().toLowerCase();
    var t = soDigitos_(linhas[i][3]);
    if((email && e === email) || (tel && t === tel)){
      return { premio: linhas[i][7], premioNome: linhas[i][4], codigo: linhas[i][5] };
    }
  }
  return null;
}

function doPost(e){
  var d = {};
  try{ d = JSON.parse(e.postData.contents || '{}'); }catch(err){ return json_({ erro: 'dados' }); }
  var email = String(d.email || '').trim().toLowerCase().slice(0, 120);
  var tel = soDigitos_(d.telefone).slice(0, 13);
  if(!email && !tel) return json_({ erro: 'dados' });

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try{
    var sh = aba_();
    var achou = procurar_(sh, email, tel);

    if(d.acao === 'verificar'){
      return json_(achou ? { jaGirou: true, premio: achou.premio, codigo: achou.codigo } : { ok: true });
    }

    if(d.acao === 'registrar'){
      if(achou) return json_({ jaGirou: true, premio: achou.premio, codigo: achou.codigo });
      sh.appendRow([
        new Date(),
        String(d.nome || '').slice(0, 80),
        email,
        "'" + tel,                      // apóstrofo: a planilha guarda o número como texto
        String(d.premioNome || '').slice(0, 60),
        String(d.codigo || '').slice(0, 20),
        '',
        String(d.premio || '').slice(0, 10),
        String(d.origem || '').slice(0, 200)
      ]);
      return json_({ ok: true });
    }

    return json_({ erro: 'acao' });
  }finally{
    lock.releaseLock();
  }
}

/* Abrir o endereço /exec no navegador só mostra que está funcionando */
function doGet(){ return json_({ ok: true, roleta: 'Black Talks' }); }
