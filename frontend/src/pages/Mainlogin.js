import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/MainLogin.css';

function MainLogin() {
  const navigate = useNavigate();

  return (
    <div className="main-login-container">
      <div className="main-login-overlay"></div>
      <div className="main-login-content">
        <h1 className="main-login-header">Welcome to Our Portal</h1>
        <p className="main-login-subtext">Please select your login type</p>
        <div className="main-login-button-container">
          <button
            onClick={() => navigate("/studentlogin")}
            className="main-login-button student-login"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/stafflogin")}
            className="main-login-button staff-login"
          >
            Academic Staff Login
          </button>
          <button
            onClick={() => navigate("/nstafflogin")}
            className="main-login-button non-staff-login"
          >
            Non-Academic Staff Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainLogin;