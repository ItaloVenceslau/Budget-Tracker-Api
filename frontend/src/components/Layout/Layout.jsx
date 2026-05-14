import React from 'react';
// import { Sidebar } from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {/* <Sidebar /> */}
      <main className="main-content fade-in-up">
        {children}
      </main>
    </div>
  );
};