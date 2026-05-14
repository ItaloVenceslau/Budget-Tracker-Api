import axios from 'axios';

const api = axios.create({
  baseURL: "https://budget-tracker-api-production-7bcc.up.railway.app/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token (APENAS em rotas protegidas)
api.interceptors.request.use(
  (config) => {
    // 🔥 NÃO adicionar token nas rotas de autenticação
    if (config.url.includes('/auth/')) {
      console.log('🔓 Rota pública, sem token:', config.url);
      return config;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔐 Adicionando token para:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('⚠️ Sem token para rota protegida:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 Token expirado ou inválido, limpando...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar apenas se não estiver na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;