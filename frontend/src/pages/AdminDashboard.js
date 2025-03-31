import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminDashboard.css';
import DashboardNavbar from '../components/DashboardNavbar';

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: 'Letter Templates',
      links: [
        { 
          path: '/create-letter-template', 
          label: 'Create Template' 
        },
        { 
          path: '/selectemplate-admin', 
          label: 'Edit Template' 
        }
      ]
    },
    {
      title: 'User Management',
      links: [
        { 
          path: '/mainregister', 
          label: 'User Registration' 
        },
        { 
          path: '/edit-user', 
          label: 'Edit users' 
        }
      ]
    },
  ];

  return (
    <>
    <DashboardNavbar/>
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Smart Approval</h1>
      </div>

      <div className="admin-dashboard__grid">
        {dashboardItems.map((section, index) => (
          <div key={index} className="admin-dashboard__card">
            <div className="admin-dashboard__card-header">
              <h3 className="admin-dashboard__card-title">{section.title}</h3>
            </div>
            <div className="admin-dashboard__card-content">
              {section.links.map((link, linkIndex) => (
                <Link 
                  key={linkIndex} 
                  to={link.path} 
                  className="admin-dashboard__link"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;