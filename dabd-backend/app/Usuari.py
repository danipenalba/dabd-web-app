from app.connexio_db import ConnexioBD

class Usuari:
    def __init__(self, dni: str, mail: str, nom: str, saldo: float = 0.0, password: str = ""):
        self._dni = dni
        self._mail = mail
        self._nom = nom
        self._saldo = float(saldo) if saldo is not None else 0.0
        self._password = password

    # Getters
    def getDNI(self): return self._dni
    def getMail(self): return self._mail
    def getNom(self): return self._nom
    def getSaldo(self): return self._saldo
    def getpassword(self): return self._password  # backend espera este nombre

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
            self.log(f"Datos a insertar - DNI: {self._dni}, Mail: {self._mail}, Nombre: {self._nom}, Saldo: {self._saldo}, Password: {'*' * len(self._password) if self._password else 'None'}")
            
            if not self._dni or not self._mail or not self._nom or not self._password:
                self.log("❌ Error: campos obligatorios (dni, mail, nom, password) no pueden estar vacíos.")
                return False
            
            query = """
                INSERT INTO usuari (id_dni, mail, nom, saldo, password)
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
                SET mail = %s, nom = %s, saldo = %s, password = %s
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
    
    def elimina(self):
        db = ConnexioBD()
        try:
            self.log(f"🔄 Eliminando usuario {self._dni}...")
            
            # Verificar que el usuario existe antes de eliminar
            query_check = "SELECT id_dni FROM usuari WHERE id_dni = %s"
            result = db.executarConsulta(query_check, (self._dni,))
            if not result:
                self.log(f"❌ Usuario con DNI {self._dni} no encontrado")
                return False
                
            # Eliminar usuario
            query_delete = "DELETE FROM usuari WHERE id_dni = %s"
            db.executarComanda(query_delete, (self._dni,))
            self.log(f"✅ Usuario {self._dni} eliminado correctamente")
            return True
            
        except Exception as e:
            self.log(f"❌ Error al eliminar usuario {self._dni}: {str(e)}")
            return False
        finally:
            db.tancar()

    # Logging interno simple
    def log(self, missatge):
        print(f"[Usuari] {missatge}")
