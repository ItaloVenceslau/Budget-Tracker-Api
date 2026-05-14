import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { StatsCards } from './StatsCards';
import { BudgetChart } from './BudgetChart';
import { ProjectList } from '../Projects/ProjectList';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, statsData] = await Promise.all([
        projectService.getAll(),
        projectService.getStats()
      ]);
      setProjects(projectsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral dos seus projetos</p>
      </div>

      <div className="flex justify-end mb-8">
        <Link to="/projects/new" className="btn-new-project">
          <FiPlus size={18} /> Novo Projeto
        </Link>
      </div>

      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <BudgetChart projects={projects} />
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Resumo Rápido</h2>
          </div>
          <div className="summary-item">
            <span className="summary-label">Projetos totais</span>
            <span className="summary-value">{projects.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Projetos concluídos</span>
            <span className="summary-value highlight">
              {projects.filter(p => p.status === 'completed').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Budget médio</span>
            <span className="summary-value highlight">
              {stats?.totalBudget && projects.length 
                ? (stats.totalBudget / projects.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : 'R$ 0'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Seus Projetos</h2>
        </div>
        <ProjectList projects={projects} onRefresh={loadData} />
      </div>
    </motion.div>
  );
};