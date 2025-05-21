import datetime
from app.connexio_db import ConnexioBD
from app.Usuari import Usuari

class CercadoraUsuari:
    def __init__(self):
        pass

    def log(self, message):
        print(f"CercadoraUsuari: [{datetime.datetime.now()}] {message}")

    def cerca_per_mail(self, email: str) -> Usuari | None:
        db = ConnexioBD()
        self.log(f"🔍 Buscando usuario con mail: {email}...")

        sql = "SELECT * FROM usuari WHERE mail = %s"
        res = db.executarConsulta(sql, (email,))

        if not res:
            self.log(f"⚠️ Usuario con mail {email} no encontrado.")
            db.tancar()
            return None

        data = res[0]
        self.log(f"✅ Usuario encontrado: {data['nom']} (DNI: {data['id_dni']})")
        db.tancar()

        return Usuari(
            dni=data["id_dni"],
            mail=data["mail"],
            nom=data["nom"],
            saldo=data["saldo"]
        )

    def cerca_per_dni(self, dni: str) -> Usuari | None:
        db = ConnexioBD()
        self.log(f"🔍 Buscando usuario con DNI: {dni}...")

        sql = "SELECT * FROM usuari WHERE id_dni = %s"
        res = db.executarConsulta(sql, (dni,))

        if not res:
            self.log(f"⚠️ Usuario con DNI {dni} no encontrado.")
            db.tancar()
            return None

        data = res[0]
        self.log(f"✅ Usuario encontrado: {data['nom']} (DNI: {data['id_dni']})")
        db.tancar()

        return Usuari(
            dni=data["id_dni"],
            mail=data["mail"],
            nom=data["nom"],
            saldo=data["saldo"]
        )

    def existeix_dni(self, dni: str) -> bool:
        db = ConnexioBD()
        self.log(f"🔍 Verificando existencia de usuario con DNI: {dni}...")

        sql = "SELECT 1 FROM usuari WHERE id_dni = %s"
        res = db.executarConsulta(sql, (dni,))
        db.tancar()

        if res:
            self.log("✅ Usuario existe.")
            return True
        else:
            self.log("❌ Usuario no existe.")
            return False

    def cerca_per_nom(self, name: str) -> list[Usuari]:
        db = ConnexioBD()
        self.log(f"🔍 Buscando usuarios con nombre: {name}...")

        sql = "SELECT * FROM usuari WHERE nom = %s"
        res = db.executarConsulta(sql, (name,))

        if not res:
            self.log(f"⚠️ No se encontraron usuarios con nombre '{name}'.")
            db.tancar()
            return []

        usuaris = []
        for data in res:
            self.log(f"✅ Usuario encontrado: {data['nom']} (DNI: {data['id_dni']})")
            usuaris.append(Usuari(
                dni=data["id_dni"],
                mail=data["mail"],
                nom=data["nom"],
                saldo=data["saldo"]
            ))

        db.tancar()
        return usuaris

    def cerca_tots(self) -> list[Usuari]:
        db = ConnexioBD()
        self.log("🔍 Obteniendo todos los usuarios...")

        sql = "SELECT * FROM usuari"
        res = db.executarConsulta(sql)

        usuaris = []
        for data in res:
            usuaris.append(Usuari(
                dni=data["id_dni"],
                mail=data["mail"],
                nom=data["nom"],
                saldo=data["saldo"]
            ))

        db.tancar()
        self.log(f"✅ Se encontraron {len(usuaris)} usuarios.")
        return usuaris
