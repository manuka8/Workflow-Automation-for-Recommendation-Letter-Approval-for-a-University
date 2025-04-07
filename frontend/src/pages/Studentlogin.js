import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StudentLogin.css';
import loginImage from '../assets/userlogin1.jpg'; // Make sure this path is correct

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('ID', studentId);
        localStorage.setItem('type', 'student');
        navigate('/studentdashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-image-container">
        <img 
          src={loginImage} 
          alt="Student studying" 
          className="student-login-image"
        />
        <div className="image-overlay">
          <h2>Welcome Back!</h2>
          <p>Access your student portal and manage your document processes</p>
        </div>
      </div>

      <div className="student-login-content">
        <div className="login-card">
          <div className="logo-container">
            <span className="logo-main">Smart</span>
            <span className="logo-accent">Approval</span>
          </div>

          <h1 className="login-title">Student Login</h1>
          <p className="login-subtitle">Enter your credentials to access your account</p>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label className='inputlabel'>Student ID</label>
              <input
                id="studentId"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter your student ID"
                required
              />
              
            </div>

            <div className="input-group">
              <label htmlFor="password" className='inputlabel'>Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              
            </div>

            

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                'Login'
              )}
            </button>

            <div className="register-link">
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;