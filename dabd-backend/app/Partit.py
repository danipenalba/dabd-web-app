import datetime
from app.connexio_db import ConnexioBD

class Partit:
    def __init__(self, id: int, data: str, local: str, visitant: str, competicio_id: str):
        self.id = id
        self.data = data
        self.local = local
        self.visitant = visitant
        self.competicio_id = competicio_id

    def log(self, msg): print(f"Partit: [{datetime.datetime.now()}] {msg}")

    def getId(self): return self.id
    def getData(self): return self.data
    def getLocal(self): return self.local
    def getVisitant(self): return self.visitant
    def getCompeticioId(self): return self.competicio_id

    def setData(self, data): self.data = data
    def setLocal(self, local): self.local = local
    def setVisitant(self, visitant): self.visitant = visitant
    def setCompeticioId(self, competicio_id): self.competicio_id = competicio_id

    def insereix(self):
        db = ConnexioBD()
        try:
            self.log("🔄 Insertando partit...")
            query = """
                INSERT INTO partit (data, local, visitant, competicio_id)
                VALUES (%s, %s, %s, %s)
            """
            db.executarComanda(query, (self.data, self.local, self.visitant, self.competicio_id))
            self.log("✅ Partit insertado correctamente.")
        except Exception as e:
            self.log(f"❌ Error insertando partit: {e}")
            return False
        finally:
            db.tancar()
        return True

    def modifica(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Modificando partit {self.id}...")
            query = """
                UPDATE partit
                SET data = %s, local = %s, visitant = %s, competicio_id = %s
                WHERE id = %s
            """
            db.executarComanda(query, (self.data, self.local, self.visitant, self.competicio_id, self.id))
            self.log("✅ Partit modificado.")
        except Exception as e:
            self.log(f"❌ Error modificando: {e}")
            return False
        finally:
            db.tancar()
        return True

    def esborra(self):
        db = ConnexioBD()
        try:
            self.log(f"🗑️ Eliminando partit {self.id}...")
            query = "DELETE FROM partit WHERE id = %s"
            db.executarComanda(query, (self.id,))
            self.log("✅ Partit eliminado.")
        except Exception as e:
            self.log(f"❌ Error eliminando: {e}")
            return False
        finally:
            db.tancar()
        return True
