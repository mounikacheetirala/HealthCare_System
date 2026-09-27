import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);
const SESSION_KEY = 'meridian_health_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  async function login({ email, password, role, remember }) {
    const res = await api.login({ email, password, role });
    if (res.ok) {
      setUser(res.user);
      if (remember) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
      }
    }
    return res;
  }

  async function register(payload) {
    const res = await api.register(payload);
    if (res.ok) {
      setUser(res.user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(res.user));
    }
    return res;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
