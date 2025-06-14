from app.connexio_db import ConnexioBD
import datetime

class MostraJugadors:
    """
    Classe per obtenir els noms dels jugadors d'un equip donat.
    """

    def __init__(self):
        pass

    def log(self, missatge: str):
        print(f"[MostraJugadors] {{{datetime.datetime.now()}}} {missatge}")

    def get_jugadors_per_equip(self, equip_id: str) -> list[str]:
        """
        Retorna una llista amb només els noms dels jugadors d'un equip concret.
        
        :param equip_id: ID de l'equip (ex: 'FC Barcelona')
        :return: Llista de noms de jugadors (str)
        """
        db = ConnexioBD()
        try:
            self.log(f"🔍 Buscant jugadors per a l'equip '{equip_id}'...")
            query = "SELECT nom FROM jugador WHERE equip_id = %s"
            results = db.executarConsulta(query, (equip_id,))
            noms = [fila["nom"] for fila in results]
            self.log(f"✅ Trobats {len(noms)} jugadors.")
            return noms
        except Exception as e:
            self.log(f"❌ Error al obtenir noms de jugadors: {e}")
            return []
        finally:
            db.tancar()
