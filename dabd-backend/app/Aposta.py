from app.connexio_db import ConnexioBD
import datetime

class Aposta:
    def __init__(self, premisa: str, quota: float, usuari_dni: str, partit_id: int, estat: str = 'pendiente', amount: float = 0.0):
        self.premisa = premisa
        self.quota = quota
        self.usuari_dni = usuari_dni
        self.partit_id = partit_id
        self.estat = estat
        self.amount = amount
        self.id = None

    def log(self, message: str):
        print(f"[{self.__class__.__name__}] {{{datetime.datetime.now()}}} {message}")

    def insertar_base(self) -> bool:
        db = ConnexioBD()
        try:
            # Verificar si ya existe una apuesta con los mismos datos
            check_query = """
            SELECT id FROM aposta 
            WHERE premisa = %s AND usuari_id = %s AND partit_id = %s 
            AND estat = 'pendiente' LIMIT 1
            """
            existing = db.executarConsulta(check_query, (self.premisa, self.usuari_dni, self.partit_id))
            
            if existing:
                self.id = existing[0]['id']
                self.log(f"Apuesta base ya existe con ID {self.id}")
                return True

            query = """
            INSERT INTO aposta (premisa, cuota, estat, usuari_id, partit_id, import) 
            VALUES (%s, %s, %s, %s, %s, %s) 
            RETURNING id
            """
            result = db.executarConsulta(query, (self.premisa, self.quota, self.estat, self.usuari_dni, self.partit_id, self.amount))
            self.id = result[0]['id']
            return True
        except Exception as e:
            self.log(f"Error al insertar en aposta base: {e}")
            return False
        finally:
            db.tancar()

    def insertar_especifica(self):
        raise NotImplementedError("Este método debe ser implementado en subclases")


class ApostaSimple(Aposta):
    def insertar_especifica(self):
        db = ConnexioBD()
        try:
            # Verificar si ya existe
            check_query = "SELECT id FROM aposta_simple WHERE id = %s"
            existing = db.executarConsulta(check_query, (self.id,))
            
            if existing:
                self.log(f"Apuesta simple {self.id} ya existe, omitiendo inserción")
                return True

            query = """
            INSERT INTO aposta_simple (id, premisa, cuota, estat, usuari_id, partit_id) 
            VALUES (%s, %s, %s, %s, %s, %s)
            """
            db.executarComanda(query, (self.id, self.premisa, self.quota, self.estat, self.usuari_dni, self.partit_id))
            self.log(f"Apuesta simple insertada con ID {self.id}")
            return True
        except Exception as e:
            self.log(f"Error al insertar en aposta_simple: {e}")
            return False
        finally:
            db.tancar()


class ApostaCombinada(Aposta):
    def __init__(self, premisa: str, quota: float, usuari_dni: str, partit_id: int, estat: str, amount: float, subapostes: list):
        super().__init__(premisa, quota, usuari_dni, partit_id, estat, amount)
        self.subapostes: list[ApostaSimple] = subapostes

    def insertar_especifica(self):
        db = ConnexioBD()
        try:
            # Verificar si la combinada ya existe
            check_query = "SELECT id FROM aposta_combinada WHERE id = %s"
            existing = db.executarConsulta(check_query, (self.id,))
            
            if not existing:
                # Insertar usando ON CONFLICT DO NOTHING para evitar duplicados
                query = """
                INSERT INTO aposta_combinada (id, premisa, cuota, estat, usuari_id)
                VALUES (%s, %s, %s, %s, %s)
                
                """
                db.executarComanda(query, (self.id, self.premisa, self.quota, self.estat, self.usuari_dni))

            # Procesar cada apuesta simple
            for aposta_simple in self.subapostes:
                # Insertar base si no existe
                if not aposta_simple.id and not aposta_simple.insertar_base():
                    raise Exception(f"Error al insertar apuesta simple base {aposta_simple.premisa}")
                
                # Insertar específica si no existe
                if not aposta_simple.insertar_especifica():
                    raise Exception(f"Error al insertar apuesta simple específica {aposta_simple.premisa}")
                
                # Insertar relación con ON CONFLICT
                rel_query = """
                INSERT INTO aposta_combinada_simple (combinada_id, simple_id)
                VALUES (%s, %s)
                
                """
                db.executarComanda(rel_query, (self.id, aposta_simple.id))
                self.log(f"Relacionada simple {aposta_simple.id} con combinada {self.id}")

            self.log(f"Apuesta combinada procesada correctamente con ID {self.id}")
            return True
        except Exception as e:
            self.log(f"Error al insertar apuesta combinada: {e}")
            return False
        finally:
            db.tancar()