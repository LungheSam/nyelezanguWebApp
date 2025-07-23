import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import '../../styles/HomeSaloon.css';

export default function HomeSaloon({children}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-area">
        <Header onMenuClick={() => setMenuOpen(true)} />
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}
