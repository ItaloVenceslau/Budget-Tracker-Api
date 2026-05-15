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
    // console.log('1️⃣ AuthContext.login chamado com:', { email, password: password ? '***' : 'MISSING' });
    
    if (!email || !password) {
      console.error('❌ Email ou senha vazios');
      toast.error('Preencha email e senha');
      return false;
    }
    
    // console.log('2️⃣ Chamando authService.login...');
    const data = await authService.login({ email, password });
    
    // console.log('3️⃣ Dados recebidos do service:', data);
    
    if (!data || !data.token) {
      console.error('❌ Token não veio na resposta:', data);
      toast.error('Erro ao fazer login');
      return false;
    }
    
    // console.log('4️⃣ Salvando token no localStorage...');
    localStorage.setItem('token', data.token);
    
    const userName = data.user?.name || email.split('@')[0];
    localStorage.setItem('userName', userName);
    
    // console.log('5️⃣ Atualizando estado do usuário...');
    setUser({ name: userName });
    
    // console.log('6️⃣ Login completo! Redirecionando...');
    toast.success(`Bem-vindo, ${userName}! 🎉`);
    return true;
    
  } catch (error) {
    console.error('❌ ERRO COMPLETO:', error);
    console.error('❌ Response:', error.response?.data);
    toast.error(error.response?.data?.error || 'Erro no login');
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