// frontend/src/components/Dashboard/StatsCards.jsx
import React from 'react';
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiActivity } from 'react-icons/fi';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Budget Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: FiDollarSign,
    },
    {
      title: 'Total Gasto',
      value: `R$ ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: FiTrendingDown,
    },
    {
      title: 'Orçamento Restante',
      value: `R$ ${(stats?.remainingBudget || 0).toLocaleString()}`,
      icon: FiTrendingUp,
    },
    {
      title: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: FiActivity,
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{card.title}</span>
            <div className="stat-card-icon">
              <card.icon size={16} />
            </div>
          </div>
          <div className="stat-card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
};