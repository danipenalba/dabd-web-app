import datetime
from flask import request, jsonify, session
from app.Usuari import Usuari
from app.CercadoraUsuari import CercadoraUsuari
from app.Targeta import Targeta  # Importar
from app.connexio_db import ConnexioBD



class ControladorUsuari:
    def __init__(self):
        self.cercador = CercadoraUsuari()
        
    def log(self, missatge):
        print(f"[ControladorUsuari] {missatge}")        

    def execute_login(self, dni: str, password: str):
        self.log(f"Intentando login con DNI: {dni}")
        
        # Buscar usuario por DNI en lugar de email
        usuari = self.cercador.cerca_per_dni(dni)

        if usuari is None:
            self.log("Usuario no encontrado")
            return {"error": "Usuario no encontrado"}, 404

        if usuari.getpassword() != password:
            self.log("Contraseña incorrecta")
            return {"error": "Contraseña incorrecta"}, 401

        session['usuari_dni'] = usuari.getDNI()
        self.log(f"Sesión iniciada para {usuari.getNom()}")

        return {
            "message": "Login procesado correctamente",
            "usuari": {
                "dni": usuari.getDNI(),
                "nom": usuari.getNom(),
                "mail": usuari.getMail(),
                "saldo": usuari.getSaldo()
            }
        }, 200

    def execute_register(self, dni, mail, nom, password, num_targeta, data_cad, cvc):
        print(f"[DEBUG] execute_register recibidos: dni={dni}, mail={mail}, nom={nom}, password={'*' * len(password) if password else None}, num_targeta={num_targeta}, data_cad={data_cad}, cvc={cvc}")
        try:
            usuari = Usuari(dni=dni, mail=mail, nom=nom, password=password)
            if not usuari.insereix():
                return {"error": "Error al registrar el usuario"}, 500

            targeta = Targeta(id_num_targ=num_targeta, data_cad=data_cad, cvc=cvc, usuari_id=dni)
            if not targeta.insereix():
                return {"error": "Usuario creado, pero error al registrar la tarjeta"}, 500

            return {"message": "Registro exitoso"}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    
    def modificar_perfil(self, data: dict):
        self.log("Modificant perfil d'usuari...")

        # 1. Verificación de sesión
        dni = session.get("usuari_dni")
        if not dni:
            return {"error": "No hi ha cap sessió iniciada"}, 401

        # 2. Obtención del usuario
        usuari = self.cercador.cerca_per_dni(dni)
        if not usuari:
            return {"error": "Usuari no trobat"}, 404

        # 3. Actualización de datos del usuario
        if 'dni' in data and data['dni'] != dni:
            # No permitir modificar el DNI, devolver error directamente
            return {"error": "No es pot modificar el DNI"}, 400

        usuario_actualizado = False
        if 'mail' in data:
            usuari.setMail(data['mail'])
            usuario_actualizado = True
        if 'nom' in data:
            usuari.setNom(data['nom'])
            usuario_actualizado = True

        if usuario_actualizado and not usuari.modifica():
            return {"error": "Error actualitzant l'usuari"}, 500

        # 4. Actualización de tarjeta (si se proporciona)
        if 'targeta' in data:
            tdata = data['targeta']
            targeta = Targeta.obtenir_per_usuari(dni)

            # Si no existe tarjeta pero se proporcionan datos, creamos una nueva
            if not targeta:
                if all(key in tdata for key in ['number', 'expiry', 'cvc']):
                    targeta = Targeta(
                        id_num_targ=tdata['number'],
                        data_cad=tdata['expiry'],
                        cvc=tdata['cvc'],
                        usuari_id=dni
                    )
                    if not targeta.insereix():
                        return {"error": "Error creant la targeta"}, 500
            else:
                # Actualizar tarjeta existente
                targeta_actualizada = False
                if 'number' in tdata:
                    targeta.id_num_targ = tdata['number']
                    targeta_actualizada = True
                if 'expiry' in tdata:
                    targeta.data_cad = tdata['expiry']
                    targeta_actualizada = True
                if 'cvc' in tdata:
                    targeta.cvc = tdata['cvc']
                    targeta_actualizada = True

                if targeta_actualizada and not targeta.modifica():
                    return {"error": "Error actualitzant la targeta"}, 500

        # 5. Retorno exitoso
        return {"message": "Perfil actualitzat correctament"}, 200

    

    def eliminar_usuari(self, password: str):
        print("\n[DEBUG] --- INICIO ELIMINACIÓN USUARIO ---")
        
        dni = session.get("usuari_dni")
        if not dni:
            print("[DEBUG] Error: No hay sesión activa")
            return {"error": "No autenticado"}, 401

        usuari = self.cercador.cerca_per_dni(dni)
        if not usuari:
            print(f"[DEBUG] Error: Usuario con DNI {dni} no encontrado")
            return {"error": "Usuario no encontrado"}, 404

        if usuari.getpassword() != password:
            print("[DEBUG] Error: Contraseña incorrecta")
            return {"error": "Contraseña incorrecta"}, 401

        # Eliminar tarjeta si existe
        targeta = Targeta.obtenir_per_usuari(dni)
        if targeta:
            print("[DEBUG] Eliminando tarjeta asociada...")
            if not targeta.elimina():
                print("[DEBUG] Error al eliminar tarjeta")
                return {"error": "Error al eliminar tarjeta"}, 500

        # Eliminar usuario
        print("[DEBUG] Eliminando usuario...")
        if not usuari.elimina():
            print("[DEBUG] Error al eliminar usuario")
            return {"error": "Error al eliminar usuario"}, 500

        # Limpiar sesión
        session.clear()
        print("[DEBUG] Usuario eliminado correctamente")
        return {"message": "Usuario eliminado correctamente"}, 200


        # 🔧 AÑADIR ESTE RETURN PARA CASOS SIN TARGETA
        return {"message": "Perfil actualitzat correctament"}, 200
    
    def verificar_saldo(self, dni: str, cantidad: float) -> bool:
        """Verifica si el usuario tiene saldo suficiente"""
        try:
            db = ConnexioBD()
            query = "SELECT saldo FROM usuari WHERE id_dni = %s"
            resultado = db.executarConsulta(query, (dni,))
            
            if not resultado:
                return False
                
            saldo_actual = resultado[0]['saldo']
            return saldo_actual >= cantidad
        except Exception as e:
            print(f"Error al verificar saldo: {e}")
            return False
        finally:
            db.tancar()

    def actualizar_saldo(self, dni: str, cantidad: float) -> bool:
        """Actualiza el saldo del usuario con verificación de saldo suficiente"""
        if cantidad < 0 and not self.verificar_saldo(dni, abs(cantidad)):
            return False

        try:
            db = ConnexioBD()
            query = "UPDATE usuari SET saldo = saldo + %s WHERE id_dni = %s RETURNING saldo"
            resultado = db.executarConsulta(query, (cantidad, dni))
            
            if not resultado:
                return False
                
            nuevo_saldo = resultado[0]['saldo']
            return nuevo_saldo >= 0
        except Exception as e:
            print(f"Error al actualizar saldo: {e}")
            return False
        finally:
            db.tancar()
