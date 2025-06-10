import React, { useState } from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import fondo from './images/fondo.jpg';

// Componente Home separado
function Home({ onNavigateToRegister }) {
  return (
    <>
      {/* Contenido principal */}
      <main className="hero-section">
        <div className="hero-content">
          <h1>LA EMOCIÓN DEL FÚTBOL EUROPEO</h1>
          <h2>Apuestas en tiempo real con las mejores cuotas</h2>
          <div className="cta-buttons">
            <button className="primary-cta">VER PARTIDOS EN VIVO</button>
            <button className="secondary-cta">EXPLORAR COMPETICIONES</button>
          </div>
        </div>
      </main>

      {/* Sección de destacados */}
      <section className="featured-section">
        <div className="featured-header">
          <h3>PRÓXIMOS EVENTOS DESTACADOS</h3>
          <div className="filters">
            <span className="active">HOY</span>
            <span>MAÑANA</span>
            <span>LIGA DE CAMPEONES</span>
          </div>
        </div>
        
        <div className="matches-container">
          <div className="match-card">
            <div className="teams">
              <div className="team">
                <div className="team-logo placeholder-logo"></div>
                <span>Real Madrid</span>
              </div>
              <div className="vs">VS</div>
              <div className="team">
                <div className="team-logo placeholder-logo"></div>
                <span>FC Barcelona</span>
              </div>
            </div>
            <div className="match-details">
              <span>Liga Española · Hoy 20:45</span>
              <button className="bet-btn">VER CUOTAS</button>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToHome = () => setCurrentPage('home');
  const navigateToRegister = () => setCurrentPage('register');
  const navigateToLogin = () => setCurrentPage('login');

  // Si estamos en la página de registro, renderizar solo Register
  if (currentPage === 'register') {
    return <Register onNavigateToHome={navigateToHome} onNavigateToLogin={navigateToLogin} />;
  }

  // Si estamos en la página de login, renderizar solo Login
  if (currentPage === 'login') {
    return <Login onNavigateToHome={navigateToHome} onNavigateToRegister={navigateToRegister} />;
  }

  // Página principal
  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo" onClick={navigateToHome} style={{ cursor: 'pointer' }}>EUROBET</div>
        <div className="nav-buttons">
          <button className="login-btn" onClick={navigateToLogin}>Iniciar Sesión</button>
          <button className="register-btn" onClick={navigateToRegister}>Registrarse</button>
        </div>
      </nav>

      <Home onNavigateToRegister={navigateToRegister} />
    </div>
  );
}

export default App;