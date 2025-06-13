// authUtils.js - Utilidades para manejar la autenticación y persistencia de sesión

/**
 * Guarda los datos del usuario en localStorage
 * @param {Object} userData - Datos del usuario
 */
export const saveUserSession = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('loginTime', new Date().getTime().toString());
};

/**
 * Obtiene los datos del usuario desde localStorage
 * @returns {Object|null} - Datos del usuario o null si no existe
 */
export const getUserSession = () => {
  try {
    const user = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (user && isLoggedIn === 'true') {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error('Error al obtener la sesión del usuario:', error);
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si está autenticado, false en caso contrario
 */
export const isUserAuthenticated = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const user = localStorage.getItem('user');
  
  // Verificar si la sesión ha expirado (opcional: 24 horas)
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parseInt(loginTime);
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    // Si han pasado más de 24 horas, cerrar sesión automáticamente
    if (hoursDiff > 24) {
      clearUserSession();
      return false;
    }
  }
  
  return isLoggedIn === 'true' && user !== null;
};

/**
 * Limpia la sesión del usuario (logout)
 */
export const clearUserSession = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('loginTime');
};

/**
 * Hook personalizado para manejar la autenticación en componentes React
 * @returns {Object} - Objeto con datos del usuario y funciones de autenticación
 */
export const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const userData = getUserSession();
    const authenticated = isUserAuthenticated();
    
    setUser(userData);
    setIsAuthenticated(authenticated);
  }, []);

  const login = (userData) => {
    saveUserSession(userData);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
};

/**
 * Verifica la validez del token con el backend (opcional)
 * @returns {Promise<boolean>} - true si el token es válido
 */
export const verifyTokenWithBackend = async () => {
  try {
    const response = await fetch('http://localhost:5000/verify-token', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return false;
  }
};