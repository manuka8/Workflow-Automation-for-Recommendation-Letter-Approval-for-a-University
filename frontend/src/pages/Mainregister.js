import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../css/Mainregister.css";

function Mainregister() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handlePopState = () => {
      navigate("/admindashboard");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);

  const handleStudentUpload = () => {
    localStorage.setItem("uploadingType", "student");
    navigate("/user-register");
  };

  const handleStaffUpload = () => {
    localStorage.setItem("uploadingType", "staff");
    navigate("/user-register");
  };

  return (
    <div className="main-register-container">
      <DashboardNavbar backLink="/admindashboard" />
      
      <div className="register-content">
        <h1 className="register-title">User Registration Portal</h1>
        <p className="register-subtitle">Select registration method</p>
        
        <div className="registration-options">
          <div className="option-card" onClick={() => navigate("/studentbulkregister")}>
            <div className="option-icon">👨‍🎓</div>
            <h3>Student Registration</h3>
            <p>Register individual students manually</p>
          </div>

          <div className="option-card" onClick={() => navigate("/staffregister")}>
            <div className="option-icon">👩‍🏫</div>
            <h3>Staff Registration</h3>
            <p>Register individual staff members manually</p>
          </div>

          <div className="option-card" onClick={handleStudentUpload}>
            <div className="option-icon">📊</div>
            <h3>Bulk Student Upload</h3>
            <p>Upload multiple students via CSV file</p>
          </div>

          <div className="option-card" onClick={handleStaffUpload}>
            <div className="option-icon">📈</div>
            <h3>Bulk Staff Upload</h3>
            <p>Upload multiple staff members via CSV file</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainregister;