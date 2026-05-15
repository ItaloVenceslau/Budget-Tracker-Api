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