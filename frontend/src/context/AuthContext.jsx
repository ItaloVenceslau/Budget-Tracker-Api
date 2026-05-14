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
      // Token existe mas não tem dados do usuário
      console.log('⚠️ Token encontrado sem dados do usuário');
      // Opcional: buscar dados do usuário do backend
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // 🔥 LIMPAR TOKEN ANTIGO ANTES DE LOGAR
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('🔐 Enviando requisição de login...');
      const data = await authService.login({ email, password });
      
      if (!data.token) {
        throw new Error('Token não recebido');
      }
      
      // Salvar token e dados do usuário
      authService.setToken(data.token);
      authService.setUser({ email, name: data.user?.name || email.split('@')[0] });
      setUser({ email });
      
      toast.success('Login realizado com sucesso!');
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
      // 🔥 LIMPAR TOKEN ANTIGO ANTES DE REGISTRAR
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('📝 Enviando requisição de registro...');
      const data = await authService.register({ name, email, password });
      
      if (!data.token) {
        throw new Error('Token não recebido');
      }
      
      // Salvar token e dados do usuário
      authService.setToken(data.token);
      authService.setUser({ name, email });
      setUser({ email, name });
      
      toast.success('Conta criada com sucesso!');
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
    toast.success('Logout realizado');
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