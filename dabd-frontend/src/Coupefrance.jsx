import React, { useState } from 'react';
import './LaLigaPage.css';

// Simulando la importación del logo (cambiarás esto por cada competición)
import laligaImg from './images/coupefrance.png';

function LaLigaPage({ onNavigateToHome, onNavigateToMyBets, onNavigateBack }) {
  const [matchFilter, setMatchFilter] = useState('jugados'); // 'jugados' o 'futuros'

  // Datos de ejemplo - estos apartados estarán vacíos inicialmente
  const teams = []; // Aquí irán los equipos de la competición
  const matches = []; // Aquí irán los partidos

  return (
    <div className="competition-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>
          EUROBET
        </div>
        <div className="nav-buttons">
          <button className="back-btn" onClick={onNavigateBack}>
            ← Volver
          </button>
          <button className="my-bets-btn" onClick={onNavigateToMyBets}>
            Mis Apuestas
          </button>
          <button className="logout-btn" onClick={onNavigateToHome}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Header de la competición */}
        <div className="competition-header">
          <div className="competition-logo">
            <img src={laligaImg} alt="LaLiga" /> 
          </div>
          <div className="competition-title">
            <h1>COUPE FRANCE</h1>
            <span>Francia • Copa Nacional</span>
          </div>
        </div>

        {/* Sección de Equipos Participantes */}
        <section className="teams-section">
          <div className="section-header">
            <h3>EQUIPOS PARTICIPANTES</h3>
          </div>
          <div className="teams-container">
            {teams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⚽</div>
                <p>Los equipos participantes se mostrarán aquí</p>
              </div>
            ) : (
              <div className="teams-grid">
                {/* Aquí se mostrarán los equipos cuando vengan del backend */}
              </div>
            )}
          </div>
        </section>

        {/* Sección de Partidos */}
        <section className="matches-section">
          <div className="section-header">
            <h3>PARTIDOS</h3>
          </div>
          
          {/* Filtro de partidos */}
          <div className="matches-filter">
            <button 
              className={`filter-btn ${matchFilter === 'jugados' ? 'active' : ''}`}
              onClick={() => setMatchFilter('jugados')}
            >
              Partidos Jugados
            </button>
            <button 
              className={`filter-btn ${matchFilter === 'futuros' ? 'active' : ''}`}
              onClick={() => setMatchFilter('futuros')}
            >
              Próximos Partidos
            </button>
          </div>

          {/* Contenedor de partidos */}
          <div className="matches-container">
            {matches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>
                  {matchFilter === 'jugados' 
                    ? 'Los partidos jugados se mostrarán aquí' 
                    : 'Los próximos partidos se mostrarán aquí'
                  }
                </p>
              </div>
            ) : (
              <div className="matches-list">
                {/* Aquí se mostrarán los partidos cuando vengan del backend */}
              </div>
            )}
          </div>
        </section>
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

export default LaLigaPage;