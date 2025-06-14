import React, { useState, useEffect } from 'react';
import './LaLigaPage.css';

// Simulando la importación del logo (cambiarás esto por cada competición)
import laligaImg from './images/laliga.png';

function LaLigaPage({ onNavigateToHome, onNavigateToMyBets, onNavigateBack }) {
  const [matchFilter, setMatchFilter] = useState('jugados'); // 'jugados' o 'futuros'
  const [teams, setTeams] = useState([]); // Estado para los equipos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  // ID de la competición (cambiar por cada página)
  const COMPETITION_ID = 'liga_es';

  // Función para obtener los equipos
  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/equips/${COMPETITION_ID}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      console.error('Error al obtener equipos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar los equipos al montar el componente
  useEffect(() => {
    fetchTeams();
  }, []);

  // Datos de ejemplo - estos apartados estarán vacíos inicialmente
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
            <h1>LALIGA</h1>
            <span>España • Liga Nacional</span>
          </div>
        </div>

        {/* Sección de Equipos Participantes */}
        <section className="teams-section">
          <div className="section-header">
            <h3>EQUIPOS PARTICIPANTES</h3>
          </div>
          <div className="teams-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Cargando equipos...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <p>Error al cargar los equipos: {error}</p>
                <button className="retry-btn" onClick={fetchTeams}>
                  Reintentar
                </button>
              </div>
            ) : teams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">⚽</div>
                <p>No hay equipos disponibles para esta competición</p>
              </div>
            ) : (
              <div className="teams-grid">
                {teams.map((team, index) => (
                  <div key={team.id || index} className="team-card">
                    <div className="team-logo">
                      {team.logo ? (
                        <img src={team.logo} alt={team.nom} />
                      ) : (
                        <div className="team-logo-placeholder">
                          {team.nom ? team.nom.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                    </div>
                    <div className="team-info">
                      <h4 className="team-name">{team.nom || 'Nombre no disponible'}</h4>
                      {team.ciutat && (
                        <p className="team-city">{team.ciutat}</p>
                      )}
                    </div>
                  </div>
                ))}
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