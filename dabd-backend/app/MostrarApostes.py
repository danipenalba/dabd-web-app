from flask import session, jsonify
from app.connexio_db import ConnexioBD
import datetime

class MostrarApostes:
    def log(self, message: str):
        print(f"[MostrarApostes] {{{datetime.datetime.now()}}} {message}")

    def get_apostes_usuari(self) -> list[dict]:
        """
        Recupera las apuestas del usuario autenticado, formatea para el frontend.
        Muestra: 'partido', 'premisa', 'cuota', 'importe', 'estado'.
        """
        usuari_dni = session.get('usuari_dni')
        if not usuari_dni:
            return []

        db = ConnexioBD()
        try:
            self.log(f"🔍 Obteniendo apuestas para usuario {usuari_dni}...")
            query = (
                "SELECT p.local AS equip_local, p.visitant AS equip_visitant, "
                "a.premisa, a.cuota, a.import AS importe, a.estat "
                "FROM aposta a "
                "JOIN partit p ON a.partit_id = p.id "
                "WHERE a.usuari_id = %s AND a.import IS NOT NULL AND a.import > 0"
            )
            rows = db.executarConsulta(query, (usuari_dni,))
            self.log(f"✅ Encontradas {len(rows)} apuestas.")

            apuestas = []
            for row in rows:
                local = row['equip_local'] if isinstance(row, dict) else row[0]
                visitant = row['equip_visitant'] if isinstance(row, dict) else row[1]
                premisa = row['premisa'] if isinstance(row, dict) else row[2]
                cuota = row['cuota'] if isinstance(row, dict) else row[3]
                importe = row['importe'] if isinstance(row, dict) else row[4]
                estat = row['estat'] if isinstance(row, dict) else row[5]
                apuestas.append({
                    'partido': f"{local} vs {visitant}",
                    'premisa': premisa,
                    'cuota': cuota,
                    'importe': importe,
                    'estado': estat
                })
            return apuestas
        except Exception as e:
            self.log(f"❌ Error al obtener apuestas: {e}")
            return []
        finally:
            db.tancar()

