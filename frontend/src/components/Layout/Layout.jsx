// frontend/src/components/Layout/Layout.jsx
import React from 'react';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8">
        <div className="animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
};