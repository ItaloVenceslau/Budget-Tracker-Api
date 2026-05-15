import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiTrendingUp, FiDollarSign, FiPieChart, FiCalendar } from 'react-icons/fi';

export const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await projectService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="analytics-container">
      <div className="dashboard-header">
        <h1>Analytics</h1>
        <p>Insights e estatísticas dos seus projetos</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-card-icon purple">
            <FiDollarSign size={24} />
          </div>
          <div className="analytics-card-content">
            <span className="analytics-card-label">Budget Total</span>
            <span className="analytics-card-value">
              R$ {(stats?.totalBudget || 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon pink">
            <FiTrendingUp size={24} />
          </div>
          <div className="analytics-card-content">
            <span className="analytics-card-label">Total Gasto</span>
            <span className="analytics-card-value">
              R$ {(stats?.totalSpent || 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon green">
            <FiPieChart size={24} />
          </div>
          <div className="analytics-card-content">
            <span className="analytics-card-label">Orçamento Restante</span>
            <span className="analytics-card-value">
              R$ {(stats?.remainingBudget || 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-icon blue">
            <FiCalendar size={24} />
          </div>
          <div className="analytics-card-content">
            <span className="analytics-card-label">Projetos Ativos</span>
            <span className="analytics-card-value">{stats?.activeProjects || 0}</span>
          </div>
        </div>
      </div>

      <div className="analytics-features">
        <h3 className="analytics-features-title">Em breve</h3>
        <div className="analytics-features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Gráficos de Gastos</h4>
            <p>Visualize seus gastos por categoria</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h4>Tendências Mensais</h4>
            <p>Acompanhe sua evolução financeira</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h4>Metas Personalizadas</h4>
            <p>Defina e acompanhe suas metas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📑</div>
            <h4>Relatórios PDF</h4>
            <p>Exporte relatórios completos</p>
          </div>
        </div>
      </div>
    </div>
  );
};