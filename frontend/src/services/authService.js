import api from './api';

export const authService = {
  register: async (userData) => {
    try {
      console.log('📝 Registrando usuário:', userData.email);
      const response = await api.post('/auth/register', userData);
      console.log('✅ Registro bem-sucedido');
      return response.data;
    } catch (error) {
      console.error('❌ Erro no registro:', error.response?.data);
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      console.log('🔐 Tentando login:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login bem-sucedido');
      return response.data;
    } catch (error) {
      console.error('❌ Erro no login:', error.response?.data);
      throw error;
    }
  },
  
  logout: () => {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    sessionStorage.clear();
  },
  
  getToken: () => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token atual:', token ? `${token.substring(0, 20)}...` : 'nenhum');
    return token;
  },
  
  setToken: (token) => {
    console.log('💾 Salvando token...');
    localStorage.setItem('token', token);
  },
  
  setUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};