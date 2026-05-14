import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectService } from '../../services/projectService';
import { StatsCards } from './StatsCards';
import { BudgetChart } from './BudgetChart';
import { ProjectList } from '../Projects/ProjectList';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiPlus, FiTrendingUp, FiAward, FiSmile } from 'react-icons/fi';

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
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header com animação */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="dashboard-header"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="gradient-text">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              <FiSmile className="inline mr-1" /> Visão geral dos seus projetos
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/projects/new'}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus size={18} /> Novo Projeto
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart projects={projects} />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">
              <FiTrendingUp className="text-primary-500" />
              Resumo Rápido
            </h2>
            <FiAward className="text-yellow-500 text-xl" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Projetos totais:</span>
              <span className="font-bold text-2xl text-primary-600 pulse">{projects.length}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Projetos concluídos:</span>
              <span className="font-bold text-2xl text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Taxa de sucesso:</span>
              <span className="font-bold text-2xl text-purple-600">
                {projects.length ? Math.round((projects.filter(p => p.status === 'completed').length / projects.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Seus Projetos</h2>
          <div className="text-gray-400 text-sm">{projects.length} projetos</div>
        </div>
        <ProjectList projects={projects} onRefresh={loadData} />
      </motion.div>
    </motion.div>
  );
};