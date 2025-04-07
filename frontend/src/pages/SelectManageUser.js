import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/SelectManageUser.css";
import DashboardNavbar from "../components/DashboardNavbar";
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
  }, [navigate, location.pathname, userType]); // Adding `userType` as a dependency

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
          "http://localhost:5000/api/staff/selectstaff?staffType=Non-Academic Staff";
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
    <>
      <DashboardNavbar backLink="/edit-user" />
      <div className="dashboard-manage-user-wrapper">
        <div className="manage-user-container">
          <h2 className="manage-user-title">
            Edit {userType === "student" ? "Students" : "Staff"}
          </h2>

          <div className="manage-user-search-filter-container">
            <input
              type="text"
              placeholder="Search by Reg No, Name, Email, Position"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="manage-user-search-input"
            />

            <select
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="manage-user-filter-select"
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
              className="manage-user-filter-select"
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
              className="manage-user-filter-select"
            >
              <option value="">Filter by Academic Year</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="manage-user-view-toggle">
            <button
              onClick={() => setViewType("table")}
              className={`manage-user-view-btn ${
                viewType === "table"
                  ? "manage-user-view-btn-active"
                  : "manage-user-view-btn-inactive"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewType("card")}
              className={`manage-user-view-btn ${
                viewType === "card"
                  ? "manage-user-view-btn-active"
                  : "manage-user-view-btn-inactive"
              }`}
            >
              Card View
            </button>
          </div>

          {viewType === "table" ? (
            <div className="manage-user-table-container">
              <table className="manage-user-table">
                <thead className="manage-user-table-header">
                  <tr>
                    <th className="manage-user-table-header-cell">Reg No</th>
                    <th className="manage-user-table-header-cell">Name</th>
                    <th className="manage-user-table-header-cell">Email</th>
                    <th className="manage-user-table-header-cell">Faculty</th>
                    <th className="manage-user-table-header-cell">
                      Department
                    </th>
                    {userType !== "student" && (
                      <th className="manage-user-table-header-cell">
                        Position
                      </th>
                    )}
                    <th className="manage-user-table-header-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="manage-user-table-row">
                      <td className="manage-user-table-cell">
                        {user.studentId || user.staffId}
                      </td>
                      <td className="manage-user-table-cell">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="manage-user-table-cell">{user.email}</td>
                      <td className="manage-user-table-cell">{user.faculty}</td>
                      <td className="manage-user-table-cell">
                        {user.department}
                      </td>
                      {userType !== "student" && (
                        <td className="manage-user-table-cell">
                          {user.position}
                        </td>
                      )}
                      <td className="manage-user-table-cell">
                        <button
                          onClick={() =>
                            handleEdit(user.studentId || user.staffId)
                          }
                          className="manage-user-action-btn"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="manage-user-card-container">
              {filteredUsers.map((user) => (
                <div key={user._id} className="manage-user-card">
                  <h3 className="manage-user-card-title">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="manage-user-card-info">
                    Reg No: {user.studentId || user.staffId}
                  </p>
                  <button
                    onClick={() => handleEdit(user.studentId || user.staffId)}
                    className="manage-user-card-btn"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectManageUser;
