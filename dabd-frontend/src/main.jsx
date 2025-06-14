import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // Página principal
import Register from './Register.jsx'; // Página de registro
import Login from './Login.jsx'; // Página de registro
import UserProfile from './UserProfile.jsx'; // Página de perfil
import './index.css'; // Si tienes estilos globales
import MainPage from './MainPage.jsx'; // Importa la nueva página
import CompetitionDetail from './CompetitionDetail'; // Importa la nueva página
import LaLigaPage from './LaLigaPage.jsx';
import PremierPage from './PremierPage.jsx';
import Ligue1 from './Ligue1.jsx';
import Seriea from './Seriea.jsx';
import Bundesliga from './Bundesliga.jsx';
import Coparey from './Copadelrey.jsx';
import FaCup from './FAcup.jsx';
import Coupe from './Coupefrance.jsx';
import Coppa from './Coppaitalia.jsx';
import DFB from './DFBPokal.jsx';
import Super from './Superliga.jsx';
import Apostes from './ApostesUsuari.jsx';
import Crear from './crearAposta.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<MainPage />} /> 
        <Route path="/competition/" element={<CompetitionDetail />} /> 
        <Route path="/laliga" element={<LaLigaPage />} /> 
        <Route path="/premier" element={<PremierPage />} /> 
        <Route path="/ligue1" element={<Ligue1 />} /> 
        <Route path="/bundesliga" element={<Bundesliga />} /> 
        <Route path="/coparey" element={<Coparey />} /> 
        <Route path="/facup" element={<FaCup />} /> 
        <Route path="/coupe" element={<Coupe />} /> 
        <Route path="/coppa" element={<Coppa />} /> 
        <Route path="/dfb" element={<DFB />} /> 
        <Route path="/seriea" element={<Seriea />} /> 
        <Route path="/superliga" element={<Super />} /> 
        <Route path="/apostesusuari" element={<Apostes />} /> 
        <Route path="/crearaposta" element={<Crear />} /> 

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);