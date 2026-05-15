import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FiPieChart } from 'react-icons/fi';

export const BudgetChart = ({ projects }) => {
  const data = projects?.map(p => ({
    name: p.name,
    value: p.spent,
    budget: p.budget,
    remaining: p.budget - p.spent
  })) || [];

  const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <div className="chart-icon">
              <FiPieChart size={18} />
            </div>
            Gastos por Projeto
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Nenhum projeto cadastrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">
          <div className="chart-icon">
            <FiPieChart size={18} />
          </div>
          Gastos por Projeto
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `R$ ${value?.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};