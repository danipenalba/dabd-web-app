from app.connexio_db import ConnexioBD
import datetime

class MostraEquips:
    """
    Classe per obtenir els noms dels equips d'una competició.
    """

    def __init__(self):
        pass

    def log(self, missatge: str):
        print(f"[MostraEquips] {{{datetime.datetime.now()}}} {missatge}")

    def get_equips_per_competicio(self, competicio_id: str) -> list[str]:
        """
        Retorna una llista amb només els noms dels equips d'una competició.
        
        :param competicio_id: ID de la competició (ex: 'liga_es')
        :return: Llista de noms d'equips (str)
        """
        db = ConnexioBD()
        try:
            self.log(f"🔍 Buscant equips per a la competició '{competicio_id}'...")
            query = (
                "SELECT e.nom FROM equip e "
                "JOIN equip_competicio ec ON e.id = ec.equip_id "
                "WHERE ec.competicio_id = %s"
            )
            results = db.executarConsulta(query, (competicio_id,))
            noms = [row['nom'] for row in results]
            self.log(f"✅ Trobats {len(noms)} equips.")
            return noms
        except Exception as e:
            self.log(f"❌ Error al obtenir noms d'equips: {e}")
            return []
        finally:
            db.tancar()
