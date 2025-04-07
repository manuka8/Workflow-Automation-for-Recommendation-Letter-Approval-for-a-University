import React, { useState } from "react";
import axios from "axios";
import "../css/StudentBulkRegistration.css";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

const StudentBulkRegistration = () => {
  const [students, setStudents] = useState([
    {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      faculty: "",
      department: "",
      course: "",
      sendEmail: false,
    },
  ]);
  const navigate = useNavigate();
  const faculties = {
    "Applied Science": {
      departments: {
        "Physical Science": ["IT", "AMC"],
        "Bio Science": ["Microbiology", "Biochemistry"],
      },
    },
    "Business Studies": {
      departments: {
        Accounting: ["Financial Accounting", "Management Accounting"],
        Marketing: ["Digital Marketing", "Consumer Behavior"],
      },
    },
    "Technological Studies": {
      departments: {
        "Computer Science": ["Software Engineering", "Data Science"],
        "Electrical Engineering": ["Power Systems", "Electronics"],
      },
    },
  };

  const handleInputChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newStudents = [...students];
    newStudents[index][name] = type === "checkbox" ? checked : value;

    if (name === "faculty") {
      newStudents[index].department = "";
      newStudents[index].course = "";
    }

    if (name === "department") {
      newStudents[index].course = "";
    }

    setStudents(newStudents);
  };

  const addRow = () => {
    setStudents([
      ...students,
      {
        studentId: "",
        firstName: "",
        lastName: "",
        email: "",
        faculty: "",
        department: "",
        course: "",
        sendEmail: false,
      },
    ]);
  };

  const deleteRow = (index) => {
    const newStudents = students.filter((_, i) => i !== index);
    setStudents(newStudents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/bulk-register",
        { students }
      );
      console.log("Response:", response.data);
      if (response) {
        alert("Students registered successfully!");
        navigate("");
        navigate("/mainregister");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error registering students.");
    }
  };

  const getDepartments = (faculty) => {
    return faculty ? Object.keys(faculties[faculty].departments) : [];
  };

  const getCourses = (faculty, department) => {
    return faculty && department
      ? faculties[faculty].departments[department]
      : [];
  };

  return (
    <>
      <DashboardNavbar backLink="/mainregister"/>
      <div className="student-bulk-registration-container">
        <h1 className="student-bulk-registration-heading">
          Student Registration
        </h1>
        <form onSubmit={handleSubmit}>
          <table className="student-bulk-registration-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Faculty</th>
                <th>Department</th>
                <th>Course</th>
                <th>Send Verification Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="studentId"
                      value={student.studentId}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="firstName"
                      value={student.firstName}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastName"
                      value={student.lastName}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={student.email}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-input"
                      required
                    />
                  </td>
                  <td>
                    <select
                      name="faculty"
                      value={student.faculty}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-select"
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
                      value={student.department}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-select"
                      required
                      disabled={!student.faculty}
                    >
                      <option value="">Select Department</option>
                      {getDepartments(student.faculty).map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      name="course"
                      value={student.course}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-select"
                      required
                      disabled={!student.department}
                    >
                      <option value="">Select Course</option>
                      {getCourses(student.faculty, student.department).map(
                        (course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="sendEmail"
                      checked={student.sendEmail}
                      onChange={(e) => handleInputChange(index, e)}
                      className="student-bulk-registration-checkbox"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteRow(index)}
                      className="student-bulk-registration-button delete-row"
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
            className="student-bulk-registration-button add-row"
          >
            Add Row
          </button>
          <button
            type="submit"
            className="student-bulk-registration-button register"
          >
            Register Students
          </button>
        </form>
      </div>
    </>
  );
};

export default StudentBulkRegistration;
