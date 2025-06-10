import datetime
from app.connexio_db import ConnexioBD
from app.Partit import Partit

class CercadoraPartit:
    def __init__(self): pass

    def log(self, msg): print(f"CercadoraPartit: [{datetime.datetime.now()}] {msg}")

    def cerca_per_id(self, id: int) -> Partit | None:
        db = ConnexioBD()
        self.log(f"🔍 Buscando partit con ID: {id}")
        res = db.executarConsulta("SELECT * FROM partit WHERE id = %s", (id,))
        db.tancar()

        if not res:
            self.log("⚠️ Partit no trobat.")
            return None

        data = res[0]
        return Partit(
            id=data["id"],
            data=data["data"],
            local=data["local"],
            visitant=data["visitant"],
            competicio_id=data["competicio_id"]
        )

    def cerca_tots(self) -> list[Partit]:
        db = ConnexioBD()
        self.log("🔍 Obteniendo todos los partits...")
        res = db.executarConsulta("SELECT * FROM partit")
        db.tancar()

        partits = []
        for data in res:
            partits.append(Partit(
                id=data["id"],
                data=data["data"],
                local=data["local"],
                visitant=data["visitant"],
                competicio_id=data["competicio_id"]
            ))

        self.log(f"✅ {len(partits)} partits encontrados.")
        return partits
