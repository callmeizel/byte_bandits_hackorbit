import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-wrapper">
        <div className="nav-logo">SmartBot<span>.AI</span></div>
        <div className="auth-buttons">
          <NavLink to="/signin" className="nav-auth-button">Sign in</NavLink>
          <NavLink to="/signup" className="nav-auth-button">Sign up</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
