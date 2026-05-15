// frontend/src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export const Login = () => {

  console.log('🔐 Login chamado com:', { email, password: password ? '***' : 'UNDEFINED' });
    
  if (!email || !password) {
    console.error('❌ Email ou senha vazios');
    toast.error('Preencha email e senha');
    return false;
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📤 Enviando login:', { email, password }); // ← ADICIONE
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };


  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-scale">
        <div className="auth-icon">
          <FiLogIn className="w-6 h-6 text-white" />
        </div>
        <h1 className="auth-title">Budget Tracker</h1>
        <p className="auth-subtitle">Gerencie seus projetos financeiros</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-9"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-9"
                placeholder="••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5"
          >
            {loading ? (
              <div className="loading-spinner w-5 h-5 border-2 border-white border-t-transparent" />
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};