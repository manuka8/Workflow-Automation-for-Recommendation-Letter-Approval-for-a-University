import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/StaffRegister.css";

const NonAcademicStaffRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    staffType: "NonAcademicStaff",
    faculty: "",
    department: "",
    email: "",
    position: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/staff/register", // Updated API route
        formData, 
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setSubmitStatus({
          success: true,
          message:
            "Staff successfully registered and verification email sent to staff email.",
        });

        // Reset form
        setFormData({
          staffId: "",
          firstName: "",
          lastName: "",
          staffType: "Academic Staff",
          faculty: "",
          department: "",
          email: "",
          position: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: response.data.message || "Registration failed",
        });
      }
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
      console.error(err);
    }
  };

  return (
    <div className="staff-register-container">
      <h2 className="staff-register-title">Academic Staff Registration</h2>

      {submitStatus.success ? (
        <div className="staff-register-success">
          <p>{submitStatus.message}</p>
          <div className="staff-register-buttons">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="staff-register-home-btn"
            >
              Go Home
            </button>
            <button
              onClick={() => {
                setSubmitStatus({ success: false, message: "" });
              }}
              className="staff-register-add-btn"
            >
              Add New Staff
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="staff-register-form">
          {[
            { name: "staffId", label: "Staff ID", type: "text" },
            { name: "firstName", label: "First Name", type: "text" },
            { name: "lastName", label: "Last Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "faculty", label: "Faculty", type: "text" },
            { name: "department", label: "Department", type: "text" },
            { name: "position", label: "Position", type: "text" },
          ].map(({ name, label, type }) => (
            <div key={name} className="staff-register-input-group">
              <label className="staff-register-label">{label}:</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="staff-register-input"
                required
              />
            </div>
          ))}

          <button type="submit" className="staff-register-submit-btn">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default NonAcademicStaffRegister;
