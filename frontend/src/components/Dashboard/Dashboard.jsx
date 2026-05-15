import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { StatsCards } from './StatsCards';
import { BudgetChart } from './BudgetChart';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiPlus, FiFolder } from 'react-icons/fi';

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
      console.log('Projetos carregados:', projectsData);
      setProjects(projectsData || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral dos seus projetos</p>
      </div>

      {/* Botão Novo Projeto */}
      <div className="flex justify-end mb-8">
        <Link to="/projects/new" className="btn-new-project">
          <FiPlus size={18} /> Novo Projeto
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      {/* Charts e Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <BudgetChart projects={projects} />
        
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Resumo Rápido</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500">Projetos totais</span>
              <span className="font-bold text-2xl text-indigo-600">{projects.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500">Projetos concluídos</span>
              <span className="font-bold text-2xl text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-500">Projetos ativos</span>
              <span className="font-bold text-2xl text-blue-600">
                {projects.filter(p => p.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Budget médio</span>
              <span className="font-bold text-lg text-purple-600">
                {projects.length > 0 
                  ? (projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : 'R$ 0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Seus Projetos</h2>
          <Link to="/projects" className="text-indigo-600 hover:text-indigo-700 text-sm">
            Ver todos →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <h3 className="empty-state-title">Nenhum projeto ainda</h3>
            <p className="empty-state-description">
              Clique no botão "Novo Projeto" para começar
            </p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.slice(0, 6).map((project) => (
              <Link key={project._id} to={`/projects/${project._id}`} className="project-card">
                <div className="project-card-icon">
                  <FiFolder size={24} />
                </div>
                <h3 className="project-card-title">{project.name}</h3>
                <p className="project-card-description">
                  {project.description?.substring(0, 60) || 'Sem descrição'}
                </p>
                <div className="project-card-footer">
                  <span className="project-card-budget">
                    R$ {(project.budget || 0).toLocaleString()}
                  </span>
                  <span className={`project-card-status status-${project.status || 'planning'}`}>
                    {project.status === 'active' ? 'Ativo' : 
                     project.status === 'planning' ? 'Planejamento' :
                     project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                </div>
                <div className="project-card-progress">
                  <div 
                    className="project-card-progress-bar" 
                    style={{ 
                      width: `${Math.min(((project.spent || 0) / (project.budget || 1)) * 100, 100)}%`,
                      background: `linear-gradient(90deg, ${(project.spent || 0) > (project.budget || 1) ? '#ef4444' : '#6366f1'}, ${(project.spent || 0) > (project.budget || 1) ? '#ec4899' : '#8b5cf6'})`
                    }}
                  />
                </div>
                <div className="project-card-stats">
                  <span>💰 R$ {(project.spent || 0).toLocaleString()} gastos</span>
                  <span>{Math.min(((project.spent || 0) / (project.budget || 1)) * 100, 100).toFixed(0)}%</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};