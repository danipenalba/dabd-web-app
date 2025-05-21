import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <h1>Apuestas Futbolísticas ⚽</h1>
      </header>

      <main className="main-content">
        <p className="intro-text">¡Bienvenido! Elige una opción para comenzar:</p>

        <div className="button-group">
          <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="secondary" onClick={() => navigate('/register')}>Registrarse</button>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Apuestas Futbolísticas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
