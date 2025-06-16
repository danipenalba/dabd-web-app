import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './crearAposta.css';

function CrearAposta({ onNavigateToMainPage }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(0);

  const partidoPasado = location.state?.partido;

  const fetchUserBalance = async () => {
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const response = await fetch(`${baseUrl}/infoUsuari`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.saldo);
      }
    } catch (error) {
      console.error("Error al obtener el saldo:", error);
    }
  };

  useEffect(() => {
    fetchUserBalance();
    
    if (!partidoPasado) {
      setTimeout(() => navigate('/laliga'), 3000);
    }
  }, [partidoPasado, navigate]);

  if (!partidoPasado) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        ⚠️ No se ha proporcionado información del partido.<br />
        Serás redirigido automáticamente a LaLiga...
      </div>
    );
  }

  const defaultMatch = {
    id: 0,
    homeTeam: 'Equipo Local',
    awayTeam: 'Equipo Visitante',
    date: 'Fecha no disponible',
    homeTeamLogo: './images/default_home.jpg',
    awayTeamLogo: './images/default_away.jpg'
  };

  const [matchData] = useState({
    ...defaultMatch,
    ...partidoPasado
  });

  const betParameters = [
    { id: 'victory', name: 'Victoria', type: 'boolean' },
    { id: 'draw', name: 'Empate', type: 'boolean' },
    { id: 'defeat', name: 'Derrota', type: 'boolean' },
    { id: 'goalsFor', name: 'Goles a favor', type: 'number' },
    { id: 'goalsAgainst', name: 'Goles en contra', type: 'number' },
    { id: 'penaltiesFor', name: 'Penaltis a favor', type: 'number' },
    { id: 'penaltiesAgainst', name: 'Penaltis en contra', type: 'number' },
    { id: 'corners', name: 'Número de corners', type: 'number' },
    { id: 'yellowCards', name: 'Número de amarillas', type: 'number' },
    { id: 'foulsFor', name: 'Faltas a favor', type: 'number' },
    { id: 'foulsAgainst', name: 'Faltas en contra', type: 'number' }
  ];

  const [selectedBets, setSelectedBets] = useState({ home: {}, away: {} });
  const [finalOdds, setFinalOdds] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [isCreatingBet, setIsCreatingBet] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const hasSelectedBets = Object.keys(selectedBets.home).length > 0 || 
                            Object.keys(selectedBets.away).length > 0;

    if (hasSelectedBets) {
      const randomOdds = (Math.random() * 4 + 1).toFixed(2);
      setFinalOdds(parseFloat(randomOdds));
    } else {
      setFinalOdds(null);
    }
  }, [selectedBets]);

  const handleBetSelection = (team, parameterId, value) => {
    setSelectedBets(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        [parameterId]: value
      }
    }));
  };

  const removeBet = (team, parameterId) => {
    setSelectedBets(prev => {
      const updatedTeam = { ...prev[team] };
      delete updatedTeam[parameterId];
      return { ...prev, [team]: updatedTeam };
    });
  };

  const handleCreateBet = async () => {
    if (!finalOdds || !betAmount || parseFloat(betAmount) <= 0) {
      setError('Por favor, selecciona una apuesta válida e introduce una cantidad.');
      return;
    }

    if (parseFloat(betAmount) > userBalance) {
      setError('Saldo insuficiente para realizar esta apuesta.');
      return;
    }

    setIsCreatingBet(true);
    setError('');
    setSuccess('');

    const betData = {
      match: matchData,
      bets: selectedBets,
      odds: finalOdds,
      amount: parseFloat(betAmount)
    };

    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const url = `${baseUrl}/apostas`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(betData)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(`¡Apuesta creada exitosamente! Cantidad: €${betAmount} | Cuota: ${finalOdds} | Ganancia potencial: €${(parseFloat(betAmount) * finalOdds).toFixed(2)}`);
        setSelectedBets({ home: {}, away: {} });
        setBetAmount('');
        setFinalOdds(null);
        await fetchUserBalance(); // Actualizar saldo después de la apuesta
        setTimeout(() => {
          const successElement = document.querySelector('.success-message');
          if (successElement) successElement.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError(result.error || 'Error inesperado al crear la apuesta.');
      }
    } catch (error) {
      setError(`Error de conexión: ${error.message}`);
    } finally {
      setIsCreatingBet(false);
    }
  };

  const BetParameter = ({ parameter, team, teamName }) => {
    const isSelected = selectedBets[team][parameter.id] !== undefined;

    return (
      <div className={`bet-parameter ${isSelected ? 'selected' : ''}`}>
        <div className="parameter-header">
          <span className="parameter-name">{parameter.name}</span>
          {isSelected && (
            <button className="remove-bet-btn" onClick={() => removeBet(team, parameter.id)}>✕</button>
          )}
        </div>

        {!isSelected ? (
          <button
            className="select-bet-btn"
            onClick={() => {
              if (parameter.type === 'boolean') {
                handleBetSelection(team, parameter.id, true);
              } else {
                const value = prompt(`¿Cuántos ${parameter.name.toLowerCase()} para ${teamName}?`);
                if (value !== null && !isNaN(value) && parseInt(value) >= 0) {
                  handleBetSelection(team, parameter.id, parseInt(value));
                }
              }
            }}
          >
            Seleccionar
          </button>
        ) : (
          <div className="selected-bet-info">
            <span className="bet-value">{parameter.type === 'boolean' ? '✓' : `+${selectedBets[team][parameter.id]}`}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="crear-aposta-container">
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToMainPage} style={{ cursor: 'pointer' }}>
          EUROBET
        </div>
        <div className="nav-buttons">
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
          <div className="user-balance">
            Saldo: €{userBalance.toFixed(2)}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="page-header">
          <h1>CREAR APUESTA</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <section className="match-info-section">
          <div className="match-header">
            <div className="team home-team">
              <div className="team-logo">
                <img src={matchData.homeTeamLogo} alt={matchData.homeTeam} />
              </div>
              <h2>{matchData.homeTeam}</h2>
              <span className="team-type">LOCAL</span>
            </div>
            <div className="vs-section">
              <div className="vs-text">VS</div>
              <div className="match-date">{matchData.date}</div>
            </div>
            <div className="team away-team">
              <div className="team-logo">
                <img src={matchData.awayTeamLogo} alt={matchData.awayTeam} />
              </div>
              <h2>{matchData.awayTeam}</h2>
              <span className="team-type">VISITANTE</span>
            </div>
          </div>
        </section>

        <section className="betting-section">
          <div className="betting-columns">
            <div className="betting-column home-column">
              <h3>APUESTAS - {matchData.homeTeam}</h3>
              <div className="parameters-grid">
                {betParameters.map(parameter => (
                  <BetParameter
                    key={`home-${parameter.id}`}
                    parameter={parameter}
                    team="home"
                    teamName={matchData.homeTeam}
                  />
                ))}
              </div>
            </div>

            <div className="betting-column away-column">
              <h3>APUESTAS - {matchData.awayTeam}</h3>
              <div className="parameters-grid">
                {betParameters.map(parameter => (
                  <BetParameter
                    key={`away-${parameter.id}`}
                    parameter={parameter}
                    team="away"
                    teamName={matchData.awayTeam}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {finalOdds && (
          <section className="bet-summary-section">
            <div className="bet-summary-card">
              <h3>RESUMEN DE APUESTA</h3>

              <div className="selected-bets-summary">
                {Object.keys(selectedBets.home).length > 0 && (
                  <div className="team-bets">
                    <h4>{matchData.homeTeam} (Local):</h4>
                    <ul>
                      {Object.entries(selectedBets.home).map(([paramId, value]) => {
                        const param = betParameters.find(p => p.id === paramId);
                        return (
                          <li key={paramId}>
                            {param.name}: {param.type === 'boolean' ? 'Sí' : `+${value}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {Object.keys(selectedBets.away).length > 0 && (
                  <div className="team-bets">
                    <h4>{matchData.awayTeam} (Visitante):</h4>
                    <ul>
                      {Object.entries(selectedBets.away).map(([paramId, value]) => {
                        const param = betParameters.find(p => p.id === paramId);
                        return (
                          <li key={paramId}>
                            {param.name}: {param.type === 'boolean' ? 'Sí' : `+${value}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              <div className="odds-section">
                <span className="odds-label">CUOTA FINAL:</span>
                <span className="odds-value">{finalOdds}</span>
              </div>

              <div className="bet-amount-section">
                <label htmlFor="betAmount">Cantidad a apostar (€):</label>
                <input
                  type="number"
                  id="betAmount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  disabled={isCreatingBet}
                />
                {betAmount && finalOdds && (
                  <div className="potential-win">
                    Ganancia potencial: €{(parseFloat(betAmount) * finalOdds).toFixed(2)}
                  </div>
                )}
              </div>

              <button
                className="create-bet-btn"
                onClick={handleCreateBet}
                disabled={!finalOdds || !betAmount || parseFloat(betAmount) <= 0 || isCreatingBet}
              >
                {isCreatingBet ? 'CREANDO APUESTA...' : 'CREAR APUESTA'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CrearAposta;