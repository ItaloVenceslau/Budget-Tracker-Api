import React from 'react';
import { Link } from 'react-router-dom';
import { FiFolder } from 'react-icons/fi';

export const ProjectList = ({ projects, onRefresh }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum projeto cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <Link key={project._id} to={`/projects/${project._id}`} className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
          <div className="flex items-center gap-2 mb-2">
            <FiFolder className="text-indigo-500" />
            <h3 className="font-bold">{project.name}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-2">{project.description || 'Sem descrição'}</p>
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-bold">R$ {project.budget?.toLocaleString()}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
              {project.status === 'active' ? 'Ativo' : project.status === 'completed' ? 'Concluído' : 'Planejamento'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};