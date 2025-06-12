import React, { useState } from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';

function MainPage() {
  // Datos de las competiciones
  const competitions = [
    {
      id: 1,
      name: 'LaLiga',
      country: 'España',
      type: 'liga',
      image: 'laliga.jpg'
    },
    {
      id: 2,
      name: 'Premier League',
      country: 'Inglaterra',
      type: 'liga',
      image: 'premier.jpg'
    },
    {
      id: 3,
      name: 'Ligue 1',
      country: 'Francia',
      type: 'liga',
      image: 'ligue1.jpg'
    },
    {
      id: 4,
      name: 'Serie A',
      country: 'Italia',
      type: 'liga',
      image: 'seriea.jpg'
    },
    {
      id: 5,
      name: 'Bundesliga',
      country: 'Alemania',
      type: 'liga',
      image: 'bundesliga.jpg'
    },
    {
      id: 6,
      name: 'Copa del Rey',
      country: 'España',
      type: 'copa',
      image: 'coparey.jpg'
    },
    {
      id: 7,
      name: 'FA Cup',
      country: 'Inglaterra',
      type: 'copa',
      image: 'facup.jpg'
    },
    {
      id: 8,
      name: 'Coupe de France',
      country: 'Francia',
      type: 'copa',
      image: 'coupedefrance.jpg'
    },
    {
      id: 9,
      name: 'Coppa Italia',
      country: 'Italia',
      type: 'copa',
      image: 'coppaitalia.jpg'
    },
    {
      id: 10,
      name: 'DFB-Pokal',
      country: 'Alemania',
      type: 'copa',
      image: 'dfbpokal.jpg'
    },
    {
      id: 11,
      name: 'Superliga Europea',
      country: 'Europa',
      type: 'superliga',
      image: 'superliga.jpg'
    }
  ];

  // Estado para controlar la competición seleccionada
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  // Filtrar competiciones por tipo
  const leagues = competitions.filter(c => c.type === 'liga');
  const cups = competitions.filter(c => c.type === 'copa');
  const superLeague = competitions.filter(c => c.type === 'superliga');

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo">EUROBET</div>
        <div className="nav-buttons">
          <Link to="/UserProfile" className="profile-btn">Mi Perfil</Link>
          <button className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="mainpage-content">
        <div className="mainpage-header">
          <h1>Bienvenido a EUROBET</h1>
          <p>Selecciona una competición para ver los partidos disponibles</p>
        </div>

        {/* Sección de Ligas Nacionales */}
        <section className="competitions-section">
          <h2>Ligas Nacionales</h2>
          <div className="competitions-grid">
            {leagues.map(league => (
              <div 
                key={league.id} 
                className="competition-card"
                onClick={() => setSelectedCompetition(league)}
              >
                <div className="competition-image">
                  <img 
                    src={`./images/${league.image}`} 
                    alt={league.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="competition-info">
                  <h3>{league.name}</h3>
                  <span>{league.country}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Copas Nacionales */}
        <section className="competitions-section">
          <h2>Copas Nacionales</h2>
          <div className="competitions-grid">
            {cups.map(cup => (
              <div 
                key={cup.id} 
                className="competition-card"
                onClick={() => setSelectedCompetition(cup)}
              >
                <div className="competition-image">
                  <img 
                    src={`./images/${cup.image}`} 
                    alt={cup.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="competition-info">
                  <h3>{cup.name}</h3>
                  <span>{cup.country}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Superliga Europea */}
        <section className="competitions-section">
          <h2>Superliga Europea</h2>
          <div className="competitions-grid">
            {superLeague.map(sl => (
              <div 
                key={sl.id} 
                className="competition-card"
                onClick={() => setSelectedCompetition(sl)}
              >
                <div className="competition-image">
                  <img 
                    src={`./images/${sl.image}`} 
                    alt={sl.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="competition-info">
                  <h3>{sl.name}</h3>
                  <span>{sl.country}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Mis Apuestas */}
        <section className="my-bets-section">
          <Link to="/MyBets" className="my-bets-link">
            <div className="my-bets-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="my-bets-info">
              <h2>Mis Apuestas</h2>
              <p>Revisa el historial y estado de tus apuestas</p>
            </div>
          </Link>
        </section>

        {/* Modal para la competición seleccionada */}
        {selectedCompetition && (
          <div className="modal-overlay" onClick={() => setSelectedCompetition(null)}>
            <div className="competition-modal" onClick={e => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setSelectedCompetition(null)}>
                &times;
              </button>
              <div className="modal-header">
                <div className="modal-image">
                  <img 
                    src={`./images/${selectedCompetition.image}`} 
                    alt={selectedCompetition.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = './images/placeholder.jpg';
                    }}
                  />
                </div>
                <h2>{selectedCompetition.name}</h2>
                <p>{selectedCompetition.country}</p>
              </div>
              <div className="modal-content">
                <p>Próximos partidos:</p>
                <div className="match-list">
                  <div className="match-item">
                    <div className="team">
                      <span>Equipo A</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <span>Equipo B</span>
                    </div>
                    <div className="match-time">Hoy 20:45</div>
                    <button className="bet-btn">Ver cuotas</button>
                  </div>
                  <div className="match-item">
                    <div className="team">
                      <span>Equipo C</span>
                    </div>
                    <div className="vs">VS</div>
                    <div className="team">
                      <span>Equipo D</span>
                    </div>
                    <div className="match-time">Mañana 18:30</div>
                    <button className="bet-btn">Ver cuotas</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default MainPage;