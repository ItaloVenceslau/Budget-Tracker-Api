import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          <FiUserPlus size={28} />
        </div>
        <h1 className="auth-title">Criar Conta</h1>
        <p className="auth-subtitle">Comece a gerenciar seus projetos</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <FiUser className="auth-input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
              placeholder="Nome completo"
              required
              minLength={3}
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-input-group">
            <FiLock className="auth-input-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              placeholder="Senha (mínimo 6 caracteres)"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-footer">
          Já tem uma conta?{' '}
          <Link to="/login" className="auth-link">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};