import sys
import os

# Añadir la carpeta actual al sys.path si ejecutas desde dentro de app/
sys.path.append(os.path.dirname(__file__))

from connexio_db import ConnexioBD

def main():
    try:
        with ConnexioBD() as db:
            # Consulta simple para verificar tablas (ejemplo, cambia según tu esquema)
            resultado = db.executarConsulta("SELECT table_name FROM information_schema.tables WHERE table_schema = 'practica';")
            print("Tablas en el esquema 'practica':")
            for fila in resultado:
                print(f"- {fila['table_name']}")
    except Exception as e:
        print(f"Error en la conexión o consulta: {e}")

if __name__ == "__main__":
    main()
