import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div>
      {!hideNavbar && <Navbar />} {/* Afficher Navbar sauf sur /login et /register */}
      <Outlet /> {/* Afficher le contenu de la page actuelle */}
    </div>
  );
}

export default Layout;
