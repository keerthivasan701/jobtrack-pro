import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('jobtrack_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('jobtrack_access_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('jobtrack_access_token');
    localStorage.removeItem('jobtrack_refresh_token');
    localStorage.removeItem('jobtrack_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUserProfile = useCallback(async () => {
    try {
      const res = await authApi.getProfile();
      setUser(res.data);
      localStorage.setItem('jobtrack_user', JSON.stringify(res.data));
    } catch {
      // If token expired or invalid, logout
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAuthLogout);

    const initAuth = async () => {
      const storedToken = localStorage.getItem('jobtrack_access_token');
      if (storedToken) {
        setToken(storedToken);
        await refreshUserProfile();
      }
      setLoading(false);
    };

    initAuth();

    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
    };
  }, [logout, refreshUserProfile]);

  const login = async (username, password) => {
    const response = await authApi.login({ username, password });
    const { access, refresh, user: loggedUser } = response.data;
    localStorage.setItem('jobtrack_access_token', access);
    localStorage.setItem('jobtrack_refresh_token', refresh);
    localStorage.setItem('jobtrack_user', JSON.stringify(loggedUser));
    setToken(access);
    setUser(loggedUser);
    return response.data;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const { tokens, user: newUser } = response.data;
    if (tokens) {
      localStorage.setItem('jobtrack_access_token', tokens.access);
      localStorage.setItem('jobtrack_refresh_token', tokens.refresh);
      localStorage.setItem('jobtrack_user', JSON.stringify(newUser));
      setToken(tokens.access);
      setUser(newUser);
    }
    return response.data;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('jobtrack_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
