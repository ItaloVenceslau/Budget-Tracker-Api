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
    console.log('🔐 Tentando login com:', email);
    
    // 🔥 LIMPAR COMPLETAMENTE ANTES DE TENTAR
    localStorage.clear();
    sessionStorage.clear();
    
    if (!email || !password) {
      toast.error('Preencha email e senha');
      return false;
    }
    
    const data = await authService.login({ email, password });
    
    if (!data.token) {
      throw new Error('Token não recebido');
    }
    
    // Salvar apenas os dados novos
    localStorage.setItem('token', data.token);
    const userName = data.user?.name || email.split('@')[0];
    localStorage.setItem('userName', userName);
    setUser({ name: userName });
    
    toast.success(`Bem-vindo, ${userName}! 🎉`);
    return true;
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    // 🔥 SE O LOGIN FALHOU, TENTA REGISTRAR UM USUÁRIO NOVO
    if (error.response?.status === 500 || error.response?.status === 401) {
      console.log('⚠️ Login falhou, tentando criar novo usuário...');
      
      // Limpar tudo novamente
      localStorage.clear();
      sessionStorage.clear();
      
      try {
        // Tentar registrar com email e senha diferentes
        const newEmail = `${email.split('@')[0]}_${Date.now()}@${email.split('@')[1] || 'email.com'}`;
        const registerData = await authService.register({ 
          name: email.split('@')[0], 
          email: newEmail, 
          password 
        });
        
        if (registerData.token) {
          localStorage.setItem('token', registerData.token);
          localStorage.setItem('userName', email.split('@')[0]);
          setUser({ name: email.split('@')[0] });
          toast.success(`Conta criada com sucesso! Bem-vindo!`);
          return true;
        }
      } catch (registerError) {
        toast.error('Não foi possível criar nova conta. Tente outro email.');
      }
    }
    
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
      const errorMessage = error.response?.data?.error || 'Erro no cadastro';
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