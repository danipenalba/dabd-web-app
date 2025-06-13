import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApostesUsuari.css';

function ApostesUsuari({ onNavigateToHome, onNavigateToMainPage }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('historial');
  const [apostasHistorial, setApostasHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calcular estadísticas
  const apuestasGanadas = apostasHistorial.filter(a => a.estat === 'GANADA').length;
  const apuestasPerdidas = apostasHistorial.filter(a => a.estat === 'PERDIDA').length;
  const apuestasPendientes = apostasHistorial.filter(a => a.estat === 'PENDIENTE').length;
  const tasaAcierto = apostasHistorial.length > 0 
    ? Math.round((apuestasGanadas / apostasHistorial.length) * 100) 
    : 0;
  const gananciaTotal = apostasHistorial
    .filter(a => a.estat === 'GANADA')
    .reduce((total, apuesta) => total + (apuesta.cuota * apuesta.cantidad - apuesta.cantidad), 0);

  const handleCreateBet = () => {
    console.log('Crear nueva apuesta');
    // navigate('/crear-apuesta');
  };

  const handleBackToCompetitions = () => {
    if (onNavigateToMainPage) onNavigateToMainPage();
    else navigate('/main');
  };

  // Al montar o cambiar a pestaña historial, obtenemos apuestas
  useEffect(() => {
    if (activeTab !== 'historial') return;
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/apostas', {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) throw new Error('Error al cargar apuestas');
        return response.json();
      })
      .then(data => {
        // Agregar datos de ejemplo para demostración
        const apuestasConEjemplos = data.length > 0 ? data : [
          {
            id: 1,
            premisa: "Ganador del partido",
            cuota: 2.5,
            cantidad: 20,
            estat: "GANADA",
            equip_local: "FC Barcelona",
            equip_visitant: "Real Madrid",
            fecha: "2025-05-15",
            competicion: "La Liga"
          },
          {
            id: 2,
            premisa: "Ambos equipos marcan",
            cuota: 1.8,
            cantidad: 15,
            estat: "PERDIDA",
            equip_local: "Atlético Madrid",
            equip_visitant: "Valencia CF",
            fecha: "2025-05-10",
            competicion: "La Liga"
          },
          {
            id: 3,
            premisa: "Más de 2.5 goles",
            cuota: 2.1,
            cantidad: 25,
            estat: "PENDIENTE",
            equip_local: "Sevilla FC",
            equip_visitant: "Villarreal CF",
            fecha: "2025-06-20",
            competicion: "Copa del Rey"
          }
        ];
        setApostasHistorial(apuestasConEjemplos);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab]);

  // Función para obtener el color según el estado de la apuesta
  const getStatusColor = (status) => {
    switch(status) {
      case 'GANADA': return 'var(--success)';
      case 'PERDIDA': return 'var(--accent)';
      case 'PENDIENTE': return 'var(--pending)';
      default: return 'var(--gray)';
    }
  };

  // Función para obtener el icono según el estado de la apuesta
  const getStatusIcon = (status) => {
    switch(status) {
      case 'GANADA': return '✓';
      case 'PERDIDA': return '✗';
      case 'PENDIENTE': return '⏱';
      default: return '?';
    }
  };

  return (
    <div className="apostes-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
        <div className="logo" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>
          EUROBET
        </div>
        <div className="nav-buttons">
          <button className="competitions-btn" onClick={handleBackToCompetitions}>
            Competiciones
          </button>
          <button className="logout-btn" onClick={onNavigateToHome}>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>MIS APUESTAS</h1>
          <h2>Gestiona tus apuestas y crea nuevas predicciones</h2>
        </div>

        {/* Sección de acciones principales */}
        <section className="actions-section">
          <div className="create-bet-card" onClick={handleCreateBet}>
            <div className="action-icon">⚽</div>
            <div className="action-info">
              <h4>CREAR NUEVA APUESTA</h4>
              <span>Realiza una nueva predicción en cualquier competición</span>
            </div>
            <div className="action-arrow">→</div>
          </div>
        </section>

        {/* Tabs de navegación */}
        <section className="tabs-section">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`}
              onClick={() => setActiveTab('historial')}
            >
              HISTORIAL DE APUESTAS
            </button>
            <button
              className={`tab-btn ${activeTab === 'estadisticas' ? 'active' : ''}`}
              onClick={() => setActiveTab('estadisticas')}
            >
              ESTADÍSTICAS
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'historial' && (
              <div className="historial-content">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando apuestas...</p>
                  </div>
                ) : error ? (
                  <p className="error-message">{error}</p>
                ) : apostasHistorial.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No tienes apuestas registradas</h3>
                    <p>Cuando realices tu primera apuesta, aparecerá aquí tu historial completo</p>
                    <button className="create-first-bet-btn" onClick={handleCreateBet}>
                      Crear mi primera apuesta
                    </button>
                  </div>
                ) : (
                  <div className="bets-container">
                    <div className="bets-header">
                      <div>PARTIDO</div>
                      <div>APUESTA</div>
                      <div>CANTIDAD</div>
                      <div>CUOTA</div>
                      <div>GANANCIA</div>
                      <div>ESTADO</div>
                    </div>
                    <div className="bets-list">
                      {apostasHistorial.map(apuesta => {
                        const gananciaPotencial = apuesta.cuota * apuesta.cantidad;
                        const gananciaReal = apuesta.estat === 'GANADA' 
                          ? (apuesta.cuota * apuesta.cantidad - apuesta.cantidad).toFixed(2)
                          : apuesta.estat === 'PERDIDA' 
                            ? `-${apuesta.cantidad}` 
                            : (gananciaPotencial - apuesta.cantidad).toFixed(2);
                        
                        return (
                          <div key={apuesta.id} className="bet-card">
                            <div className="match-info">
                              <div className="teams">
                                <span className="team local">{apuesta.equip_local}</span>
                                <span className="vs">vs</span>
                                <span className="team visitor">{apuesta.equip_visitant}</span>
                              </div>
                              <div className="competition">{apuesta.competicion}</div>
                              <div className="match-date">{apuesta.fecha}</div>
                            </div>
                            <div className="bet-premise">
                              {apuesta.premisa}
                            </div>
                            <div className="bet-amount">
                              €{apuesta.cantidad}
                            </div>
                            <div className="bet-odds">
                              {apuesta.cuota}
                            </div>
                            <div className={`bet-profit ${apuesta.estat.toLowerCase()}`}>
                              {apuesta.estat === 'PENDIENTE' ? `€${gananciaReal}*` : `€${gananciaReal}`}
                              {apuesta.estat === 'PENDIENTE' && <div className="profit-note">*Potencial</div>}
                            </div>
                            <div 
                              className="bet-status" 
                              style={{ backgroundColor: getStatusColor(apuesta.estat) }}
                            >
                              <span className="status-icon">{getStatusIcon(apuesta.estat)}</span>
                              {apuesta.estat}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'estadisticas' && (
              <div className="estadisticas-content">
                {apostasHistorial.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📈</div>
                    <h3>Estadísticas no disponibles</h3>
                    <p>Realiza algunas apuestas para ver tus estadísticas detalladas</p>
                  </div>
                ) : (
                  <div className="stats-container">
                    <div className="stats-overview">
                      <div className="stat-card">
                        <h3>Resumen de Apuestas</h3>
                        <div className="stat-numbers">
                          <div>
                            <span className="stat-value">{apostasHistorial.length}</span>
                            <span className="stat-label">Total</span>
                          </div>
                          <div>
                            <span className="stat-value" style={{color: 'var(--success)'}}>{apuestasGanadas}</span>
                            <span className="stat-label">Ganadas</span>
                          </div>
                          <div>
                            <span className="stat-value" style={{color: 'var(--accent)'}}>{apuestasPerdidas}</span>
                            <span className="stat-label">Perdidas</span>
                          </div>
                          <div>
                            <span className="stat-value" style={{color: 'var(--pending)'}}>{apuestasPendientes}</span>
                            <span className="stat-label">Pendientes</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <h3>Rentabilidad</h3>
                        <div className="profit-stats">
                          <div>
                            <span className="stat-label">Ganancia Total</span>
                            <span className="stat-value">€{gananciaTotal.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="stat-label">Tasa de Acierto</span>
                            <span className="stat-value">{tasaAcierto}%</span>
                          </div>
                          <div>
                            <span className="stat-label">ROI</span>
                            <span 
                              className="stat-value" 
                              style={{color: gananciaTotal >= 0 ? 'var(--success)' : 'var(--accent)'}}
                            >
                              {apostasHistorial.length > 0 
                                ? `${(gananciaTotal / apostasHistorial.reduce((sum, a) => sum + a.cantidad, 0) * 100).toFixed(1)}%` 
                                : '0%'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="stats-charts">
                      <div className="stat-card">
                        <h3>Distribución de Apuestas</h3>
                        <div className="chart-container">
                          <div className="chart-bar">
                            <div 
                              className="bar-segment ganada" 
                              style={{width: `${(apuestasGanadas / apostasHistorial.length) * 100}%`}}
                            >
                              <span>Ganadas</span>
                            </div>
                            <div 
                              className="bar-segment perdida" 
                              style={{width: `${(apuestasPerdidas / apostasHistorial.length) * 100}%`}}
                            >
                              <span>Perdidas</span>
                            </div>
                            <div 
                              className="bar-segment pendiente" 
                              style={{width: `${(apuestasPendientes / apostasHistorial.length) * 100}%`}}
                            >
                              <span>Pendientes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <h3>Evolución de Ganancias</h3>
                        <div className="profit-graph">
                          {/* Gráfico simplificado con CSS */}
                          <div className="graph-line">
                            <div className="graph-point" style={{left: '10%', bottom: '30%'}}></div>
                            <div className="graph-point" style={{left: '30%', bottom: '45%'}}></div>
                            <div className="graph-point" style={{left: '50%', bottom: '60%'}}></div>
                            <div className="graph-point" style={{left: '70%', bottom: '75%'}}></div>
                            <div className="graph-point" style={{left: '90%', bottom: '90%'}}></div>
                          </div>
                          <div className="graph-labels">
                            <span>Inicio</span>
                            <span>Actual</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Sección de información adicional */}
        <section className="info-section">
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <div className="info-details">
                <h4>Apuestas Realizadas</h4>
                <span className="info-number">{apostasHistorial.length}</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">💰</div>
              <div className="info-details">
                <h4>Ganancia Total</h4>
                <span className="info-number">€{gananciaTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <div className="info-details">
                <h4>Tasa de Acierto</h4>
                <span className="info-number">{tasaAcierto}%</span>
              </div>
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
            <h4>MI CUENTA</h4>
            <ul>
              <li>Mis Apuestas</li>
              <li>Historial</li>
              <li>Estadísticas</li>
              <li>Configuración</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>SOPORTE</h4>
            <ul>
              <li>Centro de ayuda</li>
              <li>Contacto</li>
              <li>Preguntas frecuentes</li>
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

export default ApostesUsuari;