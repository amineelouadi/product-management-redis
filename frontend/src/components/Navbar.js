import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-link">Dashboard</Link>
        <Link to="/add-product" className="navbar-link">Add Product</Link>
      </div>
    </nav>
  );
}

export default Navbar;