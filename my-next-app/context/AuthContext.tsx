'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Project } from '@/utils/api';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // ページ読み込み時にローカルストレージからトークンとユーザーを復元
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Login failed'
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
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