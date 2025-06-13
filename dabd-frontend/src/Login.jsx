import React, { useState } from 'react';
import './Login.css';

function Login({ onNavigateToHome, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    dni: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpiar errores al cambiar los campos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Resetear mensajes de error

    // Validación básica del DNI (8 números + letra)
    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(formData.dni)) {
      setError('El DNI debe tener 8 números seguidos de una letra');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          dni: formData.dni.toUpperCase(), // Convertir a mayúsculas
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      console.log('Usuario logueado:', data.usuari);
      onNavigateToHome();

    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>EUROBET</div>
        <div className="nav-buttons">
          <button className="login-btn active">Iniciar Sesión</button>
          <button className="register-btn" onClick={onNavigateToRegister}>Registrarse</button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="login-main">
        <div className="login-content">
          <h1>BIENVENIDO A EUROBET</h1>
          <h2>Inicia sesión para continuar apostando</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Sección de datos de acceso */}
            <div className="form-section">
              <h3>DATOS DE ACCESO</h3>

              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="dni">DNI</label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  placeholder="12345678X"
                  maxLength="9"
                  pattern="[0-9]{8}[A-Za-z]"
                  title="8 números seguidos de una letra"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  minLength="8"
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              INICIAR SESIÓN
            </button>

            <div className="login-footer">
              <p>¿No tienes cuenta? <span className="link-text" onClick={onNavigateToRegister}>Regístrate aquí</span></p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>EUROBET</h4>
            <p>La casa de apuestas líder en fútbol europeo</p>
          </div>
          <div className="footer-section">
            <h4>COMPETICIONES</h4>
            <ul>
              <li>Premier League</li>
              <li>LaLiga</li>
              <li>Serie A</li>
              <li>Bundesliga</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>LEGAL</h4>
            <ul>
              <li>Términos y condiciones</li>
              <li>Política de privacidad</li>
              <li>Juego responsable</li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          © 2025 EUROBET - Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}

export default Login;