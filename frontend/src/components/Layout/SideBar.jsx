import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPlusCircle, FiBarChart2, FiCalendar, FiFolder } from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/projects', icon: FiFolder, label: 'Projetos' },
  { path: '/projects/new', icon: FiPlusCircle, label: 'Novo Projeto' },
  { path: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { path: '/calendar', icon: FiCalendar, label: 'Calendário' },
];

export const Sidebar = () => {
  const location = useLocation();

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
            (item.path === '/dashboard' && location.pathname === '/dashboard');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};