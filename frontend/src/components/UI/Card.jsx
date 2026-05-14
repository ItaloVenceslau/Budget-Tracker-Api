import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 ${className}`}
    >
      {children}
    </motion.div>
  );
};