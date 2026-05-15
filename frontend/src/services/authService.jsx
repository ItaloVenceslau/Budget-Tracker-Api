import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há token salvo ao carregar
    const token = authService.getToken();
    const savedUser = authService.getUser();
    
    if (token && savedUser) {
      console.log('🔄 Usuário já autenticado:', savedUser.email);
      setUser(savedUser);
    } else if (token && !savedUser) {
      console.log('⚠️ Token encontrado sem dados do usuário');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Limpar dados antigos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      
      console.log('🔐 Enviando requisição de login...');
      const data = await authService.login({ email, password });
      
      if (!data.token) {
        throw new Error('Token não recebido');
      }
      
      // Salvar token
      authService.setToken(data.token);
      
      // Salvar dados do usuário
      const userName = data.user?.name || email.split('@')[0];
      const userData = { 
        email, 
        name: userName,
        id: data.user?.id 
      };
      
      authService.setUser(userData);
      localStorage.setItem('userName', userName);
      
      setUser(userData);
      
      toast.success(`Bem-vindo, ${userName}! 🎉`);
      console.log('✅ Login concluído');
      return true;
    } catch (error) {
      console.error('❌ Erro detalhado no login:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro no login';
      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Limpar dados antigos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      
      console.log('📝 Enviando requisição de registro...');
      const data = await authService.register({ name, email, password });
      
      if (!data.token) {
        throw new Error('Token não recebido');
      }
      
      // Salvar token
      authService.setToken(data.token);
      
      // Salvar dados do usuário
      const userData = { 
        email, 
        name: name,
        id: data.user?.id 
      };
      
      authService.setUser(userData);
      localStorage.setItem('userName', name);
      
      setUser(userData);
      
      toast.success(`Conta criada com sucesso! Bem-vindo, ${name}! 🎉`);
      console.log('✅ Registro concluído');
      return true;
    } catch (error) {
      console.error('❌ Erro detalhado no registro:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erro no cadastro';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Executando logout...');
    authService.logout();
    setUser(null);
    toast.success('Logout realizado. Até mais! 👋');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user || authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};