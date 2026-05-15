import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import { ProjectsList } from './components/Projects/ProjectsList';
import { Analytics } from './components/Analytics/Analytics';

// Componente temporário para lista de projetos
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectService } = require('./services/projectService');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-header">
      <h1>Meus Projetos</h1>
      <p>Lista completa de todos os seus projetos</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="card hover:shadow-xl transition-all">
            <h3 className="font-bold text-lg mb-2">{project.name}</h3>
            <p className="text-gray-500 text-sm mb-3">{project.description || 'Sem descrição'}</p>
            <div className="flex justify-between items-center">
              <span className="text-primary font-bold">R$ {project.budget.toLocaleString()}</span>
              <span className={`badge ${project.status === 'active' ? 'badge-active' : 'badge-planning'}`}>
                {project.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Componente para Analytics
const Analytics = () => {
  return (
    <div className="dashboard-header">
      <h1>Analytics</h1>
      <p>Estatísticas detalhadas dos seus projetos</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Em desenvolvimento</h3>
          <p className="text-gray-500">Em breve você terá gráficos e estatísticas detalhadas aqui!</p>
        </div>
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Próximas features</h3>
          <ul className="space-y-2 text-gray-500">
            <li>📊 Gráficos de gastos por categoria</li>
            <li>📈 Tendências mensais</li>
            <li>🎯 Metas e orçamentos</li>
            <li>📑 Relatórios exportáveis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 20px',
          },
          success: {
            style: {
              background: '#10b981',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            } 
          />
          
          {/* Redirecionamento padrão */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Layout>
                    <ProjectForm />
                  </Layout>
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Layout>
                    <ProjectForm />
                  </Layout>
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
  path="/projects"
  element={
    <ProtectedRoute>
      <PageTransition>
        <Layout>
          <ProjectsList />
        </Layout>
      </PageTransition>
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <PageTransition>
        <Layout>
          <Analytics />
        </Layout>
      </PageTransition>
    </ProtectedRoute>
  }
/>
          
          {/* Rota 404 */}
          <Route
            path="*"
            element={
              <PageTransition>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
                    <a 
                      href="/dashboard" 
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Voltar ao Dashboard
                    </a>
                  </div>
                </div>
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
    
  );
}

export default App;