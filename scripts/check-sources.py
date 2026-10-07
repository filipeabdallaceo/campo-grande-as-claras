"""Verifica disponibilidade e mudanças. Não altera dados nem publica conclusões."""
import hashlib,json,urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sources=json.loads((ROOT/'data/sources.json').read_text())
results=[]
for s in sources:
    try:
        req=urllib.request.Request(s['url'].split('#')[0],headers={'User-Agent':'CampoGrandeAsClaras/0.1 (source availability check)'})
        with urllib.request.urlopen(req,timeout=25) as r:
            content=r.read()
            result={'id':s['id'],'status':r.status,'bytes':len(content),'sha256':hashlib.sha256(content).hexdigest()}
            if s['id']=='contratos-csv-2026':
                result['changed']=result['sha256']!=json.loads((ROOT/'data/contracts.json').read_text())['sha256']
                if result['changed']: result['action']='Revisar arquivo e cobertura antes de substituir a base.'
            if 'camara.ms.gov.br/wp-content' in s['url'] and not content.startswith(b'%PDF'):
                result['warning']='A fonte não retornou PDF. Pode haver indisponibilidade ou desafio de acesso.'
    except Exception as err: result={'id':s['id'],'error':str(err)}
    results.append(result)
    print(json.dumps(result,ensure_ascii=False))
