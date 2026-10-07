# Campo Grande às Claras

Observatório cidadão independente, com acesso livre, para acompanhar contratos, obras e ações municipais de Campo Grande, MS.

## Versão inicial

- 8 obras selecionadas e 2 propostas legislativas de 2026.
- 106 registros do arquivo oficial de contratos municipais. Datas de início até 14/05/2026; não cobre o ano inteiro.
- Diretório da prefeita e dos 29 vereadores da composição de posse de janeiro de 2025. Não consolida suplências, licenças ou mudanças posteriores.
- Busca por bairro, tipo, objeto, empresa e representante; URLs reproduzíveis dos filtros.
- Fichas, documentos oficiais, lacunas, pedidos de informação e salvos locais.
- Download do CSV original, dados estruturados e hash de integridade.

Não há classificação de políticos, denúncia automática, pagamento tratado como contrato, prazo contado sem início documentado ou dado ausente tratado como zero. A atribuição de uma obra ao Executivo não representa mérito pessoal ou autoria exclusiva.

## Executar

Requer Node.js 22+ e Python 3. O produto não usa bibliotecas externas no navegador.

```sh
npm ci
npm run build
npm test
npm run test:browser
npm run dev
```

O site abre em http://localhost:4173. Os testes de navegador usam o Google Chrome instalado. `npm run build` importa o CSV local, valida os dados e gera `dist/` sem rede.

## Fontes e edição

- `data/sources.json`: referências, tipos de evidência, conferência e limites.
- `data/actions.json`: curadoria de ações e propostas.
- `data/people.json`: diretório histórico e contexto da vinculação.
- `data/raw/contratos-2026.csv`: cópia original do arquivo público municipal.
- `data/contracts.json`: importação em centavos, sem valores pagos inventados.
- `data/meta.json`: data da revisão editorial, não a data do build.

`npm run check:sources` verifica disponibilidade e compara o hash do CSV remoto. Ele não altera a base nem publica conclusões. A fonte pode responder com desafio de acesso; isso é registrado como limitação, sem tentar contorná-lo.

Para atualizar: conferir o documento, editar os registros e a cobertura, revisar o conteúdo, executar build e testes, registrar o motivo da mudança em `CHANGELOG.md` e gerar o pacote estático. Não atualizar `reviewedOn` apenas porque houve uma coleta técnica.

## Publicação na DigitalOcean

Este projeto utiliza um aplicativo estático em projeto próprio, separado do FisIA. Não depende de sua aplicação, servidor, banco, domínio ou credenciais.

```sh
npm run build
npm test
node scripts/prepare-deploy.mjs
```

A pasta `site/` é a saída estática versionada para hospedagem. Configure o componente como **Static Site / HTML**, diretório `/site`, documento inicial `index.html`, erro `404.html`, sem banco e sem serviço de aplicação. A especificação está em `.do/app.yaml`.

Verifique o resumo de custo **US$ 0/mês** antes de criar. A franquia gratuita tem limites de transferência e pode haver excedentes. O nome do projeto não cria isolamento de faturamento: os recursos pertencem à mesma conta, mas usam aplicativo e dados separados.

## Correções

Abra uma issue identificando página, trecho, correção proposta e documento oficial. Não inclua dados pessoais sensíveis. A resposta do órgão ou representante deve ser anexada ao registro correspondente com data e fonte.

## Expansão

1. Consolidar exercício atual dos representantes e cobertura legislativa municipal.
2. Vincular extratos, ordens de execução, medições, pagamentos e recebimentos às obras.
3. Acrescentar histórico verificado de compromissos, com declaração e prazo original.
4. Incorporar ALEMS e Câmara federal como conjuntos separados, preservando cargo, período e competências.

A versão piloto ainda não oferece recebimento de denúncias, cadastro, notificações, atualização automática de conclusões ou acompanhamento de protocolos.

## Publicação inicial

- Site: https://campo-grande-as-claras-k8cpf.ondigitalocean.app
- DigitalOcean App ID: `2a99833a-b1f7-4108-9d90-217860b104e0`
- Projeto: Campo Grande às Claras (`ebac61b9-1985-4cbf-bf59-8769e68417f2`).
- Componente Static Site, sem servidor ou banco, custo de infraestrutura indicado no painel: US$ 0/mês dentro da franquia. A conta e cobrança continuam compartilhadas com a equipe existente; recursos e aplicativo separados do FisIA.
- Fonte pública via Git: após revisar os dados, executar build e prepare-deploy, fazer commit/push e usar Deploy no painel deste aplicativo. Não há atualização automática de dados ou deploy por webhook nesta configuração.
- Correções: https://github.com/filipeabdallaceo/campo-grande-as-claras/issues/new
