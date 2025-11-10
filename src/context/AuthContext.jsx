import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosConfig';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    localStorage.getItem('access')
      ? jwtDecode(localStorage.getItem('access'))
      : null
  );

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem('access')
      ? {
          access: localStorage.getItem('access'),
          refresh: localStorage.getItem('refresh'),
        }
      : null
  );

  const [loading, setLoading] = useState(true);

  // Login
  const loginUser = useCallback(async (username, password) => {
    const response = await api.post('auth/token/', { username, password });
    if (response.status === 200) {
      const data = response.data;
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
    } else {
      throw new Error('Identifiants incorrects');
    }
  }, []);

  // Register
  const registerUser = useCallback(async (userData) => {
    const response = await api.post('auth/register/', userData);
    return response;
  }, []);

  // Logout
  const logoutUser = useCallback((redirect) => {
    setAuthTokens(null);
    setUser(null);
    localStorage.clear();
    if (redirect) redirect();
  }, []);

  // ✅ Fonction pour rafraîchir le token automatiquement
  const updateToken = useCallback(async () => {
    if (!authTokens?.refresh) return;

    try {
      const response = await api.post('auth/token/refresh/', {
        refresh: authTokens.refresh,
      });

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('access', data.access);
        if (data.refresh) localStorage.setItem('refresh', data.refresh);
      } else {
        logoutUser(); // token invalide ou expiré
      }
    } catch (error) {
      console.warn('Échec de la mise à jour du token, déconnexion...');
      logoutUser();
    }
  }, [authTokens, logoutUser]);

  // Rafraîchissement automatique toutes les 4 minutes
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, 1000 * 60 * 4); // toutes les 4 minutes

    return () => clearInterval(interval);
  }, [authTokens, updateToken, loading]);

  const contextData = useMemo(
    () => ({
      user,
      authTokens,
      loginUser,
      registerUser,
      logoutUser,
    }),
    [user, authTokens, loginUser, registerUser, logoutUser]
  );

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
