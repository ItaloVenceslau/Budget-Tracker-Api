import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
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

// ===== COMPONENTE PROJECTS LIST (dentro do App.jsx mesmo) =====
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadProjects();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhum projeto ainda</h2>
        <p className="text-gray-500 mb-6">Comece criando seu primeiro projeto</p>
        <Link to="/projects/new" className="btn-primary inline-flex items-center gap-2">
          <FiPlus /> Criar projeto
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meus Projetos</h1>
        <Link to="/projects/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Novo Projeto
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link key={project._id} to={`/projects/${project._id}`} className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiFolder className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg">{project.name}</h3>
            </div>
            <p className="text-gray-500 text-sm mb-3">{project.description || 'Sem descrição'}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-600">R$ {project.budget?.toLocaleString()}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {project.status === 'active' ? 'Ativo' : project.status === 'completed' ? 'Concluído' : 'Planejamento'}
              </span>
            </div>
          </Link>
        ))}
      </div>
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