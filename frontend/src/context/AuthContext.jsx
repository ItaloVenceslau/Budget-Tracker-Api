import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUserName = localStorage.getItem('userName');
    
    if (token && savedUserName) {
      setUser({ name: savedUserName });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
  try {
    const data = await authService.login({ email, password });
    // ... resto
  } catch (error) {
    // APENAS MOSTRA ERRO - NÃO TENTA RESETAR
    toast.error('Email ou senha inválidos');
    return false;
  }
};

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      
      if (!data.token) {
        throw new Error('Token não recebido');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', name);
      
      setUser({ name: name });
      
      toast.success(`Conta criada! Bem-vindo, ${name}! 🎉`);
      return true;
    } catch (error) {
      let errorMessage = 'Erro no cadastro';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.error || 'Usuário já existe';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    toast.success('Logout realizado! 👋');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};