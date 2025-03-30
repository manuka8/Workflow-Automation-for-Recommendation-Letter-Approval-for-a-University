import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Welcome.css"; // Import the CSS file

const Welcome = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const subtitle = "Streamline your document approval process with ease and efficiency.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < subtitle.length) {
        setText((prevText) => prevText + subtitle.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Adjust typing speed here

    return () => clearInterval(interval);
  }, [subtitle]);

  const handleLoginClick = () => {
    navigate("/mainlogin"); // Navigate to the login page
  };

  return (
    <div className="welcome-container">
      {/* Floating particles for background effect */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>

      <div className="welcome-content">
        <h1 className="welcome-title animate-gradient">
          Welcome to <span className="smartapproval-text">SmartApproval</span>
        </h1>
        <p className="welcome-subtitle animate-typewriter">{text}</p>
        <button
          className="welcome-login-button animate-pulse"
          onClick={handleLoginClick}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Welcome;