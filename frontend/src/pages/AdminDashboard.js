import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminDashboard.css'
const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/create-letter-template">Create Letter Template</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;