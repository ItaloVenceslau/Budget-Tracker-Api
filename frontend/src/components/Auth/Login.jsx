// frontend/src/components/Auth/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiLogIn className="w-5 h-5 text-white" />
          </div>
          <h1 className="auth-title">Budget Tracker</h1>
          <p className="auth-subtitle">Gerencie seus projetos financeiros</p>
        </div>

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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-gray-900 font-medium hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};