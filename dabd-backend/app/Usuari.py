from app.connexio_db import ConnexioBD

class Usuari:
    def __init__(self, dni: str, mail: str, nom: str, saldo: float = 0.0, password: str = ""):
        self._dni = dni
        self._mail = mail
        self._nom = nom
        self._saldo = saldo
        self._password = password

    # Getters
    def getDNI(self): return self._dni
    def getMail(self): return self._mail
    def getNom(self): return self._nom
    def getSaldo(self): return self._saldo
    def getpassword(self): return self._password  # cuidado: el backend espera "getpassword" (no getPassword)

    # Setters
    def setMail(self, mail): self._mail = mail
    def setNom(self, nom): self._nom = nom
    def setSaldo(self, saldo): self._saldo = saldo
    def setPassword(self, password): self._password = password

    # Insertar nuevo usuario
    def insereix(self):
        db = ConnexioBD()
        try:
            self.log("🔄 Insertando usuario...")
            query = """
                INSERT INTO usuari (id_dni, mail, nom, saldo, contrasenya)
                VALUES (%s, %s, %s, %s, %s)
            """
            db.executarComanda(query, (self._dni, self._mail, self._nom, self._saldo, self._password))
            self.log("✅ Usuario insertado en tabla 'usuari'.")
            return True
        except Exception as e:
            self.log(f"❌ Error al insertar: {e}")
            return False
        finally:
            db.tancar()

    # Modificar datos del usuario
    def modifica(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Modificando usuario {self._dni}...")
            query = """
                UPDATE usuari
                SET mail = %s, nom = %s, saldo = %s, contrasenya = %s
                WHERE id_dni = %s
            """
            db.executarComanda(query, (self._mail, self._nom, self._saldo, self._password, self._dni))
            self.log("✅ Usuario actualizado.")
            return True
        except Exception as e:
            self.log(f"❌ Error al modificar: {e}")
            return False
        finally:
            db.tancar()

    # Logging interno simple
    def log(self, missatge):
        print(f"[Usuari] {missatge}")
