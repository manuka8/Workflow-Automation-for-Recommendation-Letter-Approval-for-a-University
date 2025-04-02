import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import "../css/SelectManageUser.css";
const SelectManageUser = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const location = useLocation();
  const [yearFilter, setYearFilter] = useState("");
  const [viewType, setViewType] = useState("table"); // Table or Card view



  useEffect(() => {
    // Disable forward navigation when the component is mounted
    window.history.pushState(null, "", location.pathname);
    
    const handlePopState = () => {
      // Navigate to /mainregister when the back button is clicked
      navigate("/mainregister");
      localStorage.removeItem("userType");
    };
  
    window.addEventListener("popstate", handlePopState);
    fetchUsers();
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, location.pathname, userType]);  // Adding `userType` as a dependency
  

  const fetchUsers = async () => {
    try {
      let endpoint = "";
      if (userType === "student") {
        endpoint = "http://localhost:5000/api/staff/selectstudent";
      } else if (userType === "Academic Staff") {
        endpoint =
          "http://localhost:5000/api/staff/selectstaff?staffType=Academic Staff";
      } else if (userType === "Non-Academic Staff") {
        endpoint =
          "http://localhost:5000/api/staff/selectstaff?staffType=Non Academic Staff";
      }

      const response = await axios.get(endpoint);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (user.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        user.staffId?.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        (user.position &&
          user.position.toLowerCase().includes(search.toLowerCase()))) &&
      (facultyFilter ? user.faculty === facultyFilter : true) &&
      (departmentFilter ? user.department === departmentFilter : true) &&
      (yearFilter ? user.createdAt?.startsWith(yearFilter) : true)
    );
  });

  const handleEdit = (regNo) => {
    navigate(`/edituser/${regNo}`);
  };

  const faculties = [...new Set(users.map((user) => user.faculty))]; // Get unique faculties
  const departments = [...new Set(users.map((user) => user.department))]; // Get unique departments

  return (
    <div className="manage-user-container">
      <h2 className="manage-user-title">
        Manage {userType === "student" ? "Students" : "Staff"}
      </h2>

      <input
        type="text"
        placeholder="Search by Reg No, Name, Email, Position"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        onChange={(e) => setFacultyFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">Filter by Faculty</option>
        {faculties.map((faculty) => (
          <option key={faculty} value={faculty}>
            {faculty}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setDepartmentFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">Filter by Department</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setYearFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">Filter by Academic Year</option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2022">2022</option>
      </select>

      <div className="view-buttons">
        <button onClick={() => setViewType("table")} className="view-button">
          Table View
        </button>
        <button onClick={() => setViewType("card")} className="view-button">
          Card View
        </button>
      </div>

      {viewType === "table" ? (
        <table className="table-view">
          <thead>
            <tr>
              <th>Reg No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Faculty</th>
              <th>Department</th>
              {userType !== "student" && <th>Position</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="table-view-row">
                <td>{user.studentId || user.staffId}</td>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>{user.faculty}</td>
                <td>{user.department}</td>
                {userType !== "student" && <td>{user.position}</td>}
                <td>
                  <button
                    onClick={() => handleEdit(user.studentId || user.staffId)}
                    className="table-view-action-btn"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="card-view">
          {filteredUsers.map((user) => (
            <div key={user._id} className="card-item">
              <h3 className="card-item-title">
                {user.firstName} {user.lastName}
              </h3>
              <p className="card-item-info">
                Reg No: {user.studentId || user.staffId}
              </p>
              <button
                onClick={() => handleEdit(user.studentId || user.staffId)}
                className="card-item-action-btn"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectManageUser;
