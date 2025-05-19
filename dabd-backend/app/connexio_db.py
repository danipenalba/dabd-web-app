import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2 import OperationalError, DatabaseError
import os
from dotenv import load_dotenv
import threading
import datetime

# Carga las variables de entorno desde el archivo .env
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

# Variables de entorno para la conexión a la base de datos
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))  # Aquí cuidado si no está definido, daría error al hacer int(None)
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_OPTIONS = os.getenv("DB_OPTIONS")


class ConnexioBD:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                try:
                    cls._instance._init_connection()
                except Exception as e:
                    cls._instance = None
                    raise
            return cls._instance

    def log(self, message: str) -> None:
        print(f"ConnexioBD: [{datetime.datetime.now()}] {message}")

    def _init_connection(self):
        try:
            db_config = {
                'host': DB_HOST,
                'port': DB_PORT,
                'database': DB_NAME,
                'user': DB_USER,
                'password': DB_PASSWORD,
                'options': DB_OPTIONS
            }

            # Validación básica de variables obligatorias
            if None in (db_config['host'], db_config['database'], db_config['user'], db_config['password']):
                raise ValueError("❌ Falta una o más variables de entorno para la conexión a la BD.")

            # Crear la conexión a PostgreSQL
            self.con = psycopg2.connect(**db_config)
            self.con.autocommit = True
            self.log("✅ Conexión establecida con éxito.")
        except (OperationalError, DatabaseError, ValueError) as e:
            self.log(f"❌ Error al conectar con la BD: {e}")
            raise

    def _verificar_conexion(self):
        try:
            # Si no existe la conexión o está cerrada, reconectamos
            if not hasattr(self, 'con') or self.con.closed != 0:
                self.log("🔄 La conexión estaba cerrada, reconectando...")
                self._init_connection()
        except Exception as e:
            self.log(f"Error al verificar conexión: {e}")
            raise

    def close(self):
        if hasattr(self, 'con') and self.con.closed == 0:
            self.con.close()
            self.log("🔻 Conexión cerrada con éxito.")

    def __enter__(self):
        self._verificar_conexion()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def executarConsulta(self, consulta_sql, params=None):
        self._verificar_conexion()
        try:
            with self.con.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(consulta_sql, params or ())
                return cursor.fetchall()
        except DatabaseError as e:
            self.log(f"⚠️ Error en consulta SQL: {e}\nConsulta: {consulta_sql}")
            raise

    def executarComanda(self, comanda_sql, params=None):
        self._verificar_conexion()
        try:
            with self.con.cursor() as cursor:
                cursor.execute(comanda_sql, params or ())
                return cursor.rowcount
        except DatabaseError as e:
            self.log(f"⚠️ Error en comanda SQL: {e}\nComanda: {comanda_sql}")
            self.con.rollback()
            raise
