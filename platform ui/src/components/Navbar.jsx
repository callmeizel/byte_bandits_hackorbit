import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-wrapper">
        <NavLink to="/" className="nav-logo">
          SmartBot<span>.AI</span>
        </NavLink>
        <div className="auth-buttons">
          <NavLink to="/" className="nav-auth-button">Home</NavLink>
          <NavLink to="/login" className="nav-auth-button">Login</NavLink>
          <NavLink to="/signup" className="nav-auth-button signup-button">Sign up</NavLink>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
