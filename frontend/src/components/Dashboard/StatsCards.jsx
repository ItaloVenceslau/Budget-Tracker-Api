import React from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Budget Total',
      value: `R$ ${(stats?.totalBudget || 0).toLocaleString()}`,
      icon: FiDollarSign,
      trend: '+12%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Total Gasto',
      value: `R$ ${(stats?.totalSpent || 0).toLocaleString()}`,
      icon: FiTrendingDown,
      trend: '+5%',
      trendUp: false,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Orçamento Restante',
      value: `R$ ${(stats?.remainingBudget || 0).toLocaleString()}`,
      icon: FiTrendingUp,
      trend: '+8%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: FiActivity,
      trend: '+3%',
      trendUp: true,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="stats-grid"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="stat-card"
        >
          <div className="stat-card-header">
            <span className="stat-card-title">{card.title}</span>
            <div className="stat-card-icon" style={{ background: card.gradient }}>
              <card.icon size={24} color="white" />
            </div>
          </div>
          <div className="stat-card-value">{card.value}</div>
          <div className="stat-card-trend">
            {card.trendUp ? (
              <span className="trend-up">
                <FiArrowUp size={14} /> {card.trend}
              </span>
            ) : (
              <span className="trend-down">
                <FiArrowDown size={14} /> {card.trend}
              </span>
            )}
            <span className="text-gray-400 text-xs">vs mês anterior</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};