from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.secret_key = 'clave_ultra_secreta_que_deberias_cambiar'

    # Activar CORS para toda la app
    CORS(app, supports_credentials=True)

    from .routes import main
    app.register_blueprint(main)

    return app

