import os
from app import create_app

app = create_app()

# Establecer la clave secreta para las sesiones
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key")

if __name__ == '__main__':
    app.run(debug=True)
