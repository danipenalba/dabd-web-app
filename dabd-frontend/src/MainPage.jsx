import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

// Importar imágenes de competiciones
import laligaImg from './images/laliga.png';
import premierImg from './images/premier.png';
import ligue1Img from './images/ligue1.png';
import serieaImg from './images/seria.png';
import bundesligaImg from './images/bundesliga.png';
import copaReyImg from './images/coparey.png';
import facupImg from './images/facup.png';
import coupefranceImg from './images/coupefrance.png';
import coppaitaliaImg from './images/coppaitalia.png';
import dfbpokalImg from './images/dfbpokal.jpg';
import superligaImg from './images/superliga.png';

function MainPage({ onNavigateToHome }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar el componente
  useEffect(() => {
    const verifySession = async () => {
      try {
        // 1. Verificar sessionStorage primero
        const storedUser = sessionStorage.getItem('userData');
        
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setIsLoading(false);
          return;
        }

        // 2. Si no hay en sessionStorage, verificar con el backend
        const response = await fetch('http://localhost:5000/verify-session', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('userData', JSON.stringify(data.user));
          setUserData(data.user);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  const competitions = [
    // Ligas Nacionales
    {
      id: 'laliga',
      name: 'LaLiga',
      country: 'España',
      type: 'Liga Nacional',
      image: laligaImg
    },
    {
      id: 'premier',
      name: 'Premier League',
      country: 'Inglaterra',
      type: 'Liga Nacional',
      image: premierImg
    },
    {
      id: 'ligue1',
      name: 'Ligue 1',
      country: 'Francia',
      type: 'Liga Nacional',
      image: ligue1Img
    },
    {
      id: 'seriea',
      name: 'Serie A',
      country: 'Italia',
      type: 'Liga Nacional',
      image: serieaImg
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: 'Alemania',
      type: 'Liga Nacional',
      image: bundesligaImg
    },
    // Copas Nacionales
    {
      id: 'coparey',
      name: 'Copa del Rey',
      country: 'España',
      type: 'Copa Nacional',
      image: copaReyImg
    },
    {
      id: 'facup',
      name: 'FA Cup',
      country: 'Inglaterra',
      type: 'Copa Nacional',
      image: facupImg
    },
    {
      id: 'coupe',
      name: 'Coupe de France',
      country: 'Francia',
      type: 'Copa Nacional',
      image: coupefranceImg
    },
    {
      id: 'coppa',
      name: 'Coppa Italia',
      country: 'Italia',
      type: 'Copa Nacional',
      image: coppaitaliaImg
    },
    {
      id: 'dfb',
      name: 'DFB-Pokal',
      country: 'Alemania',
      type: 'Copa Nacional',
      image: dfbpokalImg
    },
    // Superliga Europea
    {
      id: 'superliga',
      name: 'Superliga Europea',
      country: 'Europa',
      type: 'Competición Internacional',
      image: superligaImg
    }
  ];

  const handleCompetitionClick = (competitionId) => {
    navigate(`/${competitionId}`);
  };

  const handleMyBetsClick = () => {
    navigate('/apostesusuari');
  };

  const handleProfileClick = () => {
    navigate('/UserProfile');
  };

  const handleLogout = async () => {
    try {
      // 1. Cerrar sesión en el backend
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      // 2. Limpiar el frontend
      sessionStorage.removeItem('userData');
      setUserData(null);
      
      // 3. Redirigir al home
      onNavigateToHome();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="mainpage-container">
      {/* Barra de navegación superior */}
      <nav className="navbar">
      <div className="logo" onClick={() => navigate('/main')} style={{ cursor: 'pointer' }}>
  EUROBET
</div>

        <div className="user-nav-section">
         
          <div className="nav-buttons">
            <button className="profile-btn" onClick={handleProfileClick}>
              <i className="fas fa-user-circle"></i> Mi Perfil
            </button>
            <button className="my-bets-btn" onClick={handleMyBetsClick}>
              <i className="fas fa-ticket-alt"></i> Mis Apuestas
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>BIENVENIDO A EUROBET</h1>
          <h2>Selecciona una competición para comenzar a apostar</h2>
        </div>

        {/* Sección de Partidos */}
        <section className="competitions-section">
          <div className="section-header">
            <h3>COMPETICIONES DISPONIBLES</h3>
          </div>

          {/* Ligas Nacionales */}
          <div className="competition-category">
            <h4>LIGAS NACIONALES</h4>
            <div className="competitions-grid">
              {competitions.filter(comp => comp.type === 'Liga Nacional').map(competition => (
                <div 
                  key={competition.id} 
                  className="competition-card"
                  onClick={() => handleCompetitionClick(competition.id)}
                >
                  <div className="competition-image">
                    <img src={competition.image} alt={competition.name} />
                  </div>
                  <div className="competition-info">
                    <h5>{competition.name}</h5>
                    <span>{competition.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Copas Nacionales */}
          <div className="competition-category">
            <h4>COPAS NACIONALES</h4>
            <div className="competitions-grid">
              {competitions.filter(comp => comp.type === 'Copa Nacional').map(competition => (
                <div 
                  key={competition.id} 
                  className="competition-card"
                  onClick={() => handleCompetitionClick(competition.id)}
                >
                  <div className="competition-image">
                    <img src={competition.image} alt={competition.name} />
                  </div>
                  <div className="competition-info">
                    <h5>{competition.name}</h5>
                    <span>{competition.country}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Superliga Europea */}
          <div className="competition-category">
            <h4>COMPETICIÓN INTERNACIONAL</h4>
            <div className="competitions-grid single-competition">
              {competitions.filter(comp => comp.type === 'Competición Internacional').map(competition => (
                <div 
                  key={competition.id} 
                  className="competition-card superliga-card"
                  onClick={() => handleCompetitionClick(competition.id)}
                >
                  <div className="competition-image">
                    <img src={competition.image} alt={competition.name} />
                  </div>
                  <div className="competition-info">
                    <h5>{competition.name}</h5>
                    <span>15 mejores equipos europeos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección Mis Apuestas - Acceso rápido */}
        <section className="quick-access-section">
          <div className="quick-access-card" onClick={handleMyBetsClick}>
            <div className="quick-access-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="quick-access-info">
              <h4>MIS APUESTAS</h4>
              <span>Consulta tus apuestas activas y historial</span>
            </div>
            <div className="quick-access-arrow">
              <i className="fas fa-chevron-right"></i>
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

export default MainPage;