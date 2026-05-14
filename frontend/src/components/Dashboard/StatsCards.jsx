import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Budget Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: FiDollarSign,
      trend: '+12%',
      trendUp: true,
      color: '#0ea5e9'
    },
    {
      title: 'Total Gasto',
      value: `R$ ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: FiTrendingDown,
      trend: '+5%',
      trendUp: false,
      color: '#ef4444'
    },
    {
      title: 'Orçamento Restante',
      value: `R$ ${(stats?.remainingBudget || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      trend: '+8%',
      trendUp: true,
      color: '#10b981'
    },
    {
      title: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: FiActivity,
      trend: '+3%',
      trendUp: true,
      color: '#d946ef'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">{card.title}</span>
            <div className="stat-card-icon" style={{ background: `linear-gradient(135deg, ${card.color}15, ${card.color}08)` }}>
              <card.icon size={20} style={{ color: card.color }} />
            </div>
          </div>
          <div className="stat-card-value">{card.value}</div>
          <div className="stat-card-trend">
            {card.trendUp ? <FiArrowUp size={14} className="trend-up" /> : <FiArrowDown size={14} className="trend-down" />}
            <span className={card.trendUp ? 'trend-up' : 'trend-down'}>{card.trend}</span>
            <span className="text-gray-400 text-xs ml-2">vs mês anterior</span>
          </div>
        </div>
      ))}
    </div>
  );
};