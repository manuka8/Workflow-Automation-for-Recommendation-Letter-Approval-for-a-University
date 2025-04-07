import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/StaffLogin.css';
import staffLoginImage from '../assets/userlogin2.jpg'; // Import your staff login image

const Stafflogin = () => {
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
      localStorage.setItem('type', 'Staff');
      alert('Login successful!');
      setLoading(false);

      navigate('/staffdashboard');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="staff-login-container">
      <div className="staff-login-image-container">
        <img src={staffLoginImage} alt="Staff Login" className="staff-login-image" />
        <div className="staff-image-overlay">
          <h2>Welcome Back, Staff Login</h2>
          <p>Access your Staff dashboard to manage document processing</p>
        </div>
      </div>
      
      <div className="staff-login-content">
        <div className="staff-login-card">
          <h2 className="staff-login-title">Staff Login</h2>
          {error && <p className="staff-login-error">{error}</p>}
          <form className="staff-login-form" onSubmit={handleSubmit}>
            <div className="staff-input-group">
              <label htmlFor="staffId">Staff ID</label>
              <input
                type="text"
                id="staffId"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="Enter your staff ID"
                required
              />
            </div>

            <div className="staff-input-group">
              <label htmlFor="password">Password</label>
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
              className="staff-login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Stafflogin;