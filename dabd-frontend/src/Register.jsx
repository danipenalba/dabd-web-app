import React, { useState } from 'react';
import './Register.css';

function Register({ onNavigateToHome, onNavigateToLogin }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    password: '',
    numeroTarjeta: '',
    fechaCaducidad: '',
    cvc: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert("✅ Registro exitoso. ¡Bienvenido!");
        onNavigateToLogin();  // Redirige al login
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (error) {
      alert("❌ Error en la conexión con el servidor.");
      console.error(error);
    }
  };
  

  return (
    <div className="register-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>EUROBET</div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={onNavigateToLogin}>Iniciar Sesión</button>
          <button className="register-btn active">Registrarse</button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="register-main">
        <div className="register-content">
          <h1>ÚNETE A EUROBET</h1>
          <h2>Crea tu cuenta y comienza a apostar</h2>
          
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Sección de datos personales */}
            <div className="form-section">
              <h3>DATOS PERSONALES</h3>
              <div className="form-group">
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              
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
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
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
                />
              </div>
            </div>

            {/* Sección de datos de la tarjeta */}
            <div className="form-section">
              <h3>DATOS DE LA TARJETA</h3>
              <div className="form-group">
                <label htmlFor="numeroTarjeta">Número de tarjeta</label>
                <input
                  type="text"
                  id="numeroTarjeta"
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={handleChange}
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fechaCaducidad">Fecha de caducidad</label>
                  <input
                    type="date"
                    id="fechaCaducidad"
                    name="fechaCaducidad"
                    value={formData.fechaCaducidad}
                    onChange={handleChange}
                    required
                  />

                </div>
                
                <div className="form-group">
                  <label htmlFor="cvc">CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    maxLength="3"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="register-submit-btn">
              CREAR CUENTA
            </button>
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

export default Register