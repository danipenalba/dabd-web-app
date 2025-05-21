import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // ⭐ Importante para que se guarde la cookie de sesión
        body: JSON.stringify({ dni }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al iniciar sesión.');
        return;
      }

      // Éxito → redirigir a la página principal
      navigate('/dashboard'); // Cambia esto al destino real tras login
    } catch (err) {
      console.error('Error al conectar con el backend:', err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Iniciar Sesión</h1>
      </header>

      <main className="main-content">
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>

        {error && <p className="error-message">{error}</p>}

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
