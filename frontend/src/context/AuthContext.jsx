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
    
    if (!email || !password) {
      toast.error('Preencha email e senha');
      return false;
    }
    
    try {
      const data = await authService.login({ email, password });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        const userName = data.user?.name || email.split('@')[0];
        localStorage.setItem('userName', userName);
        setUser({ name: userName });
        toast.success(`Bem-vindo, ${userName}! 🎉`);
        return true;
      }
    } catch (loginError) {
      // 🔥 SE O LOGIN FALHOU COM ERRO 500, TENTA RECRIAR O USUÁRIO
      if (loginError.response?.status === 500) {
        console.log('⚠️ Usuário corrompido detectado. Tentando recriar...');
        
        // Tenta registrar o mesmo usuário (vai falhar se já existir)
        try {
          const registerData = await authService.register({ 
            name: email.split('@')[0], 
            email, 
            password 
          });
          
          if (registerData.token) {
            localStorage.setItem('token', registerData.token);
            localStorage.setItem('userName', email.split('@')[0]);
            setUser({ name: email.split('@')[0] });
            toast.success('Conta recriada com sucesso!');
            return true;
          }
        } catch (registerError) {
          // Se não conseguiu registrar (usuário já existe), tenta atualizar a senha
          console.log('⚠️ Usuário existe, tentando redefinir senha...');
          
          const resetResponse = await fetch('https://budget-tracker-api-production-7bcc.up.railway.app/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          
          const resetData = await resetResponse.json();
          
          if (resetData.token) {
            localStorage.setItem('token', resetData.token);
            localStorage.setItem('userName', email.split('@')[0]);
            setUser({ name: email.split('@')[0] });
            toast.success('Senha redefinida! Login realizado.');
            return true;
          }
        }
      }
      
      throw loginError;
    }
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    const errorMessage = error.response?.data?.error || 'Erro no login';
    toast.error(errorMessage);
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