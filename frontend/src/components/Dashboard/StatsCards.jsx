// frontend/src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiActivity } from 'react-icons/fi';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Budget Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: FiDollarSign,
      gradient: 'linear-gradient(135deg, #0070f3, #0060d0)',
    },
    {
      title: 'Total Gasto',
      value: `R$ ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: FiTrendingDown,
      gradient: 'linear-gradient(135deg, #f21361, #e00e5a)',
    },
    {
      title: 'Orçamento Restante',
      value: `R$ ${(stats?.remainingBudget || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      gradient: 'linear-gradient(135deg, #17c964, #14b55a)',
    },
    {
      title: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: FiActivity,
      gradient: 'linear-gradient(135deg, #7928ca, #6a20b5)',
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{card.title}</span>
            <div 
              className="stat-card-icon"
              style={{ background: card.gradient, color: 'white' }}
            >
              <card.icon size={18} />
            </div>
          </div>
          <div className="stat-card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
};