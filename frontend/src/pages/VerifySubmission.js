import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/VerifySubmission.css";

const VerifySubmission = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/submissions//verify/${submissionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch submission data");
        }
        const data = await response.json();
        setSubmission(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  if (loading) return <p className="verify-loading">Loading...</p>;
  if (error) return <p className="verify-error">Error: {error}</p>;
  if (!submission) return <p className="verify-error">No submission found.</p>;

  const isFullyApproved = submission.hierarchy.every((level) => level.approved);
  const statusMessage = isFullyApproved
    ? "This is a valid document and fully approved."
    : "In progress";

  return (
    <div className="verify-container">
      <h1 className="verify-title">Submission Verification</h1>
      <p className="verify-user"><strong>User ID:</strong> {submission.userId}</p>
      <h2 className="verify-subtitle">Approval Hierarchy</h2>
      <table className="verify-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Staff ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {submission.hierarchy.map((level, index) => (
            <tr key={index}>
              <td>{level.position}</td>
              <td>{level.staffId}</td>
              <td className={`status-${level.approved ? "approved" : level.pending ? "pending" : "resubmit"}`}>
                {level.approved ? "Approved" : level.pending ? "Pending" : "Resubmission"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="verify-status">
        <h2>Status</h2>
        <p className="verify-status-message">{statusMessage}</p>
      </div>
    </div>
  );
};

export default VerifySubmission;
