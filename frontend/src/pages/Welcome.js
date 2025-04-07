import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Welcome.css";
import welcomeImage from "../assets/4957142.jpg";

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
    }, 50);

    return () => clearInterval(interval);
  }, [subtitle]);

  const handleLoginClick = () => {
    navigate("/mainlogin");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to <span className="smartapproval-text">SmartApproval</span></h1>
        <p className="welcome-subtitle">{text}</p>
        <button className="welcome-login-button" onClick={handleLoginClick}>Go to Login</button>
      </div>
      <div className="welcome-image">
        <img src={welcomeImage} alt="Welcome Illustration" />
      </div>
    </div>
  );
};

export default Welcome;
