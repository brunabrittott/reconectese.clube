(() => {
 'use strict';
 const config = window.RECONECTE_CONFIG || {};
 const root = document.querySelector('#reconecte-page');
 const dialog = root.querySelector('#info-dialog');
 function inform(title, text) {
  root.querySelector('#dialog-title').textContent = title;
  root.querySelector('#dialog-copy').textContent = text;
  dialog.showModal();
 }
 root.querySelectorAll('.close-dialog').forEach(b => b.addEventListener('click', () => dialog.close()));
 dialog.addEventListener('click', e => { if(e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
 const validURL = url => { try {return new URL(url).protocol === 'https:';} catch {return false;} };
 root.querySelectorAll('.community-link').forEach(a => {
  if(validURL(config.communityUrl)) { a.href=config.communityUrl;a.target='_blank';a.rel='noopener noreferrer'; }
  else a.addEventListener('click', e => {e.preventDefault();inform('Vamos continuar próximas?', 'O link da comunidade ainda não está disponível nesta página. Você pode cadastrar seu interesse em novidades da comunidade ou falar com @reconectese.clube no Instagram.');});
 });
 root.querySelectorAll('.privacy-link').forEach(a => {
  if(validURL(config.privacyUrl)) {a.href=config.privacyUrl;a.target='_blank';a.rel='noopener noreferrer';}
  else a.addEventListener('click',e=>{e.preventDefault();inform('Privacidade e seus dados','O cadastro solicita nome, WhatsApp, cidade, e-mail opcional e interesse no futuro grupo terapêutico para enviar comunicações do Reconecte-se. Nenhuma informação será enviada enquanto a integração e a política de privacidade não estiverem configuradas. Para dúvidas, fale com @reconectese.clube no Instagram.');});
 });
 if(validURL(config.contactUrl)) root.querySelectorAll('.contact-link').forEach(a=>a.href=config.contactUrl);
 root.querySelector('#therapy-interest').addEventListener('click',()=>{root.querySelector('#therapy-check').checked=true;});
 root.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>root.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
 const form=root.querySelector('#interest-form'), message=root.querySelector('#form-message');
 const phone=root.querySelector('#phone');
 phone.addEventListener('input',()=>phone.setCustomValidity(''));
 form.addEventListener('submit', async e=>{
  e.preventDefault(); message.textContent='';
  const digits=phone.value.replace(/\D/g,'');
  if(digits.length<10||digits.length>13){phone.setCustomValidity('Informe um WhatsApp válido com DDD.');phone.reportValidity();return;}
  const therapyInterest=root.querySelector('#therapy-check').checked;
  if(!validURL(config.formUrl)||!validURL(config.privacyUrl)){message.textContent='O cadastro ainda não está disponível nesta página. Nenhum dado foi enviado. Por enquanto, fale com @reconectese.clube no Instagram.';return;}
  const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Enviando…';
  try {
   // Texto simples evita preflight no Apps Script. Nunca usar no-cors: só confirmar após resposta real.
   const res=await fetch(config.formUrl,{method:'POST',body:JSON.stringify({name:form.elements.namedItem('name').value.trim(),phone:phone.value.trim(),email:form.elements.namedItem('email').value.trim(),city:form.elements.namedItem('city').value.trim(),therapyInterest,consent:form.elements.namedItem('consent').checked,website:form.elements.namedItem('website').value,source:'Landing Reconecte-se'}),redirect:'follow',signal:AbortSignal.timeout(25000)});
   if(!res.ok)throw new Error('http'); const result=await res.json();if(!result.success)throw new Error(result.error||'save');
   form.hidden=true;const success=root.querySelector('#form-success');success.hidden=false;success.focus();form.reset();
  }catch(err){message.textContent='Não foi possível confirmar o recebimento. Tente novamente em instantes ou fale com @reconectese.clube no Instagram.';}
  finally{button.disabled=false;button.textContent='Quero receber novidades ↗';}
 });
})();
