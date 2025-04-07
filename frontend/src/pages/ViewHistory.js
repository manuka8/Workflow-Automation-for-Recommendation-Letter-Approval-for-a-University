import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/ViewHistory.css'; 
import Navbar from "../components/Navbar";

const ViewHistory = () => {
  const { id } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [templateName, setTemplateName] = useState("");
  const navigate = useNavigate();
  const userType = localStorage.getItem("type");
  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/submissions/viewhistory/${id}`);
        setSubmissionData(res.data);
        setTemplateName(res.data.templateId.templateName);

        const countRes = await axios.get(`http://localhost:5000/api/submissions/count/${res.data.userId}/${res.data.templateId}`);
        setSubmissionCount(countRes.data.count);
      } catch (error) {
        console.error("Error fetching submission data:", error);
      }
    };

    fetchSubmissionData();
  }, [id]);

  if (!submissionData) return <div className="view-history-container">Loading...</div>;

  const submissionMessage = submissionCount === 1 ? "First Submit" : submissionCount > 10 ? "More than 10 submissions" : submissionCount;

  const handlePendingApprovalClick = () => {
    navigate("/pendingapprovals");
  };

  return (
    <>
    {
          userType==='student'?<Navbar backLink="/realtimetracking" />:<Navbar backLink="/viewhistory" />
    }
    <div className="view-history-wrapper">
      <h1 className="view-history-header">View Submission History</h1>
      <div className="view-history-submission-info">
        <p className="view-history-paragraph"><strong>Submitted User ID:</strong> {submissionData.userId}</p>
        <p className="view-history-paragraph"><strong>Template Name:</strong> {templateName}</p>
        <p className="view-history-paragraph"><strong>Submission Count:</strong> {submissionMessage}</p>
      </div>

      <div className="view-history-hierarchy">
        <h3 className="view-history-hierarchy-title">Hierarchy Status</h3>
        <table className="view-history-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Position</th>
              <th>Staff ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {submissionData.hierarchy.map((step, index) => {
              let status = "Waiting for Approval";
              if (step.pending) status = "Pending Resubmission";
              else if (step.approved) status = `Approved by ${step.staffId}`;

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{step.position}</td>
                  <td>{step.staffId}</td>
                  <td className={`status ${status.toLowerCase().replace(/ /g, "-")}`}>{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {submissionData.hierarchy.some(step => step.pending) && (
        <button className="view-history-pending-btn" onClick={handlePendingApprovalClick}>Show Pending Approval</button>
      )}
    </div>
    </>
  );
};

export default ViewHistory;
