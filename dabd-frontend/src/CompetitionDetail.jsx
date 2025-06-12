import React, { useState } from 'react';
import './CompetitionDetail.css';
import { useParams, useNavigate } from 'react-router-dom';

// Datos de ejemplo para las competiciones (esto será reemplazado por datos del backend)
const competitions = [
  { id: 'laliga', name: 'LaLiga', country: 'España', image: 'laliga.jpg', type: 'liga' },
  { id: 'premier', name: 'Premier League', country: 'Inglaterra', image: 'premier.jpg', type: 'liga' },
  { id: 'ligue1', name: 'Ligue 1', country: 'Francia', image: 'ligue1.jpg', type: 'liga' },
  { id: 'seriea', name: 'Serie A', country: 'Italia', image: 'seriea.jpg', type: 'liga' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Alemania', image: 'bundesliga.jpg', type: 'liga' },
  { id: 'coparey', name: 'Copa del Rey', country: 'España', image: 'coparey.jpg', type: 'copa' },
  { id: 'facup', name: 'FA Cup', country: 'Inglaterra', image: 'facup.jpg', type: 'copa' },
  { id: 'coupedefrance', name: 'Coupe de France', country: 'Francia', image: 'coupedefrance.jpg', type: 'copa' },
  { id: 'coppaitalia', name: 'Coppa Italia', country: 'Italia', image: 'coppaitalia.jpg', type: 'copa' },
  { id: 'dfbpokal', name: 'DFB-Pokal', country: 'Alemania', image: 'dfbpokal.jpg', type: 'copa' },
  { id: 'superliga', name: 'Superliga Europea', country: 'Europa', image: 'superliga.jpg', type: 'superliga' },
];

function CompetitionDetail() {
  const { compId } = useParams();
  const navigate = useNavigate();
  const [matchType, setMatchType] = useState('upcoming'); // 'upcoming' o 'played'
  
  // Encontrar la competición actual por ID
  const currentCompetition = competitions.find(comp => comp.id === compId) || competitions[0];
  
  // Filtrar competiciones por tipo
  const leagues = competitions.filter(c => c.type === 'liga');
  const cups = competitions.filter(c => c.type === 'copa');
  const superLeague = competitions.filter(c => c.type === 'superliga');
  
  // Función para cambiar de competición
  const handleCompetitionChange = (e) => {
    navigate(`/competition/${e.target.value}`);
  };

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo">EUROBET</div>
        <div className="nav-buttons">
          <button className="profile-btn">Mi Perfil</button>
          <button className="logout-btn">Cerrar Sesión</button>
        </div>
      </nav>

      <main className="competition-detail">
        <div className="competition-header">
          <div className="competition-info">
            <div className="competition-image">
              <img 
                src={`./images/${currentCompetition.image}`} 
                alt={currentCompetition.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = './images/placeholder.jpg';
                }}
              />
            </div>
            <div className="competition-title">
              <h1>{currentCompetition.name}</h1>
              <span>{currentCompetition.country}</span>
            </div>
          </div>
          
          <div className="competition-selector">
            <select 
              value={currentCompetition.id} 
              onChange={handleCompetitionChange}
            >
              <optgroup label="Ligas Nacionales">
                {leagues.map(league => (
                  <option key={league.id} value={league.id}>{league.name}</option>
                ))}
              </optgroup>
              <optgroup label="Copas Nacionales">
                {cups.map(cup => (
                  <option key={cup.id} value={cup.id}>{cup.name}</option>
                ))}
              </optgroup>
              <optgroup label="Superliga Europea">
                {superLeague.map(sl => (
                  <option key={sl.id} value={sl.id}>{sl.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Sección de equipos */}
        <section className="teams-section">
          <h2>Equipos Participantes</h2>
          <div className="teams-grid">
            {/* Esto se rellenará con datos del backend */}
            {/* Ejemplo de equipo (se repetirá por cada equipo) */}
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
            <div className="team-card">
              <div className="team-logo"></div>
              <div className="team-name">Nombre del equipo</div>
            </div>
          </div>
        </section>

        {/* Sección de partidos */}
        <section className="matches-section">
          <div className="matches-header">
            <h2>Partidos</h2>
            <div className="match-filters">
              <button 
                className={matchType === 'upcoming' ? 'active' : ''}
                onClick={() => setMatchType('upcoming')}
              >
                Próximos Partidos
              </button>
              <button 
                className={matchType === 'played' ? 'active' : ''}
                onClick={() => setMatchType('played')}
              >
                Partidos Jugados
              </button>
            </div>
          </div>

          <div className="matches-list">
            {/* Esto se rellenará con datos del backend */}
            {/* Ejemplo de partido (se repetirá por cada partido) */}
            <div className="match-card">
              <div className="match-date">Sáb, 15 Jun - 20:45</div>
              <div className="match-teams">
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Local</span>
                </div>
                <div className="vs">VS</div>
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Visitante</span>
                </div>
              </div>
              <div className="match-odds">
                <div className="odd">1.85</div>
                <div className="odd">3.40</div>
                <div className="odd">4.20</div>
              </div>
              <button className="bet-btn">APOSTAR</button>
            </div>
            <div className="match-card">
              <div className="match-date">Dom, 16 Jun - 18:30</div>
              <div className="match-teams">
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Local</span>
                </div>
                <div className="vs">VS</div>
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Visitante</span>
                </div>
              </div>
              <div className="match-odds">
                <div className="odd">2.10</div>
                <div className="odd">3.20</div>
                <div className="odd">3.50</div>
              </div>
              <button className="bet-btn">APOSTAR</button>
            </div>
            <div className="match-card">
              <div className="match-date">Lun, 17 Jun - 21:00</div>
              <div className="match-teams">
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Local</span>
                </div>
                <div className="vs">VS</div>
                <div className="team">
                  <div className="team-logo-small"></div>
                  <span>Equipo Visitante</span>
                </div>
              </div>
              <div className="match-odds">
                <div className="odd">1.65</div>
                <div className="odd">3.80</div>
                <div className="odd">5.00</div>
              </div>
              <button className="bet-btn">APOSTAR</button>
            </div>
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

export default CompetitionDetail;