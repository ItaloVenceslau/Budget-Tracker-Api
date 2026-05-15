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
      // Limpar dados antigos
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      
      console.log('Tentando login com:', email);
      const data = await authService.login({ email, password });
      
      console.log('Resposta do login:', data);
      
      if (!data.token) {
        throw new Error('Token não recebido do servidor');
      }
      
      // Salvar token
      localStorage.setItem('token', data.token);
      
      // Salvar nome do usuário
      const userName = data.user?.name || email.split('@')[0];
      localStorage.setItem('userName', userName);
      
      setUser({ name: userName });
      
      toast.success(`Bem-vindo, ${userName}! 🎉`);
      return true;
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message ||
                          'Erro no login. Tente novamente.';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      
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
      const errorMessage = error.response?.data?.error || 'Erro no cadastro';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user'); // 🔥 ADICIONE
    sessionStorage.clear(); // 🔥 ADICIONE
    setUser(null);
    toast.success('Logout realizado! 👋');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};