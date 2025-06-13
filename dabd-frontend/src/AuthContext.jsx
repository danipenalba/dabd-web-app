import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserSession, isUserAuthenticated, saveUserSession, clearUserSession } from './utils/authUtils';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar sesión al cargar la aplicación
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userData = getUserSession();
        const authenticated = isUserAuthenticated();
        
        if (authenticated && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función para hacer login
  const login = (userData) => {
    try {
      saveUserSession(userData);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error al hacer login:', error);
      return false;
    }
  };

  // Función para hacer logout
  const logout = () => {
    try {
      clearUserSession();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Error al hacer logout:', error);
      return false;
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      saveUserSession(updatedUser);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Función para obtener el saldo del usuario
  const getUserBalance = () => {
    return user ? user.saldo || 0 : 0;
  };

  const value = {
    // Estados
    user,
    isAuthenticated,
    loading,
    
    // Funciones
    login,
    logout,
    updateUser,
    hasRole,
    getUserBalance,
    
    // Datos específicos del usuario (shortcuts)
    userName: user?.nombre || '',
    userEmail: user?.email || '',
    userDNI: user?.dni || '',
    userBalance: user?.saldo || 0
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};