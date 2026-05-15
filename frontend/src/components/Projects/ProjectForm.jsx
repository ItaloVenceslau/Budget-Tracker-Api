import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

export const ProjectForm = ({ project, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    budget: project?.budget || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.length < 3) {
      toast.error('Nome deve ter pelo menos 3 caracteres');
      return;
    }
    
    const budgetNum = parseFloat(formData.budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      toast.error('Budget deve ser um valor positivo');
      return;
    }

    setLoading(true);
    try {
      if (project) {
        await projectService.update(project._id, {
          name: formData.name,
          description: formData.description,
          budget: budgetNum
        });
        toast.success('Projeto atualizado com sucesso');
      } else {
        await projectService.create({
          name: formData.name,
          description: formData.description,
          budget: budgetNum
        });
        toast.success('Projeto criado com sucesso! 🎉');
      }
      if (onSuccess) onSuccess();
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="btn-back">
        <FiArrowLeft /> Voltar
      </button>

      <div className="form-card">
        <div className="form-header">
          <h1>{project ? 'Editar Projeto' : 'Criar Novo Projeto'}</h1>
          <p>Preencha os dados abaixo para {project ? 'atualizar' : 'criar'} seu projeto</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label className="form-label">
              Nome do Projeto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Ex: Website, App, Reforma..."
              required
              minLength={3}
            />
            <p className="form-hint">Digite um nome único e descritivo para seu projeto</p>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              placeholder="Descreva os detalhes do projeto..."
            />
            <p className="form-hint">Opcional, mas ajuda na organização</p>
          </div>

          <div className="form-group">
            <label className="form-label">
              Orçamento Total <span className="text-red-500">*</span>
            </label>
            <div className="form-currency">
              <span className="currency-symbol">R$</span>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="form-currency-input"
                placeholder="0,00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <p className="form-hint">Defina o valor total disponível para este projeto</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-cancel"
            >
              <FiX /> Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              <FiSave /> {loading ? 'Salvando...' : (project ? 'Atualizar Projeto' : 'Criar Projeto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};