import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LaLigaPage.css';
import competitionImg from './images/facup.png';

function FACupPage({ onNavigateToHome, onNavigateToMyBets, onNavigateBack }) {
  const [matchFilter, setMatchFilter] = useState('jugados');
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const COMPETITION_ID = 'liga_en';
  const COMPETITION_NAME = 'FA CUP';
  const COMPETITION_DESCRIPTION = 'Inglaterra • Copa Nacional';

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/equips/${COMPETITION_ID}`);
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const teamNames = await response.json(); // Esto es un array de strings
      
      // Convertimos los nombres de equipos a objetos con la estructura esperada
      const teamsData = teamNames.map((teamName, index) => ({
        id: index, // Usamos el índice como ID temporal
        nom: teamName, // El nombre del equipo
        logo: '', // No hay logos en los datos
        ciutat: '' // No hay información de ciudad
      }));
      
      setTeams(teamsData);
    } catch (err) {
      console.error('Error al obtener equipos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/partits/despres-18-juny');
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const allMatches = await response.json();
      const filtered = allMatches
        .filter(match => match.competicio_id === COMPETITION_ID)
        .sort((a, b) => new Date(b.data) - new Date(a.data));
      setMatches(filtered);
      setFilteredMatches(filterByType(filtered, matchFilter));
    } catch (err) {
      console.error('Error al obtener partidos:', err);
      setError(err.message);
    }
  };

  const filterByType = (matchList, type) => {
    const now = new Date();
    return matchList.filter(match =>
      type === 'jugados'
        ? new Date(match.data) < now
        : new Date(match.data) >= now
    );
  };

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, []);

  useEffect(() => {
    setFilteredMatches(filterByType(matches, matchFilter));
  }, [matchFilter, matches]);

  const handleClickPartido = (match) => {
    const homeLogo = teams.find(t => t.nom === match.local)?.logo || './images/default_home.jpg';
    const awayLogo = teams.find(t => t.nom === match.visitant)?.logo || './images/default_away.jpg';

    navigate('/crearaposta', {
      state: {
        partido: {
          id: match.id,
          homeTeam: match.local,
          awayTeam: match.visitant,
          date: match.data,
          homeTeamLogo: homeLogo,
          awayTeamLogo: awayLogo
        }
      }
    });
  };

  return (
    <div className="competition-container">
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>
          EUROBET
        </div>
        <div className="nav-buttons">
          <button className="back-btn" onClick={onNavigateBack}>← Volver</button>
          <button className="my-bets-btn" onClick={onNavigateToMyBets}>Mis Apuestas</button>
          <button className="logout-btn" onClick={onNavigateToHome}>Cerrar Sesión</button>
        </div>
      </nav>

      <main className="main-content">
        <div className="competition-header">
          <div className="competition-logo">
            <img src={competitionImg} alt={COMPETITION_NAME} />
          </div>
          <div className="competition-title">
            <h1>{COMPETITION_NAME}</h1>
            <span>{COMPETITION_DESCRIPTION}</span>
          </div>
        </div>

        <section className="teams-section">
          <div className="section-header"><h3>EQUIPOS PARTICIPANTES</h3></div>
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
                <button className="retry-btn" onClick={fetchTeams}>Reintentar</button>
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
                      {team.ciutat && <p className="team-city">{team.ciutat}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="matches-section">
          <div className="section-header"><h3>PARTIDOS</h3></div>
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
          <div className="matches-container">
            {filteredMatches.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>
                  {matchFilter === 'jugados'
                    ? 'No hay partidos jugados disponibles para esta competición.'
                    : 'No hay próximos partidos disponibles para esta competición.'}
                </p>
              </div>
            ) : (
              <div className="matches-list">
                {filteredMatches.map(match => (
                  <div
                    key={match.id}
                    className="match-card"
                    onClick={() => handleClickPartido(match)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="match-date">
                      {new Date(match.data).toLocaleString('es-ES', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="match-teams">
                      <span>{match.local}</span> vs <span>{match.visitant}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

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

export default FACupPage;