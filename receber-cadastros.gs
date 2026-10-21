// Cole em Extensões > Apps Script de uma planilha nova destinada às novidades.
// Execute preparar() uma vez antes de implantar e autorize o acesso à planilha.
const TARGET_SPREADSHEET_ID = '1SUBJDwGzeayWWMZDrNiAxEn8ppxKoA5CKSJ1Y07Cx-Q';
const TAB_NAME = 'Interesses Reconecte-se';
function preparar() {
 const ss=SpreadsheetApp.openById(TARGET_SPREADSHEET_ID);
 if(!ss) throw new Error('Abra este script a partir de uma planilha.');
 PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());
 let sheet=ss.getSheetByName(TAB_NAME)||ss.insertSheet(TAB_NAME);
 if(sheet.getLastRow()===0)sheet.appendRow(['Data','Nome','WhatsApp','E-mail','Cidade','Interesse no grupo terapêutico','Consentimento','Origem']);
 sheet.setFrozenRows(1);
}
function doPost(e) {
 const lock=LockService.getScriptLock();
 try {
  const d=JSON.parse(e.postData.contents);
  if(d.website||d.consent!==true||typeof d.name!=='string'||!d.name.trim()||d.name.length>100||typeof d.phone!=='string'||!/^\d{10,13}$/.test(d.phone.replace(/\D/g,''))||typeof d.city!=='string'||!d.city.trim()||d.city.length>100||typeof d.therapyInterest!=='boolean')throw new Error('Dados inválidos.');
  if(d.email&&(typeof d.email!=='string'||d.email.length>200||!/^\S+@\S+\.\S+$/.test(d.email)))throw new Error('E-mail inválido.');
  const id=TARGET_SPREADSHEET_ID;
  if(!id)throw new Error('Execute preparar antes de publicar.');
  lock.waitLock(10000);
  const sheet=SpreadsheetApp.openById(id).getSheetByName(TAB_NAME);
  const safe=v=>"'"+String(v||'').trim(); // Evita fórmulas em campos fornecidos pelo visitante.
  sheet.appendRow([new Date(),safe(d.name),safe(d.phone),safe(d.email),safe(d.city),d.therapyInterest?'Sim':'Não','Sim — novidades conforme interesses','Landing Reconecte-se']);
  return json({success:true});
 }catch(err){return json({success:false,error:'Não foi possível registrar o cadastro.'});}
 finally{if(lock.hasLock())lock.releaseLock();}
}
function json(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
