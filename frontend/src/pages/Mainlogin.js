import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/MainLogin.css";
import welcomeImage from "../assets/4579502.jpg"; // Ensure this is the correct path

function MainLogin() {
  const navigate = useNavigate();

  return (
    <div className="main-login-container">
 
      <div className="main-login-image">
        <img src={welcomeImage} alt="Login Illustration" />
      </div>

      <div className="main-login-content">
        <h1 className="main-login-header">Welcome to Login Portal</h1>
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
            Staff Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainLogin;
