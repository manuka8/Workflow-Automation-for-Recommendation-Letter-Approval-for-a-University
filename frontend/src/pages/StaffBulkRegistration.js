import React, { useState } from "react";
import axios from "axios";
import "../css/StaffBulkRegistration.css";
import DashboardNavbar from "../components/DashboardNavbar";
import { useNavigate } from "react-router-dom";

const StaffBulkRegistration = () => {
  const [staffList, setStaffList] = useState([
    {
      staffId: "",
      firstName: "",
      lastName: "",
      staffType: "",
      faculty: "",
      department: "",
      email: "",
      position: "",
      sendEmail: false,
    },
  ]);

  const faculties = {
    "Applied Science": {
      departments: ["Physical Science", "Bio Science"],
    },
    "Business Studies": {
      departments: ["Accounting", "Marketing"],
    },
    "Technological Studies": {
      departments: ["Computer Science", "Electrical Engineering"],
    },
    Non: {
      departments: ["Non"],
    },
  };

  const staffTypes = ["Academic Staff", "Non-Academic Staff"];

  const handleInputChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newStaffList = [...staffList];
    newStaffList[index][name] = type === "checkbox" ? checked : value;

    if (name === "faculty") {
      newStaffList[index].department = "";
    }

    setStaffList(newStaffList);
  };

  const addRow = () => {
    setStaffList([
      ...staffList,
      {
        staffId: "",
        firstName: "",
        lastName: "",
        staffType: "",
        faculty: "",
        department: "",
        email: "",
        position: "",
        sendEmail: false,
      },
    ]);
  };

  const deleteRow = (index) => {
    const newStaffList = staffList.filter((_, i) => i !== index);
    setStaffList(newStaffList);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/staff/bulk",
        { staffList }
      );
      console.log("Response:", response.data);
      if (response) {
        alert("Staff Member registered successfully!");
        navigate("/mainregister");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error registering staff.");
    }
  };
  
  
    const handleStudentUpload = () => {
      localStorage.setItem("uploadingType", "student");
      navigate("/user-register");
    };

  const getDepartments = (faculty) => {
    return faculty ? faculties[faculty].departments : [];
  };

  return (
    <>
      <DashboardNavbar backLink="/mainregister" />
      <div className="staff-bulk-registration-container">
        <h1 className="staff-bulk-registration-heading">
          Staff Registration
        </h1>
        <button className="user-reg-button" onClick={handleStudentUpload}>
      Student Registration by CSV
    </button>
    <br/>
        <form onSubmit={handleSubmit}>
          <table className="staff-bulk-registration-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Staff Type</th>
                <th>Faculty</th>
                <th>Department</th>
                <th>Email</th>
                <th>Position</th>
                <th>Send Verification Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="staffId"
                      value={staff.staffId}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="firstName"
                      value={staff.firstName}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastName"
                      value={staff.lastName}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <select
                      name="staffType"
                      value={staff.staffType}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-select"
                      required
                    >
                      <option value="">Select Staff Type</option>
                      {staffTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="faculty"
                      value={staff.faculty}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-select"
                      required
                    >
                      <option value="">Select Faculty</option>
                      {Object.keys(faculties).map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="department"
                      value={staff.department}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-select"
                      required
                      disabled={!staff.faculty}
                    >
                      <option value="">Select Department</option>
                      {getDepartments(staff.faculty).map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={staff.email}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="position"
                      value={staff.position}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="sendEmail"
                      checked={staff.sendEmail}
                      onChange={(e) => handleInputChange(index, e)}
                      className="staff-bulk-registration-checkbox"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteRow(index)}
                      className="staff-bulk-registration-button delete-row"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addRow}
            className="staff-bulk-registration-button add-row"
          >
            Add Row
          </button>
          <button
            type="submit"
            className="staff-bulk-registration-button register"
          >
            Register Staff
          </button>
        </form>
      </div>
    </>
  );
};

export default StaffBulkRegistration;
