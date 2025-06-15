from flask import Blueprint, request, session, jsonify
from app.ControladorUsuari import ControladorUsuari, Usuari,CercadoraUsuari
from app.ControladorPartit import ControladorPartit
from app.Targeta import Targeta
from app.ApostesUsuari import ApostesUsuari  # Importamos la clase (no un blueprint)
from app.MostraEquips import MostraEquips
from app.MostraJugadors import MostraJugadors
from app.MostrarApostes import MostrarApostes


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




@main.route('/apostas', methods=['POST'])
def crear_aposta():
    if 'usuari_dni' not in session:
        return jsonify({"error": "No autenticado"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos no proporcionados"}), 400

    usuari_dni = session['usuari_dni']
    match = data.get("match")
    bets = data.get("bets")
    odds = data.get("odds")
    amount = data.get("amount")

    if not (match and bets and odds and amount):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({"error": "El importe debe ser mayor que cero"}), 400
    except ValueError:
        return jsonify({"error": "Importe no válido"}), 400

    partit_id = match.get("id")
    if not partit_id:
        return jsonify({"error": "Falta el ID del partido"}), 400

    apu = ApostesUsuari()
    success = apu.crear_apuestas_multiples(
        usuari_dni, partit_id, bets, odds, amount
    )

    if success:
        return jsonify({"mensaje": "Apuesta creada correctamente"}), 201
    else:
        return jsonify({"error": "Error al crear apuesta: saldo insuficiente o datos inválidos"}), 400

@main.route('/infoUsuari', methods=['GET'])
def obtenir_perfil():
    if 'usuari_dni' not in session:
        return jsonify({"error": "Usuari no autenticat"}), 401

    dni = session['usuari_dni']
    cercadora = CercadoraUsuari()
    usuari = cercadora.cerca_per_dni(dni)

    if not usuari:
        return jsonify({"error": "Usuari no trobat"}), 404

    # Obtener la tarjeta asociada (puede ser None)
    targeta = Targeta.obtenir_per_usuari(dni)

    dades_usuari = {
        "nom": usuari.getNom(),
        "mail": usuari.getMail(),
        "dni": usuari.getDNI(),
        "saldo": usuari.getSaldo(),
        # Añadimos los datos de la tarjeta solo si existe
        "targeta": {
            "id_num_targ": targeta.id_num_targ,
            "data_cad": targeta.data_cad,
            "cvc": targeta.cvc
        } if targeta else None
    }

    return jsonify(dades_usuari), 200




@main.route('/jugadors/<equip_id>', methods=['GET'])
def obtenir_jugadors(equip_id):
    mostra = MostraJugadors()
    noms = mostra.get_jugadors_per_equip(equip_id)
    return jsonify(noms), 200




@main.route('/equips/<competicio_id>', methods=['GET'])
def obtenir_equips(competicio_id):
    me = MostraEquips()
    equips = me.get_equips_per_competicio(competicio_id)
    return jsonify(equips), 200



@main.route('/partits/despres-18-juny', methods=['GET'])
def obtenir_partits_despres_18_juny():
    ctrl = ControladorPartit()
    return ctrl.obtenir_partits_despres_del_18_juny_2025()



@main.route('/apostasmostrar', methods=['GET'])
def obtenir_apostes_mostrar():
     apuestas = MostrarApostes().get_apostes_usuari()
     return jsonify(apuestas), 200

@main.route('/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    ctrl = ControladorPartit()
    result, status_code = ctrl.obtenir_partit(match_id)
    return jsonify(result), status_code


