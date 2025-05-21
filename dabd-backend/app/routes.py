from flask import Blueprint, request, session, jsonify
from app.ControladorUsuari import ControladorUsuari


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