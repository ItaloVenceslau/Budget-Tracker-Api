import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectService } from '../../services/projectService';
import { StatsCards } from './StatsCards';
import { BudgetChart } from './BudgetChart';
import { ProjectList } from '../Projects/ProjectList';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiPlus, FiTrendingUp, FiAward } from 'react-icons/fi';

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Visão geral dos seus projetos</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/projects/new'}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <FiPlus /> Novo Projeto
        </motion.button>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart projects={projects} />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-500" />
            Resumo Rápido
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-indigo-200">
              <span className="text-gray-600">Projetos totais:</span>
              <span className="font-bold text-2xl text-indigo-600">{projects.length}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-indigo-200">
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
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Seus Projetos</h2>
          <FiAward className="text-indigo-500 text-2xl" />
        </div>
        <ProjectList projects={projects} onRefresh={loadData} />
      </motion.div>
    </motion.div>
  );
};