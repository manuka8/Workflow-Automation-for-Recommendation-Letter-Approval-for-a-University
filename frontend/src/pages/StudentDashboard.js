import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/StudentDashboard.css';
import Navbar from "../components/Navbar";
const StudentDashboard = () => {
  const profileImage = '../assets/2.jpg'; 
  const userName = 'user1';
  const navigate = useNavigate();
  const link = '/studentdashboard';
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/mainlogin";
  };

  return (
    <div className="student-dashboard-container">
  <Navbar  />

  <div className="student-dashboard-content">
    <div className="sidebarx">
      <h3>Dashboard</h3>
      <Link to="/selectemplate" className="sidebarx-link">Submit New Letter</Link>
      <Link to="/pendingresubmissions" className="sidebarx-link">Pending Resubmissions</Link>
      <Link to="/realtimetracking" className="sidebarx-link">Submission Status & History</Link>
      <Link to="/profile" className="sidebarx-link">User Profile</Link>
    </div>

    <div className="dashboard-mainx">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-links">
        <Link to="/selectemplate" className="dashboard-link">Submit New Letter</Link>
        <Link to="/pendingresubmissions" className="dashboard-link">Pending Resubmissions</Link>
        <Link to="/realtimetracking" className="dashboard-link">Submission History</Link>
      </div>
    </div>
  </div>

  <footer className="dashboard-footer">
    &copy; SmartApproval
  </footer>
</div>
  );
};

export default StudentDashboard;
