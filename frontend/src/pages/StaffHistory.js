import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/StaffHistory.css";
import Navbar from "../components/Navbar";

const StaffHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewMode, setViewMode] = useState("list");

  const navigate = useNavigate();
  const staffId = localStorage.getItem("ID");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/submissions/findstaffsubmissions/${staffId}`
      );
      setSubmissions(response.data);
      setFilteredSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterData(value, filterStatus);
  };

  const handleFilterStatus = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    filterData(search, value);
  };

  const filterData = (searchValue, statusValue) => {
    let filtered = submissions;

    if (searchValue) {
      filtered = filtered.filter(
        (submission) =>
          submission.templateName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          submission.userId.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (statusValue) {
      filtered = filtered.filter(
        (submission) => submission.status === statusValue
      );
    }

    setFilteredSubmissions(filtered);
  };

  const navigateToSubmission = (id) => {
    navigate(`/submission/${id}`);
  };

  return (
    <>
    <Navbar/>
    <div className="staff-history">
      <h1 className="staff-history__title">Staff History</h1>
      <div className="staff-history__filters">
        <input
          type="text"
          placeholder="Search by Template Name or Student ID"
          value={search}
          onChange={handleSearch}
          className="staff-history__search-bar"
        />
        <select
          value={filterStatus}
          onChange={handleFilterStatus}
          className="staff-history__filter-select"
        >
          <option value="">All Statuses</option>
          <option value="Waiting Progress">Waiting Progress</option>
          <option value="Waiting for your approval">
            Waiting for your approval
          </option>
          <option value="Approved">Approved</option>
          <option value="Pending Resubmission">Pending Resubmission</option>
          <option value="Waiting Resubmission of You">
            Waiting Resubmission of You
          </option>
        </select>
        <div className="staff-history__view-toggle">
          <button
            onClick={() => setViewMode("list")}
            className={`staff-history__view-button ${
              viewMode === "list" ? "active" : ""
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`staff-history__view-button ${
              viewMode === "card" ? "active" : ""
            }`}
          >
            Card View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <table className="staff-history__table">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.templateName}</td>
                <td>{submission.userId}</td>
                <td>{submission.status}</td>
                <td className="staff-history__table-action">
                  <button
                    onClick={() => navigateToSubmission(submission._id)}
                    className="staff-history__view-button"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="staff-history__grid">
          {filteredSubmissions.map((submission) => (
            <div key={submission._id} className="staff-history__small-card">
              <h3 className="staff-history__small-card-title">
                {submission.templateName}
              </h3>
              <p className="staff-history__small-card-info">
                <strong>Student ID:</strong> {submission.userId}
              </p>
              <p className="staff-history__small-card-info">
                <strong>Status:</strong> {submission.status}
              </p>
              <button
                onClick={() => navigateToSubmission(submission._id)}
                className="staff-history__small-card-button"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default StaffHistory;
