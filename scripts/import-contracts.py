"""Importa o arquivo oficial local. Nenhuma consulta de rede durante o build."""
import csv
import hashlib
import io
import json
from datetime import datetime
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = (ROOT / "data/raw/contratos-2026.csv").read_bytes()
rows = list(csv.DictReader(io.StringIO(raw.decode("utf-8-sig")), delimiter=";"))
expected = {"descr_tipo", "objeto", "fornecedor", "data_inicio", "data_fim", "total_contrato", "registro_cadastral", "descr_situacao"}
assert rows and set(rows[0]) == expected, "Estrutura do CSV mudou; revisar antes de importar."

def iso(s):
    return datetime.strptime(s, "%d/%m/%Y").date().isoformat()

contracts = []
for r in rows:
    value = Decimal(r["total_contrato"])
    assert value >= 0 and value * 100 == (value * 100).to_integral_value()
    contracts.append({
        "id": r["registro_cadastral"],
        "type": r["descr_tipo"],
        "object": " ".join(r["objeto"].split()),
        "supplier": " ".join(r["fornecedor"].split()),
        "startsOn": iso(r["data_inicio"]),
        "endsOn": iso(r["data_fim"]),
        "valueCents": int(value * 100),
        "sourceStatus": r["descr_situacao"],
        "sourceId": "contratos-csv-2026",
        "paidCents": None,
    })
assert len({r["id"] for r in contracts}) == len(contracts), "Registro cadastral duplicado."
contracts.sort(key=lambda r: (r["startsOn"], r["id"]), reverse=True)
result = {
    "sourceId": "contratos-csv-2026",
    "sha256": hashlib.sha256(raw).hexdigest(),
    "coverage": "Arquivo publicado pelo município em maio de 2026. Não representa todos os contratos de 2026.",
    "latestStartDate": max(r["startsOn"] for r in contracts),
    "earliestStartDate": min(r["startsOn"] for r in contracts),
    "contracts": contracts,
}
(ROOT / "data/contracts.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Importados {len(contracts)} registros únicos. Início mais recente: {result['latestStartDate']}.")
