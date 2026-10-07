import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadData, validate } from '../scripts/validate.mjs';
const data = await loadData();
test('Todas as referências financeiras e editoriais são consistentes',()=>assert.equal(validate(data),true));
test('Valor exato do primeiro contrato preserva centavos',()=>{
  const c=data.contracts.contracts.find(c=>c.id==='209651');
  assert.equal(c.valueCents,470267371); assert.equal(c.paidCents,null);
});
test('Arquivo oficial e JSON têm a mesma integridade',async()=>{
  const bytes=await readFile(new URL('../data/raw/contratos-2026.csv',import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),data.contracts.sha256);
  assert.equal(data.contracts.contracts.length,106);
  assert.equal(data.contracts.latestStartDate,'2026-05-14');
});
test('Prazo condicionado não vira prazo vencido sem início documentado',()=>{
  for(const a of data.actions.filter(a=>a.type==='Obra')) assert.equal(a.deadlineStart,null);
  assert.equal(data.actions.find(a=>a.id==='convive').deadlineDays,360);
  assert.equal(data.actions.find(a=>a.id==='convive').valueCents,1365045678);
});
test('Propostas não aparecem como leis vigentes ou obras entregues',()=>{
  for(const a of data.actions.filter(a=>a.type==='Proposta')) {assert.equal(a.statusKey,'proposta');assert.equal(a.valueCents,null);}
  assert.equal(data.actions.some(a=>a.stage===3),false);
});
test('Diretório municipal preserva a referência histórica e não inventa produtividade',()=>{
  assert.equal(data.people.length,30);
  assert.equal(data.people.filter(p=>p.branch==='Legislativo').length,29);
  for(const p of data.people) {assert.equal(p.referenceDate,'2025-01-01');assert.equal('score' in p,false);}
});
test('Todas as páginas e links internos gerados existem',async()=>{
  const routes=JSON.parse(await readFile(new URL('../dist/routes.json',import.meta.url),'utf8'));
  let links=0;
  for(const route of routes) {
    const file=new URL('../dist'+(route==='/'?'/index.html':route+'index.html'),import.meta.url);
    const html=await readFile(file,'utf8');
    assert.match(html,/<html lang="pt-BR">/);
    assert.match(html,/<main id="conteudo"[^>]*>/);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      const link=match[1].split(/[?#]/)[0];
      const target=new URL('../dist'+link+(link.endsWith('/')?'index.html':''),import.meta.url);
      assert.ok((await stat(target)).isFile(),`${route}: ${link}`); links++;
    }
  }
  assert.ok(links>1000);
});
