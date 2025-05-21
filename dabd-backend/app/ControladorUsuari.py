import datetime
from flask import request, jsonify, session
from app.Usuari import Usuari
from app.CercadoraUsuari import CercadoraUsuari

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