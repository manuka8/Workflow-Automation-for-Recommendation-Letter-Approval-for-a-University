import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import '../css/StudentRegister.css';

const StudentRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    faculty: '',
    department: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: 'Student successfully registered and verification email sent to student email.'
        });

        
        setFormData({
          studentId: '',
          firstName: '',
          lastName: '',
          email: '',
          faculty: '',
          department: ''
        });
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Registration failed'
        });
      }
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again.'
      });
      console.error(err);
    }
  };

  return (
    <div className="student-register-container">
      <h2 className="student-register-title">Student Registration</h2>

      {submitStatus.success ? (
        // Success message with buttons
        <div className="student-register-success">
          <p>{submitStatus.message}</p>
          <div className="student-register-buttons">
            <button onClick={() => navigate('/admin-dashboard')} className="student-register-home-btn">
              Go Home
            </button>
            <button onClick={() => {
                setSubmitStatus({ success: false, message: '' }); 
              }} className="student-register-add-btn">
              Add New Student
            </button>
          </div>
        </div>
      ) : (
        // Registration form
        <form onSubmit={handleSubmit} className="student-register-form">
          {[
            { name: 'studentId', label: 'Student ID', type: 'text' },
            { name: 'firstName', label: 'First Name', type: 'text' },
            { name: 'lastName', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'faculty', label: 'Faculty', type: 'text' },
            { name: 'department', label: 'Department', type: 'text' }
          ].map(({ name, label, type }) => (
            <div key={name} className="student-register-input-group">
              <label className="student-register-label">{label}:</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="student-register-input"
                required
              />
            </div>
          ))}

          <button type="submit" className="student-register-submit-btn">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentRegister;
