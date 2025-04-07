import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/EditUser.css";
import DashboardNavbar from "../components/DashboardNavbar";

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

const EditUser = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const { userId } = useParams();
  const apiEndpoint =
    userType === "student"
      ? "http://localhost:5000/api/student"
      : "http://localhost:5000/api/staff";
  const emailEndpoint = `${apiEndpoint}/send-email`;

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    faculty: "",
    department: "",
    course: ""
  });
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${apiEndpoint}/${userId}`)
        .then((response) => {
          setUserData(response.data);
          const initialData = {
            firstName: response.data?.firstName || "",
            lastName: response.data?.lastName || "",
            faculty: response.data?.faculty || "",
            department: response.data?.department || "",
            position: response.data?.position || "",
            course: response.data?.course || ""
          };
          setFormData(initialData);
          
          
          if (initialData.faculty && faculties[initialData.faculty]) {
            const depts = Object.keys(faculties[initialData.faculty].departments);
            setAvailableDepartments(depts);
            
            if (initialData.department && depts.includes(initialData.department)) {
              const courses = faculties[initialData.faculty].departments[initialData.department];
              setAvailableCourses(courses);
            }
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId, apiEndpoint]);

  const handleFacultyChange = (e) => {
    const faculty = e.target.value;
    const depts = faculty ? Object.keys(faculties[faculty].departments) : [];
    
    setFormData({
      ...formData,
      faculty,
      department: "",
      course: ""
    });
    setAvailableDepartments(depts);
    setAvailableCourses([]);
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    const courses = department && formData.faculty 
      ? faculties[formData.faculty].departments[department] 
      : [];
    
    setFormData({
      ...formData,
      department,
      course: ""
    });
    setAvailableCourses(courses);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiEndpoint}/${userId}`, formData);
      await axios.post(emailEndpoint, {
        to: userData.email,
        subject: "User Information Updated",
        message: "Your account details have been successfully updated.",
      });
      navigate("/selectuser");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiEndpoint}/${userId}`);
      await axios.post(emailEndpoint, {
        to: userData.email,
        subject: "Account Deleted",
        message: "Your account has been successfully deleted.",
      });
      navigate("/selectuser");
      alert("User successfully deleted!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <>
      <DashboardNavbar backLink="/selectuser"/>
      <div className="edit-user-container">
        <h2 className="edit-user-title">Edit User Information</h2>
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <div className="edit-user-form-group">
            <label className="edit-user-label">
              First Name:
              <input
                type="text"
                name="firstName"
                className="edit-user-input"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="edit-user-form-group">
            <label className="edit-user-label">
              Last Name:
              <input
                type="text"
                name="lastName"
                className="edit-user-input"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="edit-user-form-group">
            <label className="edit-user-label">
              Email:
              <input
                type="email"
                className="edit-user-input"
                value={userData.email}
                disabled
              />
            </label>
          </div>

          <div className="edit-user-form-group">
            <label className="edit-user-label">
              Faculty:
              <select
                name="faculty"
                className="edit-user-select"
                value={formData.faculty}
                onChange={handleFacultyChange}
                required
              >
                <option value="">Select Faculty</option>
                {Object.keys(faculties).map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="edit-user-form-group">
            <label className="edit-user-label">
              Department:
              <select
                name="department"
                className="edit-user-select"
                value={formData.department}
                onChange={handleDepartmentChange}
                required
                disabled={!formData.faculty}
              >
                <option value="">Select Department</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {userType === "student" && (
            <div className="edit-user-form-group">
              <label className="edit-user-label">
                Course:
                <select
                  name="course"
                  className="edit-user-select"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  disabled={!formData.department}
                >
                  <option value="">Select Course</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {userType !== "student" && (
            <div className="edit-user-form-group">
              <label className="edit-user-label">
                Position:
                <input
                  type="text"
                  name="position"
                  className="edit-user-input"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          )}

          <div className="edit-user-button-group">
            <button type="submit" className="edit-user-submit-btn">
              Update User
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="edit-user-delete-btn"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;