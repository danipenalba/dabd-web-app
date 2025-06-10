import datetime
from flask import request, jsonify, session
from app.Usuari import Usuari
from app.CercadoraUsuari import CercadoraUsuari
from app.Targeta import Targeta  # Importar


class ControladorUsuari:
    def __init__(self):
        self.cercador = CercadoraUsuari()

    def log(self, message):
        print(f"CtrlUsuari: [{datetime.datetime.now()}] {message}")

    def execute_login(self,id_dni: str):
        self.log(f"Intentant login con DNI: {id_dni}")
        usuari = self.cercador.cerca_per_dni(id_dni)
        
        if usuari is None:
            self.log("Usuari no trobat")
            return {"error":"Usuari no trobat"}, 404
        
        session['usuari_dni'] = usuari.getDNI()
        self.log(f"Sessió iniciada per {usuari.getNom()}")
        
        return{
            "message": "Login processat correctament",
            "usuari":{
                "dni": usuari.getDNI(),
                "nom": usuari.getNom(),
                "mail": usuari.getMail(),
                "saldo": usuari.getSaldo()
            }
        },200
    
    def modificar_perfil(self, data: dict):
        self.log("Modificant perfil d'usuari...")

        dni = session.get("usuari_dni")
        if not dni:
            return {"error": "No hi ha cap sessió iniciada"}, 401

        usuari = self.cercador.cerca_per_dni(dni)
        if not usuari:
            return {"error": "Usuari no trobat"}, 404

        if 'mail' in data:
            usuari.setMail(data['mail'])
        if 'nom' in data:
            usuari.setNom(data['nom'])

        if not usuari.modifica():
            return {"error": "Error actualitzant l'usuari"}, 500

        if 'targeta' in data:
            tdata = data['targeta']
            targeta = Targeta.obtenir_per_usuari(dni)
            if targeta:
                if 'data_cad' in tdata:
                    targeta.data_cad = tdata['data_cad']
                if 'cvc' in tdata:
                    targeta.cvc = tdata['cvc']

                if not targeta.modifica():
                    return {"error": "Error actualitzant la targeta"}, 500

        # 🔧 AÑADIR ESTE RETURN PARA CASOS SIN TARGETA
        return {"message": "Perfil actualitzat correctament"}, 200
