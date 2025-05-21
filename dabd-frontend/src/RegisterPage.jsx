import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="header">
        <h1>Registro</h1>
      </header>

      <main className="main-content">
        <form className="auth-form">
          <input type="text" placeholder="Nombre completo" required />
          <input type="email" placeholder="Correo electrónico" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="secondary">Crear cuenta</button>
        </form>

        <p className="switch-text">
          ¿Ya tienes cuenta?{' '}
          <button className="link-button" onClick={() => navigate('/login')}>
            Inicia sesión
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
