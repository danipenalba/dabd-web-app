import datetime
from flask import request, jsonify
from app.CercadoraPartit import CercadoraPartit
from app.Partit import Partit

class ControladorPartit:
    def __init__(self):
        self.cercador = CercadoraPartit()

    def log(self, msg): print(f"CtrlPartit: [{datetime.datetime.now()}] {msg}")

    def obtenir_partits(self):
        self.log("🔎 Obtenint tots els partits...")
        partits = self.cercador.cerca_tots()
        llista = [{
            "id": p.getId(),
            "data": p.getData(),
            "local": p.getLocal(),
            "visitant": p.getVisitant(),
            "competicio_id": p.getCompeticioId()
        } for p in partits]
        return jsonify(llista), 200

    def obtenir_partit(self, id: int):
        self.log(f"🔎 Obtenint partit amb ID: {id}")
        partit = self.cercador.cerca_per_id(id)
        if not partit:
            return {"error": "Partit no trobat"}, 404

        return {
            "id": partit.getId(),
            "data": partit.getData(),
            "local": partit.getLocal(),
            "visitant": partit.getVisitant(),
            "competicio_id": partit.getCompeticioId()
        }, 200
    

    def obtenir_partits_despres_del_18_juny_2025(self):
        self.log("🔎 Obtenint partits a partir del 18 de juny de 2025")
        partits = self.cercador.cerca_partits_despres_del_18_juny_2025()
        llista = [{
            "id": p.getId(),
            "data": p.getData(),
            "local": p.getLocal(),
            "visitant": p.getVisitant(),
            "competicio_id": p.getCompeticioId()
        } for p in partits]
        return jsonify(llista), 200


