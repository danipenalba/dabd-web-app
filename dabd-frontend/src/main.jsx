import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx'; // Página principal
import Register from './Register.jsx'; // Página de registro
import Login from './Login.jsx'; // Página de registro
import UserProfile from './UserProfile.jsx'; // Página de perfil
import './index.css'; // Si tienes estilos globales


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserProfile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
