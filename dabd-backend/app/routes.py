from flask import Blueprint, request, session, jsonify
from app.ControladorUsuari import ControladorUsuari
from app.ControladorPartit import ControladorPartit
from app.ApostesUsuari import ApostesUsuari  # Importamos la clase (no un blueprint)

main = Blueprint('main', __name__)

@main.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hola desde el backend Flask!"})


@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'dni' not in data or 'password' not in data:
        return jsonify({"error": "Faltan los campos 'dni' y/o 'password'."}), 400

    dni = data.get('dni', '').upper()
    if len(dni) != 9 or not dni[:8].isdigit() or not dni[8].isalpha():
        return jsonify({"error": "Formato de DNI inválido. Debe ser 8 números seguidos de una letra"}), 400

    ctrl = ControladorUsuari()
    result, status_code = ctrl.execute_login(
        dni=dni,
        password=data.get('password')
    )
    if status_code == 200:
        session['usuari_dni'] = dni
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
    if status_code == 201:
        session['usuari_dni'] = data.get('dni').upper()
    return jsonify(result), status_code


@main.route('/perfil', methods=['PUT'])
def modificar_perfil():
    data = request.get_json()
    ctrl = ControladorUsuari()
    result, status_code = ctrl.modificar_perfil(data)
    return result, status_code


@main.route('/usuari', methods=['DELETE'])
def eliminar_usuari():
    if request.content_type != 'application/json':
        return jsonify({"error": "Content-Type debe ser application/json"}), 415
    try:
        data = request.get_json()
    except:
        return jsonify({"error": "JSON malformado"}), 400
    if not data or 'password' not in data:
        return jsonify({"error": "Se requiere la contraseña"}), 400
    if 'usuari_dni' not in session:
        return jsonify({"error": "No autenticado"}), 401
    ctrl = ControladorUsuari()
    return ctrl.eliminar_usuari(data['password'])


# Endpoints para apuestas del usuario
@main.route('/apostas', methods=['POST'])
def crear_aposta():
    if 'usuari_dni' not in session:
        return jsonify({"error": "No autenticado"}), 401
    data = request.get_json()
    required = ['partit_id', 'premisa', 'cuota']
    if not all(key in data for key in required):
        return jsonify({"error": f"Faltan campos, se requieren: {required}"}), 400

    usuari_dni = session['usuari_dni']
    apu = ApostesUsuari()
    success = apu.crea_aposta(
        usuari_dni=usuari_dni,
        partit_id=data['partit_id'],
        premisa=data['premisa'],
        cuota=data['cuota']
    )
    return jsonify({"success": success}), (201 if success else 400)


@main.route('/apostas', methods=['GET'])
def listar_apostas():
    if 'usuari_dni' not in session:
        return jsonify({"error": "No autenticado"}), 401
    usuari_dni = session['usuari_dni']
    apu = ApostesUsuari()
    results = apu.obtenir_apostes(usuari_dni)
    return jsonify(results), 200
