import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'codementor_token';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (token) => {
    try {
      // Explicitly pass token on first load to avoid race conditions
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
      const { data } = await api.get('/auth/me', config);
      setUser(data.user);
      console.log('[Auth] User fetched successfully:', data.user?.name);
    } catch (err) {
      console.error('[Auth] Fetch user failed:', err.response?.status, err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Extract token from URL hash (set by backend after OAuth redirect)
    const hash = window.location.hash;
    let newToken = null;

    if (hash.startsWith('#token=')) {
      newToken = hash.substring(7);
      setStoredToken(newToken);
      console.log('[Auth] Token extracted from URL hash');
      // Clean the hash from URL without reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Use new token if just extracted, otherwise check localStorage
    const token = newToken || getStoredToken();
    console.log('[Auth] Has token in storage:', !!token);

    fetchUser(token);
  }, [fetchUser]);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
