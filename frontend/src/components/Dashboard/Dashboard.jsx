// frontend/src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { StatsCards } from './StatsCards';
import { BudgetChart } from './BudgetChart';
import { ProjectList } from '../Projects/ProjectList';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
    <div>
      <div className="dashboard-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral dos seus projetos</p>
          </div>
          <Link to="/projects/new" className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Novo Projeto
          </Link>
        </div>
      </div>

      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <BudgetChart projects={projects} />
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Resumo Rápido</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Projetos totais</span>
              <span className="font-semibold text-gray-900">{projects.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Projetos concluídos</span>
              <span className="font-semibold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500 text-sm">Budget médio</span>
              <span className="font-semibold text-gray-900">
                {stats?.totalBudget && projects.length 
                  ? (stats.totalBudget / projects.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'R$ 0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="card-header mb-4">
          <h2 className="card-title">Seus Projetos</h2>
        </div>
        <ProjectList projects={projects} onRefresh={loadData} />
      </div>
    </div>
  );
};