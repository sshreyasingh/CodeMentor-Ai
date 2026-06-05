import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const retries = useRef(0);
  const maxRetries = 3;

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setLoading(false);
      retries.current = 0;
    } catch (err) {
      // After OAuth redirect, the session cookie may not be fully
      // set yet — retry a few times before giving up
      if (retries.current < maxRetries) {
        retries.current++;
        setTimeout(fetchUser, 1000);
        return;
      }
      setUser(null);
      setLoading(false);
      retries.current = 0;
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    await api.post('/auth/logout');
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
