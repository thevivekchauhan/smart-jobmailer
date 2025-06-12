import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Smart JobMailer
          </Link>
        </div>
        
        <div className="navbar-menu">
          {user ? (
            <div className="navbar-items">
              <Link to="/dashboard" className="navbar-item">
                Dashboard
              </Link>
              <div className="user-menu">
                <span className="welcome-message">
                  Welcome, {user.firstName}!
                </span>
                <div className="dropdown">
                  <button className="dropdown-toggle">
                    <span className="user-avatar">
                      {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span className="dropdown-caret">▼</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="navbar-items">
              <Link to="/login" className="navbar-item">
                Login
              </Link>
              <Link to="/register" className="navbar-item button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
