import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    app.secret_key = 'una_clave_secreta_segura'  
    
    CORS(app, supports_credentials=True)

    from .routes import main
    app.register_blueprint(main)

    return app
