import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('privacy_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        console.error('Erro no login:', res.statusText);
        return false;
      }

      const data = await res.json();
      const { token, user } = data;

      if (!token || !user) return false;

      localStorage.setItem('privacy_session', JSON.stringify(user));
      localStorage.setItem('privacy_token', token);
      setUser(user);

      return true;
    } catch (err) {
      console.error('Erro de conexão no login:', err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!res.ok) {
        console.error('Erro no cadastro:', res.statusText);
        return false;
      }

      const data = await res.json();
      const { token, user } = data;

      if (!token || !user) return false;

      localStorage.setItem('privacy_session', JSON.stringify(user));
      localStorage.setItem('privacy_token', token);
      setUser(user);

      return true;
    } catch (err) {
      console.error('Erro de conexão no cadastro:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('privacy_session');
    localStorage.removeItem('privacy_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
