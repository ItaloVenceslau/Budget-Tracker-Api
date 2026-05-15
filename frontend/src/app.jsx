import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import {toast} from 'react-hot-toast';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProjectForm } from './components/Projects/ProjectForm';
import { ProjectDetail } from './components/Projects/ProjectDetail';
import { PageTransition } from './components/Common/PageTransition';
import { LoadingSpinner } from './components/Common/LoadingSpinner';
import { projectService } from './services/projectService';
import { FiFolder, FiPlus } from 'react-icons/fi';
import { ProjectCard } from './components/Projects/ProjectCard';

// ===== COMPONENTE PROJECTS LIST (dentro do App.jsx mesmo) =====
// Substitua o ProjectsList atual por este:

// ===== COMPONENTE PROJECTS LIST COM BOTÕES DE EDITAR E DELETAR =====
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${name}"?`)) {
      try {
        await projectService.delete(id);
        toast.success('Projeto excluído com sucesso!');
        loadProjects(); // Recarregar a lista
      } catch (error) {
        toast.error('Erro ao excluir projeto');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="projects-page">
      <div className="dashboard-header">
        <h1>Meus Projetos</h1>
        <p>Gerencie todos os seus projetos financeiros</p>
      </div>

      <div className="flex justify-end mb-8">
        <Link to="/projects/new" className="btn-new-project">
          <FiPlus size={18} /> Novo Projeto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3 className="empty-state-title">Nenhum projeto ainda</h3>
          <p className="empty-state-description">Comece criando seu primeiro projeto</p>
          <Link to="/projects/new" className="btn-primary mt-4 inline-flex">
            <FiPlus /> Criar projeto
          </Link>
        </div>
      ) : (
        <div className="projects-list-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-list-card">
              <div className="project-list-card-header">
                <div className="project-list-icon">
                  <FiFolder size={24} />
                </div>
                <div className="project-card-buttons">
                  <Link 
                    to={`/projects/${project._id}/edit`} 
                    className="project-edit-btn"
                    title="Editar projeto"
                  >
                    ✏️
                  </Link>
                  <button 
                    onClick={() => handleDelete(project._id, project.name)}
                    className="project-delete-btn"
                    title="Excluir projeto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                <h3 className="project-list-title">{project.name}</h3>
                <p className="project-list-description">{project.description || 'Sem descrição'}</p>
                <div className="project-list-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${Math.min(((project.spent || 0) / (project.budget || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="project-list-numbers">
                    <span className="budget">💰 R$ {(project.budget || 0).toLocaleString()}</span>
                    <span className="spent">💸 R$ {(project.spent || 0).toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== COMPONENTE ANALYTICS (dentro do App.jsx mesmo) =====
const Analytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics</h1>
      <p className="text-gray-500 mb-8">Estatísticas dos seus projetos</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-semibold text-lg mb-2">Em desenvolvimento</h3>
          <p className="text-gray-500">Gráficos e estatísticas detalhadas em breve!</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="font-semibold text-lg mb-2">Próximas features</h3>
          <ul className="space-y-2 text-gray-500">
            <li>• Gráficos de gastos</li>
            <li>• Tendências mensais</li>
            <li>• Relatórios PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ===== APP PRINCIPAL =====
function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <Layout><ProjectsList /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects/new" element={
            <ProtectedRoute>
              <Layout><ProjectForm /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <Layout><ProjectDetail /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <Link to="/dashboard" className="btn-primary">Voltar</Link>
              </div>
            </div>
          } />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;