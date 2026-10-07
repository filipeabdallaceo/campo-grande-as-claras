(() => {
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const toast = message => { const el=document.querySelector('.toast'); el.textContent=message; el.hidden=false; clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>{el.hidden=true;},4000); };
  const form=document.querySelector('[data-filter-form]');
  if(form) {
    const params=new URLSearchParams(location.search);
    for(const key of ['q','place','type']) {const field=form.elements.namedItem(key); if(field && params.has(key)) field.value=params.get(key);}
    const update = () => {
      const q=normalize(form.elements.namedItem('q')?.value||'');
      const place=form.elements.namedItem('place')?.value||'';
      const kind=form.elements.namedItem('type')?.value||'';
      let count=0;
      document.querySelectorAll('[data-item]').forEach(item=>{
        const show=(!q || normalize(item.dataset.search).includes(q)) && (!place || item.dataset.place?.split('|').includes(place)) && (!kind || item.dataset.kind===kind);
        item.hidden=!show; if(show) count++;
      });
      const total=document.querySelectorAll('[data-item]').length;
      document.querySelector('[data-result-count]').textContent=`${count} de ${total} registros nesta base`;
      document.querySelector('[data-empty]').hidden=count!==0;
      const query=new URLSearchParams();
      for(const key of ['q','place','type']) {const value=form.elements.namedItem(key)?.value; if(value) query.set(key,value);}
      history.replaceState(null,'',location.pathname+(query.size?'?'+query.toString():'')+location.hash);
    };
    form.addEventListener('input',update); form.addEventListener('change',update);
    form.addEventListener('submit',event=>{event.preventDefault();update();});
    form.addEventListener('reset',()=>setTimeout(update,0));
    document.querySelector('[data-clear-filters]')?.addEventListener('click',()=>form.reset());
    update();
  }
  const storageKey='campo-grande-as-claras:salvos:v1';
  const readSaved = () => {try {const stored=JSON.parse(localStorage.getItem(storageKey)||'[]');return new Set(Array.isArray(stored)?stored.filter(v=>typeof v==='string'):[]);}catch{return new Set();}};
  const setSaved = values => { try{localStorage.setItem(storageKey,JSON.stringify([...values]));return true;}catch{toast('Não foi possível salvar neste navegador. Verifique as permissões de armazenamento.');return false;} };
  document.querySelectorAll('[data-save]').forEach(button=>{
    const render=()=>{const on=readSaved().has(button.dataset.save);button.setAttribute('aria-pressed',String(on));button.querySelector('span').textContent=on?'★':'☆';button.querySelector('[data-save-label]').textContent=on?'Salvo neste navegador':'Salvar para acompanhar';};
    button.addEventListener('click',()=>{const values=readSaved();const on=values.has(button.dataset.save);if(on) values.delete(button.dataset.save);else values.add(button.dataset.save);if(setSaved(values)){render();toast(on?'Registro removido dos salvos.':'Registro salvo neste navegador.');}});render();
  });
  const savedList=document.querySelector('[data-saved-list]');
  if(savedList) fetch('/dados/indice-salvos.json').then(r=>{if(!r.ok)throw new Error();return r.json();}).then(index=>{
    const render=()=>{savedList.replaceChildren();const saved=readSaved();const selected=index.filter(row=>saved.has(row.key));document.querySelector('[data-saved-empty]').hidden=selected.length>0;for(const row of selected){const article=document.createElement('article');article.className='saved-row';const info=document.createElement('div');const label=document.createElement('span');label.className='eyebrow';label.textContent=row.kind;const heading=document.createElement('h2');const link=document.createElement('a');link.href=row.url;link.textContent=row.title;heading.append(link);info.append(label,heading);const remove=document.createElement('button');remove.textContent='Remover dos salvos';remove.addEventListener('click',()=>{const values=readSaved();values.delete(row.key);if(setSaved(values))render();});article.append(info,remove);savedList.append(article);}};render();
  }).catch(()=>{toast('Não foi possível carregar os salvos. Tente recarregar a página.');});
  document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{
    const field=document.getElementById(button.dataset.copy);
    try{await navigator.clipboard.writeText(field.value);toast('Texto copiado. Revise antes de enviar.');}catch{field.focus();field.select();toast('Selecione e copie o texto com o comando de copiar do seu navegador.');}
  }));
  const record=document.getElementById('registro');
  if(record) {record.value=new URLSearchParams(location.search).get('registro')||'';const generate=()=>{const value=record.value.trim();if(!value){record.focus();toast('Informe um contrato, proposta ou registro cadastral.');return;}document.getElementById('pedido').value=`Ao órgão responsável,\n\nSolicito os documentos e informações atualizadas referentes a ${value}:\n\n1. Instrumento original, número do processo e unidade responsável.\n2. Situação atual, prazos e eventuais aditivos.\n3. Quando aplicável, ordens de serviço, medições, empenhos, liquidações e pagamentos.\n4. Comprovação da prestação ou entrega, caso concluída.\n\nSolicito os documentos e a data de atualização das informações.\n\nReferência: Campo Grande às Claras, base municipal piloto.`;};document.querySelector('[data-generate-request]').addEventListener('click',generate);if(record.value)generate();}
})();
