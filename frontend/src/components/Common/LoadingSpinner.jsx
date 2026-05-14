import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="text-center">
        <div className="spinner-modern mb-4"></div>
        <p className="text-gray-500 animate-pulse">Carregando...</p>
      </div>
    </motion.div>
  );
};