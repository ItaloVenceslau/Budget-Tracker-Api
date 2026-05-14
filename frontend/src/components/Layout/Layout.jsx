import React from 'react';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="animate-fade-up">
          {children}
        </div>
      </main>
    </div>
  );
};