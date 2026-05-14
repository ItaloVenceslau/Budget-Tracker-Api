import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPlusCircle, FiBarChart2, FiFolder, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <span className="text-white text-lg">💰</span>
        </div>
        <h1>BudgetFlow</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/dashboard' && location.pathname === '/dashboard') ||
            (item.path === '/projects' && location.pathname.startsWith('/projects'));
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

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout">
          <FiLogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};