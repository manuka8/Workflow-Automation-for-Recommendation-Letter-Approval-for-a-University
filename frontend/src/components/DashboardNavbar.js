import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/DashboardNavbar.css';

const DashboardNavbar = ({ backLink }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLetterTemplates, setShowLetterTemplates] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const navLinks = [
    { path: '/admindashboard', label: 'Home' }
  ];

  const letterTemplateLinks = [
    { path: '/create-letter-template', label: 'Create Template' },
    { path: '/selectemplate-admin', label: 'Edit Template' },
  ];

  const userManagementLinks = [
    { path: '/mainregister', label: 'Register User' },
    { path: '/edit-user', label: 'Edit User' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/adminlogin');
  };

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-header">
        {backLink && (
          <button className="back-button" onClick={() => navigate(backLink)}>
            ←
          </button>
        )}
        <h2 className="navbar-title">Admin Portal</h2>
      </div>

      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          </li>
        ))}

        <li
          className="dropdown"
          onMouseEnter={() => setShowLetterTemplates(true)}
          onMouseLeave={() => setShowLetterTemplates(false)}
        >
          <span className="nav-link">Letter Templates</span>
          {showLetterTemplates && (
            <ul className="dropdown-menu">
              {letterTemplateLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="dropdown-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li
          className="dropdown"
          onMouseEnter={() => setShowUserManagement(true)}
          onMouseLeave={() => setShowUserManagement(false)}
        >
          <span className="nav-link">User Management</span>
          {showUserManagement && (
            <ul className="dropdown-menu">
              {userManagementLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="dropdown-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>

        <li>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;
