import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/RealtimeTracking.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const RealtimeTracking = () => {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("ID");
      
      const params = new URLSearchParams();
      params.append('userId', userId);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (startDate) params.append('startDate', new Date(startDate).toISOString());
      if (endDate) params.append('endDate', new Date(endDate).toISOString());
      if (status) params.append('status', status);

      const response = await axios.get(
        "http://localhost:5000/api/submissions/findsubmissions",
        { params }
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchSubmissions();
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search, sort, startDate, endDate, status]);

  const handleViewDetails = (submittedId) => {
    navigate(`/viewdetails/${submittedId}`);
  };
  const userType = localStorage.getItem("type");
  const getSubmissionStatus = (submission) => {
    if (submission.resubmit) return "Pending Resubmission";
    if (submission.reject) return "Rejected";
    if (submission.hierarchy.every((step) => step.approved)) return "Final Approved";
    return "In Progress";
  };

  return (
    <>
      {
          userType==='student'?<Navbar backLink="/studentdashboard" />:<Navbar backLink="/staffdashboard" />
        }
      <div className="realtime-tracking">
        <h1 className="tracking-header">Realtime Tracking</h1>
        <div className="tracking-controls">
          <input
            type="text"
            className="tracking-search-box"
            placeholder="Search by template name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="tracking-sort-dropdown"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="asc">Sort by Date: Ascending</option>
            <option value="desc">Sort by Date: Descending</option>
          </select>
          <input
            type="date"
            className="tracking-date-picker"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="tracking-date-picker"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="tracking-status-dropdown"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending Resubmission">Pending Resubmission</option>
            <option value="Rejected">Rejected</option>
            <option value="Final Approved">Final Approved</option>
            <option value="In Progress">In Progress</option>
          </select>
          <button
            className="tracking-view-toggle"
            onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}
          >
            {viewMode === "card" ? "Switch to List View" : "Switch to Card View"}
          </button>
        </div>

        {isLoading ? (
          <div className="tracking-loading">Loading submissions...</div>
        ) : submissions.length === 0 ? (
          <div className="tracking-no-results">No submissions found</div>
        ) : viewMode === "card" ? (
          <div className="tracking-submissions-list">
            {submissions.map((submission) => (
              <div key={submission._id} className="tracking-submission-card">
                <h3 className="tracking-submission-title">
                  {submission.templateId?.templateName || "Unknown Template"}
                </h3>
                <p className="tracking-submission-info">
                  Submitted At: {new Date(submission.submittedAt).toLocaleDateString()}
                </p>
                <p className="tracking-submission-info">
                  Status: {getSubmissionStatus(submission)}
                </p>
                <div className="tracking-actions">
                  <button
                    className="tracking-view-details"
                    onClick={() => handleViewDetails(submission._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="tracking-submissions-table">
            <thead>
              <tr>
                <th>Template Name</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.templateId?.templateName || "Unknown Template"}</td>
                  <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                  <td>{getSubmissionStatus(submission)}</td>
                  <td>
                    <button
                      className="tracking-view-details"
                      onClick={() => handleViewDetails(submission._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default RealtimeTracking;