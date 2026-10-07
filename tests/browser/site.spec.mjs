import { test, expect } from '@playwright/test';
test('Busca municipal ignora acentos e combina bairro com tipo',async({page})=>{
 await page.goto('/acoes/'); await page.getByLabel('Buscar na base').fill('sao conrado');
 await expect(page.locator('[data-item]:visible')).toHaveCount(1);
 await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
 await page.getByLabel('Bairro',{exact:true}).selectOption('Guanandi II');
 await expect(page.locator('[data-item]:visible')).toHaveCount(2);
 await page.getByLabel('Tipo',{exact:true}).selectOption('Proposta');
 await expect(page.locator('[data-empty]')).toBeVisible();
});
test('Filtro do endereço é reproduzível e não injeta HTML',async({page})=>{
 await page.goto('/acoes/?place=Jardim%20Itatiaia'); await expect(page.locator('[data-item]:visible')).toHaveCount(1);
 await page.goto('/acoes/?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E');
 await expect(page.locator('[data-empty]')).toBeVisible();await expect(page.locator('img[src="x"], img[onerror]')).toHaveCount(0);
});
test('Contratos identificam valor previsto e permitem encontrar cadastro',async({page})=>{
 await page.goto('/contratos/');await page.getByLabel('Buscar contrato').fill('209651');
 await expect(page.locator('[data-item]:visible')).toHaveCount(1);
 await page.getByRole('link',{name:'Ver contrato',exact:false}).filter({visible:true}).click();
 await expect(page.getByText('R$ 4.702.673,71',{exact:true})).toBeVisible();
 await expect(page.getByText('Não disponível nesta base',{exact:true})).toBeVisible();
});
test('Salvar e remover mantém apenas registro no navegador',async({page})=>{
 await page.goto('/acoes/convive/');await page.getByRole('button',{name:'Salvar para acompanhar'}).click();
 await page.goto('/salvos/'); await expect(page.locator('.saved-row')).toHaveCount(1);
 await page.getByRole('button',{name:'Remover dos salvos'}).click(); await expect(page.locator('[data-saved-empty]')).toBeVisible();
});
test('Pedido de informação usa identificador, sem envio externo',async({page})=>{
 await page.goto('/participar/?registro=209651');await expect(page.getByLabel('Texto sugerido, editável')).toHaveValue(/209651/);
 await expect(page.getByRole('link',{name:'Abrir e-SIC municipal'})).toHaveAttribute('href','https://sic.campogrande.ms.gov.br/');
});
test('Convive não recebe data de entrega inventada',async({page})=>{
 await page.goto('/acoes/convive/');await expect(page.getByText('Sem data calculável: início não confirmado')).toBeVisible();
 await expect(page.getByText('Contrato publicado',{exact:true})).toBeVisible();
});
for(const width of [320,390,768,1440]) test(`Sem overflow e com navegação em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});
 for(const path of ['/','/acoes/','/contratos/','/representantes/','/acoes/convive/','/metodologia/']) {
  await page.goto(path);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),path).toBe(true);
  await expect(page.locator('h1')).toBeVisible();
 }
});
test('Busca da página inicial leva aos registros encontrados',async({page})=>{
 await page.goto('/');await page.getByLabel('Buscar bairro, obra ou proposta').fill('itatiaia');await page.getByRole('button',{name:'Buscar ações',exact:true}).click();await expect(page).toHaveURL(/acoes\/\?q=itatiaia/);await expect(page.locator('[data-item]:visible')).toHaveCount(1);
});
test('Menu móvel abre, permite navegar e fecha pelo teclado',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const nav=page.getByRole('navigation',{name:'Navegação principal'});await expect(nav).toBeHidden();await page.getByRole('button',{name:'Abrir menu'}).click();await expect(nav).toBeVisible();await page.keyboard.press('Escape');await expect(nav).toBeHidden();await page.getByRole('button',{name:'Abrir menu'}).click();await nav.getByRole('link',{name:'Contratos',exact:true}).click();await expect(page).toHaveURL(/\/contratos\//);
});
