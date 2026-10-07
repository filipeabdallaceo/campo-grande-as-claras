import { readFile } from 'node:fs/promises';
export async function loadData() {
  const result = {};
  for (const name of ['meta','sources','people','actions','contracts']) result[name] = JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));
  return result;
}
export function validate(data) {
  const { sources, people, actions, contracts } = data;
  const ids = (rows, name) => { if (new Set(rows.map(r => r.id)).size !== rows.length) throw new Error(`IDs duplicados em ${name}`); };
  ids(sources,'fontes'); ids(people,'pessoas'); ids(actions,'ações'); ids(contracts.contracts,'contratos');
  const sourceIds = new Set(sources.map(s=>s.id));
  const personIds = new Set(people.map(p=>p.id));
  const reference = id => { if (!sourceIds.has(id)) throw new Error(`Fonte ausente: ${id}`); };
  for (const s of sources) { if (!s.url.startsWith('https://')) throw new Error('Fonte sem HTTPS'); if (!s.checkedOn || !s.note) throw new Error('Fonte sem cobertura'); }
  for (const p of people) reference(p.sourceId);
  for (const a of actions) {
    a.sourceIds.forEach(reference);
    for (const id of a.personIds) if (!personIds.has(id)) throw new Error(`Pessoa ausente: ${id}`);
    if (a.valueCents !== null && (!Number.isSafeInteger(a.valueCents) || a.valueCents < 0)) throw new Error('Valor inválido');
    if (a.deadlineStart !== null) throw new Error('Data de início deve ser validada editorialmente antes de habilitar contagem');
    if (!a.unknown.length || !a.known.length) throw new Error('Ação sem limites documentados');
  }
  for (const c of contracts.contracts) { reference(c.sourceId); if (!Number.isSafeInteger(c.valueCents) || c.paidCents !== null) throw new Error('Contrato com semântica financeira inválida'); }
  return true;
}
if (process.argv[1]?.endsWith('validate.mjs')) { validate(await loadData()); console.log('Dados validados: referências, valores, cobertura e prazos.'); }
