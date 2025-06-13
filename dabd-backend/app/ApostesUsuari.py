import datetime
from app.connexio_db import ConnexioBD

class ApostesUsuari:
    """
    Clase para gestionar las apuestas de un usuario: creación y listado.
    """

    def __init__(self):
        pass

    def log(self, message: str):
        print(f"[ApostasUsuari] {{{datetime.datetime.now()}}} {message}")

    def crea_aposta(self, usuari_dni: str, partit_id: int, premisa: str, cuota: int, estat: str = 'pendiente') -> bool:
        """
        Inserta una nueva apuesta para el usuario dado.

        :param usuari_dni: DNI del usuario
        :param partit_id: ID del partido al que se apuesta
        :param premisa: Texto de la premisa/apuesta
        :param cuota: Cuota asignada a la apuesta
        :param estat: Estado inicial de la apuesta ('pendiente' por defecto)
        :return: True si la inserción fue exitosa, False en caso contrario
        """
        db = ConnexioBD()
        try:
            self.log(f"🔄 Creando apuesta para usuario {usuari_dni}: partido={partit_id}, premisa='{premisa}', cuota={cuota}, estat={estat}")
            query = (
                "INSERT INTO aposta (premisa, cuota, estat, usuari_id, partit_id) "
                "VALUES (%s, %s, %s, %s, %s)"
            )
            db.executarComanda(query, (premisa, cuota, estat, usuari_dni, partit_id))
            self.log("✅ Apuesta insertada correctamente.")
            return True
        except Exception as e:
            self.log(f"❌ Error al insertar apuesta: {e}")
            return False
        finally:
            db.tancar()

    def obtenir_apostes(self, usuari_dni: str) -> list[dict]:
        """
        Recupera todas las apuestas de un usuario, incluyendo los nombres de los equipos local y visitante.

        :param usuari_dni: DNI del usuario
        :return: Lista de diccionarios con los datos de las apuestas y equipos asociados
        """
        db = ConnexioBD()
        try:
            self.log(f"🔍 Obteniendo apuestas del usuario {usuari_dni} con detalles de partido...")
            query = (
                "SELECT a.id, a.premisa, a.cuota, a.estat, "
                "p.id AS partit_id, p.local AS equip_local, p.visitant AS equip_visitant "
                "FROM aposta a "
                "JOIN partit p ON a.partit_id = p.id "
                "WHERE a.usuari_id = %s"
            )
            results = db.executarConsulta(query, (usuari_dni,))
            self.log(f"✅ Encontradas {len(results)} apuestas con detalles.")
            return results
        except Exception as e:
            self.log(f"❌ Error al obtener apuestas: {e}")
            return []
        finally:
            db.tancar()
