
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Stafflogin = () => {
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('ID', staffId);
        // Redirect to dashboard
        navigate('/staffdashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <h2>Staff Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          <label>Staff ID:</label>
          <input
            type="text"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            placeholder="Enter your staff ID"
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Stafflogin;

