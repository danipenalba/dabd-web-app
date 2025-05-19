from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Habilita CORS para que el frontend pueda hacer peticiones

    from .routes import main
    app.register_blueprint(main)

    return app
