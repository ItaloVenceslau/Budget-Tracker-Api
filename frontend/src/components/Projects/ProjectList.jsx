import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { FiFolder, FiPlus } from 'react-icons/fi';

export const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📁</div>
        <h3 className="empty-state-title">Nenhum projeto ainda</h3>
        <p className="empty-state-description">
          Comece criando seu primeiro projeto financeiro
        </p>
        <Link to="/projects/new" className="btn-new-project mt-4 inline-flex">
          <FiPlus /> Criar primeiro projeto
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>Meus Projetos</h1>
        <p>Gerencie todos os seus projetos financeiros</p>
      </div>

      <div className="flex justify-end mb-6">
        <Link to="/projects/new" className="btn-new-project">
          <FiPlus /> Novo Projeto
        </Link>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
            <div className="project-card-icon">
              <FiFolder size={24} />
            </div>
            <h3 className="project-card-title">{project.name}</h3>
            <p className="project-card-description">
              {project.description || 'Sem descrição'}
            </p>
            <div className="project-card-footer">
              <span className="project-card-budget">
                R$ {project.budget.toLocaleString()}
              </span>
              <span className={`project-card-status status-${project.status}`}>
                {project.status === 'active' ? 'Ativo' : 
                 project.status === 'planning' ? 'Planejamento' :
                 project.status === 'completed' ? 'Concluído' : 'Cancelado'}
              </span>
            </div>
            <div className="project-card-progress">
              <div 
                className="project-card-progress-bar" 
                style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};