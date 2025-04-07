import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PendingApprovals.css";
import Navbar from "../components/Navbar";

const PendingApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filteredApprovals, setFilteredApprovals] = useState([]);
  const navigate = useNavigate();

  const staffId = localStorage.getItem("ID");

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        if (!staffId) {
          setError("Staff ID not found in localStorage.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/pending-approvals/submissions-by-staff?staffId=${staffId}`
        );

        setPendingApprovals(response.data.submissions);
        setFilteredApprovals(response.data.submissions);
      } catch (err) {
        console.error("Error fetching pending approvals:", err);
        setError("Failed to fetch pending approvals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [staffId]);

  const handleSubmissionClick = (submissionId) => {
    localStorage.setItem("submissionId", submissionId);
    navigate("/approve-submission");
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    setFilteredApprovals(
      pendingApprovals.filter(
        (submission) =>
          submission.templateName.includes(value) ||
          submission.userId.includes(value)
      )
    );
  };

  const handleDateFilter = (e) => {
    const value = e.target.value;
    setFilterDate(value);

    setFilteredApprovals(
      pendingApprovals.filter(
        (submission) =>
          new Date(submission.submittedAt).toISOString().split("T")[0] === value
      )
    );
  };

  return (
    <>
      <Navbar backLink="/staffdashboard" />
      <div className="pending-approvals-container">
        <h1 className="pending-approvals-title">Pending Approvals</h1>
        {loading ? (
          <p className="pending-approvals-loading">Loading...</p>
        ) : error ? (
          <p className="pending-approvals-error">{error}</p>
        ) : (
          <div className="pending-approvals-content">
            <div className="pending-approvals-filters">
              <input
                type="text"
                className="pending-approvals-search"
                placeholder="Search by template name or user ID"
                value={search}
                onChange={handleSearch}
              />
              <input
                type="date"
                className="pending-approvals-date-filter"
                value={filterDate}
                onChange={handleDateFilter}
              />
            </div>

            {filteredApprovals.length > 0 ? (
              <table className="pending-approvals-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Template Name</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApprovals.map((submission) => (
                    <tr
                      key={submission.submissionId}
                      className="pending-approvals-row"
                    >
                      <td>{submission.userId}</td>
                      <td>{submission.templateName || "N/A"}</td>
                      <td>
                        {new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="view-qa-button"
                          onClick={() => handleSubmissionClick(submission.submissionId)}
                        >
                          View Q&A
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="pending-approvals-empty">
                No pending approvals found.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PendingApprovals;
