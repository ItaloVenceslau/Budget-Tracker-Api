import React from 'react';
import { FiDollarSign, FiTrendingDown, FiTrendingUp, FiActivity } from 'react-icons/fi';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Budget Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: FiDollarSign,
      gradient: 'stat-card-1'
    },
    {
      title: 'Total Gasto',
      value: `R$ ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: FiTrendingDown,
      gradient: 'stat-card-2'
    },
    {
      title: 'Orçamento Restante',
      value: `R$ ${(stats?.remainingBudget || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      gradient: 'stat-card-3'
    },
    {
      title: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: FiActivity,
      gradient: 'stat-card-4'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className={`stat-card ${card.gradient}`}>
          <div className="stat-card-header">
            <span className="stat-card-title">{card.title}</span>
            <div className="stat-card-icon">
              <card.icon size={18} />
            </div>
          </div>
          <div className="stat-card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
};