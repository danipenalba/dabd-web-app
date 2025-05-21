import datetime
from app.connexio_db import ConnexioBD

class Usuari:
    def __init__(self, dni: str, mail: str, nom: str, saldo: float = 0.0):
        self.dni = dni
        self.mail = mail
        self.nom = nom
        self.saldo = saldo

    def log(self, message):
        print(f"Usuari: [{datetime.datetime.now()}] {message}")

    # 🔹 Getters
    def getDNI(self): return self.dni
    def getMail(self): return self.mail
    def getNom(self): return self.nom
    def getSaldo(self): return self.saldo

    # 🔹 Setters
    def setDNI(self, dni): self.dni = dni
    def setMail(self, mail): self.mail = mail
    def setNom(self, nom): self.nom = nom
    def setSaldo(self, saldo): self.saldo = saldo

    # 🔹 Inserción solo en tabla `usuari` 🔹
    def insereix(self):
        db = ConnexioBD()
        try:
            self.log("🔄 Insertando usuario...")

            query = """
                INSERT INTO usuari (id_dni, mail, nom, saldo)
                VALUES (%s, %s, %s, %s)
            """
            db.executarComanda(query, (self.dni, self.mail, self.nom, self.saldo))
            self.log("✅ Usuario insertado en tabla 'usuari'.")
        except Exception as e:
            self.log(f"❌ Error al insertar: {e}")
            return False
        finally:
            db.__del__()
        return True

    # 🔹 Modificación 🔹
    def modifica(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Modificando usuario {self.dni}...")

            query = """
                UPDATE usuari
                SET mail = %s, nom = %s, saldo = %s
                WHERE id_dni = %s
            """
            db.executarComanda(query, (self.mail, self.nom, self.saldo, self.dni))
            self.log("✅ Usuario actualizado.")
        except Exception as e:
            self.log(f"❌ Error al modificar: {e}")
            return False
        finally:
            db.__del__()
        return True

    # 🔹 Eliminación 🔹
    def esborra(self):
        db = ConnexioBD()
        try:
            self.log(f"🗑️ Eliminando usuario {self.dni}...")

            query = "DELETE FROM usuari WHERE id_dni = %s"
            db.executarComanda(query, (self.dni,))
            self.log("✅ Usuario eliminado.")
        except Exception as e:
            self.log(f"❌ Error al eliminar: {e}")
            return False
        finally:
            db.__del__()
        return True
