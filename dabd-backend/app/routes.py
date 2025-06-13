from flask import Blueprint, request, session, jsonify
from app.ControladorUsuari import ControladorUsuari
from app.ControladorPartit import ControladorPartit


main = Blueprint('main', __name__)

@main.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hola desde el backend Flask!"})



@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'dni' not in data or 'password' not in data:
        return jsonify({"error": "Faltan los campos 'dni' y/o 'password'."}), 400

    # Validación básica del formato del DNI
    dni = data.get('dni', '').upper()  # Convertir a mayúsculas
    if len(dni) != 9 or not dni[:8].isdigit() or not dni[8].isalpha():
        return jsonify({"error": "Formato de DNI inválido. Debe ser 8 números seguidos de una letra"}), 400

    ctrl = ControladorUsuari()
    result, status_code = ctrl.execute_login(
        dni=dni,
        password=data.get('password')
    )
    return result, status_code

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("[DEBUG] Datos recibidos en /register:", data)

    ctrl = ControladorUsuari()
    result, status_code = ctrl.execute_register(
        dni=data.get('dni'),
        mail=data.get('email'),
        nom=data.get('nombre'),
        password=data.get('password'),
        num_targeta=data.get('numeroTarjeta'),
        data_cad=data.get('fechaCaducidad'),
        cvc=data.get('cvc')
    )
    return jsonify(result), status_code


@main.route('/perfil', methods=['PUT'])
def modificar_perfil():
    data = request.get_json()
    ctrl = ControladorUsuari()
    result, status_code = ctrl.modificar_perfil(data)
    return result, status_code


@main.route('/usuari', methods=['DELETE'])
def eliminar_usuari():
    # Verificar que el Content-Type es correcto
    if request.content_type != 'application/json':
        return jsonify({"error": "Content-Type debe ser application/json"}), 415
    
    # Verificar que hay datos JSON
    try:
        data = request.get_json()
    except:
        return jsonify({"error": "JSON malformado"}), 400
        
    if not data or 'password' not in data:
        return jsonify({"error": "Se requiere la contraseña"}), 400
    
    # Verificar sesión
    if 'usuari_dni' not in session:
        return jsonify({"error": "No autenticado"}), 401
    
    ctrl = ControladorUsuari()
    return ctrl.eliminar_usuari(data['password'])