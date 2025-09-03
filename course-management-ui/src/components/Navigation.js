import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, userRole, currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (location.pathname === '/' || location.pathname === '/student/portal') {
    return null;
  }

  if (userRole === 'student' || !isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/admin/dashboard">
          <i className="fas fa-university"></i> Course Management System
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/admin/dashboard">
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </Link>
            <Link className="nav-link" to="/courses">
              <i className="fas fa-book"></i> Courses
            </Link>
            <Link className="nav-link" to="/students">
              <i className="fas fa-users"></i> Students
            </Link>
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i className="fas fa-certificate"></i> Grades
              </a>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/grades/entry">Grade Entry</Link></li>
                <li><Link className="dropdown-item" to="/grades/transcript">Student Transcript</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="navbar-nav">
            <span className="navbar-text me-3">
              <i className="fas fa-user-shield"></i> Admin: {currentUser?.username}
            </span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
