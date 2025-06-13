import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApostesUsuari.css';

function ApostesUsuari({ onNavigateToHome, onNavigateToMainPage }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('historial');

  // Datos de ejemplo para el historial (vacío por ahora)
  const [apostasHistorial] = useState([
    // Aquí irán las apuestas cuando se conecte al backend
  ]);

  const handleCreateBet = () => {
    // Aquí se navegará a la página de crear apuesta
    console.log('Crear nueva apuesta');
    // navigate('/crear-apuesta');
  };

  const handleBackToCompetitions = () => {
    if (onNavigateToMainPage) {
      onNavigateToMainPage();
    } else {
      navigate('/main');
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
            <div className="action-icon">
              ⚽
            </div>
            <div className="action-info">
              <h4>CREAR NUEVA APUESTA</h4>
              <span>Realiza una nueva predicción en cualquier competición</span>
            </div>
            <div className="action-arrow">
              →
            </div>
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
                {apostasHistorial.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      📊
                    </div>
                    <h3>No tienes apuestas registradas</h3>
                    <p>Cuando realices tu primera apuesta, aparecerá aquí tu historial completo</p>
                    <button className="create-first-bet-btn" onClick={handleCreateBet}>
                      Crear mi primera apuesta
                    </button>
                  </div>
                ) : (
                  <div className="bets-grid">
                    {/* Aquí se mostrarán las apuestas cuando haya datos */}
                    {apostasHistorial.map(apuesta => (
                      <div key={apuesta.id} className="bet-card">
                        {/* Contenido de la apuesta */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'estadisticas' && (
              <div className="estadisticas-content">
                <div className="empty-state">
                  <div className="empty-icon">
                    📈
                  </div>
                  <h3>Estadísticas no disponibles</h3>
                  <p>Realiza algunas apuestas para ver tus estadísticas detalladas</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sección de información adicional */}
        <section className="info-section">
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-icon">
                🎯
              </div>
              <div className="info-details">
                <h4>Apuestas Realizadas</h4>
                <span className="info-number">0</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                💰
              </div>
              <div className="info-details">
                <h4>Ganancia Total</h4>
                <span className="info-number">€0.00</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">
                📊
              </div>
              <div className="info-details">
                <h4>Tasa de Acierto</h4>
                <span className="info-number">--%</span>
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