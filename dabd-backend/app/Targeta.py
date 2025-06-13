import datetime
from app.connexio_db import ConnexioBD

class Targeta:
    def __init__(self, id_num_targ: int, data_cad: str, cvc: int, usuari_id: str):
        self.id_num_targ = id_num_targ
        self.data_cad = data_cad
        self.cvc = cvc
        self.usuari_id = usuari_id

    def log(self, message):
        print(f"Targeta: [{datetime.datetime.now()}] {message}")

    def insereix(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Insertant targeta per usuari {self.usuari_id}...")

            query = """
                INSERT INTO targeta (id_num_targ, data_cad, cvc, usuari_id)
                VALUES (%s, %s, %s, %s)
            """
            db.executarComanda(query, (self.id_num_targ, self.data_cad, self.cvc, self.usuari_id))
            self.log("✅ Targeta inserida correctament.")
            return True
        except Exception as e:
            self.log(f"❌ Error al inserir: {e}")
            return False
        finally:
            db.tancar()

    def modifica(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Modificant targeta per usuari {self.usuari_id}...")

            query = """
                UPDATE targeta
                SET data_cad = %s, cvc = %s
                WHERE id_num_targ = %s AND usuari_id = %s
            """
            db.executarComanda(query, (self.data_cad, self.cvc, self.id_num_targ, self.usuari_id))
            self.log("✅ Targeta actualitzada correctament.")
        except Exception as e:
            self.log(f"❌ Error al modificar: {e}")
            return False
        finally:
            db.tancar()
        return True

    @staticmethod
    def obtenir_per_usuari(dni):
        db = ConnexioBD()
        try:
            sql = "SELECT * FROM targeta WHERE usuari_id = %s"
            result = db.executarConsulta(sql, (dni,))
            if result:
                data = result[0]
                return Targeta(
                    id_num_targ=data["id_num_targ"],
                    data_cad=data["data_cad"],
                    cvc=data["cvc"],
                    usuari_id=data["usuari_id"]
                )
        finally:
            db.tancar()
        return None
