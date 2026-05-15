import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPlusCircle, FiBarChart2, FiFolder, FiLogOut, FiUser } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/projects', icon: FiFolder, label: 'Projetos' },
    { path: '/projects/new', icon: FiPlusCircle, label: 'Novo Projeto' },
    { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Pegar o nome do usuário do contexto ou do localStorage
  const userName = user?.name || localStorage.getItem('userName') || 'Usuário';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FiUser size={20} />
        </div>
        <div>
          <h1>Olá,</h1>
          <p className="sidebar-user-name">{userName}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/projects' && location.pathname.startsWith('/projects')) ||
            (item.path === '/dashboard' && location.pathname === '/dashboard');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        <FiLogOut size={18} />
        <span>Sair</span>
      </button>
    </aside>
  );
};