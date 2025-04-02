import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import '../css/StaffDashboard.css'
const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-container">
      <Navbar />

      <div className="staff-dashboard-content">
        <aside className="sidebara">
          <h3>Dashboard</h3>
          <Link to="/pendingapprovals" className="sidebara-link">Pending Approvals</Link>
          <Link to="/selectemplate" className="sidebara-link">Create Letter Submission</Link>
          <Link to="/viewhistory" className="sidebara-link">Your Approval History</Link>
          <Link to="/realtimetracking" className="sidebara-link">Your Submission Status & History</Link>
        </aside>

        <main className="dashboard-mainx">
          <h1>Welcome to Your Dashboard</h1>
          <div className="dashboard-links">
            <Link to="/pendingapprovals" className="dashboard-link">Pending Approvals</Link>
            <Link to="/selectemplate" className="dashboard-link">Create Letter Submission</Link>
            <Link to="/viewhistory" className="dashboard-link">Your Approval History</Link>
            <Link to="/realtimetracking" className="dashboard-link">Your Submission Status & History</Link>
          </div>
        </main>
      </div>

      <footer className="dashboard-footer">
        &copy; SmartApproval
      </footer>
    </div>
  );
};

export default StaffDashboard;
