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
      // 🔥 VALIDAÇÃO FORTE ANTES DE ENVIAR
      if (!email || typeof email !== 'string') {
        console.error('❌ Email inválido:', email);
        toast.error('Email inválido');
        return false;
      }
      
      if (!password || typeof password !== 'string') {
        console.error('❌ Senha inválida:', password);
        toast.error('Senha inválida');
        return false;
      }
      
      if (password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres');
        return false;
      }
      
      email = email.trim().toLowerCase();
      
      console.log('🔐 Tentando login com:', email);
      console.log('🔐 Senha tem', password.length, 'caracteres');
      
      const data = await authService.login({ email, password });
      
      if (!data || !data.token) {
        throw new Error('Token não recebido');
      }
      
      localStorage.setItem('token', data.token);
      
      const userName = data.user?.name || email.split('@')[0];
      localStorage.setItem('userName', userName);
      
      setUser({ name: userName });
      
      toast.success(`Bem-vindo, ${userName}! 🎉`);
      return true;
      
    } catch (error) {
      console.error('❌ Erro detalhado no login:', error);
      
      // 🔥 TRATAMENTO DO ERRO 500
      let errorMessage = 'Erro no login. Tente novamente.';
      
      if (error.response?.status === 500) {
        errorMessage = 'Erro no servidor. Seu usuário pode estar corrompido. Tente criar uma nova conta.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast.error(errorMessage);
      return false;
    }
  }
};