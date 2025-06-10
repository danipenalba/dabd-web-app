from flask import Blueprint, request, session, jsonify
from app.ControladorUsuari import ControladorUsuari
from app.ControladorPartit import ControladorPartit


main = Blueprint('main', __name__)

@main.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hola desde el backend Flask!"})



@main.route('/login', methods = ['POST'])
def login():
    data = request.get_json()
    if not data or 'dni' not in data:
        return jsonify({"error": "Falta el campo 'dni'."}), 400

    ctrl = ControladorUsuari()
    result, status_code = ctrl.execute_login(
        id_dni = data.get('dni')
    )
    return result, status_code


@main.route('/perfil', methods=['PUT'])
def modificar_perfil():
    data = request.get_json()
    ctrl = ControladorUsuari()
    result, status_code = ctrl.modificar_perfil(data)
    return result, status_code


@main.route('/partits', methods=['GET'])
def obtenir_partits():
    ctrl = ControladorPartit()
    return ctrl.obtenir_partits()