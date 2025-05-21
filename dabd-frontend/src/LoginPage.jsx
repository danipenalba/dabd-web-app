import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Usa tu mismo CSS

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <h1>Iniciar Sesión</h1>
      </header>

      <main className="main-content">
        <form className="auth-form">
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit">Entrar</button>
        </form>

        <p className="switch-text">
          ¿No tienes cuenta?{' '}
          <button className="link-button" onClick={() => navigate('/register')}>
            Regístrate aquí
          </button>
        </p>

        <div className="button-group" style={{ marginTop: '20px' }}>
          <button className="secondary" onClick={() => navigate('/')}>
            Volver al Inicio
          </button>
        </div>
      </main>

      <footer className="footer">© 2025 Tu Empresa</footer>
    </div>
  );
}
