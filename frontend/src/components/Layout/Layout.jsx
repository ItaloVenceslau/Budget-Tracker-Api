// frontend/src/components/Layout/Layout.jsx
import React from 'react';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};