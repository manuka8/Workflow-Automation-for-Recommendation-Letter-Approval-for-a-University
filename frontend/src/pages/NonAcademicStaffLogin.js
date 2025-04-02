import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/StaffLogin.css';
const NonAcademicStaffLogin = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/staff/login', { staffId, password });
      const { token } = response.data;

      localStorage.setItem('ID', staffId);
      localStorage.setItem('token', token);
      localStorage.setItem('type', 'NonAcademicStaff');
      alert('Login successful!');
      setLoading(false);

      navigate('/staffdashboard');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="student-loginr-container">
      <div className="student-login-overlay">
        <h2 className="student-login-title">Non Academic Staff Login</h2>
        {error && <p className="student-login-error">{error}</p>}
        <form className="student-login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="staffId">Staff ID:</label>
            <input
              type="text"
              id="staffId"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="Enter your staff ID"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="student-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NonAcademicStaffLogin;
