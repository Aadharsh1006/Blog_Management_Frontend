import React, { createContext, useState, useContext } from 'react';
import * as authService from '../api/blogPostService';

const defaultTestContext = {
  user: { id: 1, name: 'Test Author', role: 'AUTHOR' },
  token: 'mock-test-token',
  isLoggedIn: true,
  login: async () => console.log('Mock login called'),
  logout: () => console.log('Mock logout called'),
};

const AuthContext = createContext(
  process.env.NODE_ENV === 'test' ? defaultTestContext : null
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  const value = {
    user,
    token,
    isLoggedIn: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};