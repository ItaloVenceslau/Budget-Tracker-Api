import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiActivity } from 'react-icons/fi';
import { projectService } from '../../services/projectService';
import toast from 'react-hot-toast';

const statusColors = {
  planning: 'status-planning',
  active: 'status-active',
  completed: 'status-completed',
  cancelled: 'status-cancelled'
};

const statusLabels = {
  planning: 'Planejamento',
  active: 'Ativo',
  completed: 'Concluído',
  cancelled: 'Cancelado'
};

export const ProjectCard = ({ project, onRefresh }) => {
  const [deleting, setDeleting] = useState(false);
  const percentage = ((project.spent || 0) / (project.budget || 1)) * 100;

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      setDeleting(true);
      try {
        await projectService.delete(project._id);
        toast.success('Projeto excluído com sucesso');
        onRefresh();
      } catch (error) {
        toast.error('Erro ao excluir projeto');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="project-card">
      <div className="project-card-header-actions">
        <div className="project-list-icon">
          <FiActivity size={24} />
        </div>
        <div className="project-card-actions">
          <Link to={`/projects/${project._id}/edit`} className="action-btn edit-btn" title="Editar">
            <FiEdit2 size={16} />
          </Link>
          <button onClick={handleDelete} disabled={deleting} className="action-btn delete-btn" title="Excluir">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="project-card-title">{project.name}</h3>
      <p className="project-card-description">{project.description || 'Sem descrição'}</p>

      <div className="project-card-status-wrapper">
        <span className={`project-card-status ${statusColors[project.status]}`}>
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="project-card-budget-info">
        <div className="budget-item">
          <span className="budget-label">Orçamento</span>
          <span className="budget-value">R$ {(project.budget || 0).toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Gasto</span>
          <span className="budget-value spent">R$ {(project.spent || 0).toLocaleString()}</span>
        </div>
        <div className="budget-item">
          <span className="budget-label">Restante</span>
          <span className="budget-value remaining">R$ {((project.budget || 0) - (project.spent || 0)).toLocaleString()}</span>
        </div>
      </div>

      <div className="project-card-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
        <div className="progress-text">{percentage.toFixed(0)}% utilizado</div>
      </div>
    </div>
  );
};