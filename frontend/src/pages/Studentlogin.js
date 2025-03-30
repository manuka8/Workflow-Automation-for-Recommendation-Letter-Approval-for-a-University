import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/StudentLogin.css';

const StudentLogin = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

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
        navigate(`/studentdashboard`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="student-login-container">
      <div className="student-login-overlay">
        <h2 className="student-login-title">Student Login</h2>
        <form className="student-login-form" onSubmit={handleLogin}>
          {error && <p className="student-login-error">{error}</p>}

          <div>
            <label>Student ID:</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              required
            />
          </div>

          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="student-login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
