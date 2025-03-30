import React, { useState } from "react";
import axios from "axios";
import "../css/RequestMoreTime.css";
import { useNavigate, useParams } from "react-router-dom";

const RequestMoreTime = () => {
  const { resubmissionId } = useParams();
  const [reason, setReason] = useState("");
  const [additionalTime, setAdditionalTime] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(now.getDate() + 7);

    if (new Date(additionalTime) < now) {
      alert("The requested additional time cannot be in the past.");
      return;
    }

    if (new Date(additionalTime) > oneWeekLater) {
      alert("The requested additional time cannot exceed one week from today.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/resubmissions/form/time-requests", {
        resubmissionId,
        reason,
        requestingAdditionalTime: additionalTime,
      });
      alert("Request submitted successfully!");
      navigate(`/pendingresubmissions`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to submit the request. Please try again later.");
    }
  };

  return (
    <div className="request-more-time-container">
      <h1 className="request-more-time-title">Request More Time</h1>
      <form className="request-more-time-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reason" className="form-label">
            Reason for requesting more time:
          </label>
          <textarea
            id="reason"
            className="form-textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="additionalTime" className="form-label">
            Requesting additional time:
          </label>
          <input
            type="date"
            id="additionalTime"
            className="form-input"
            value={additionalTime}
            onChange={(e) => setAdditionalTime(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="form-submit-button"
          disabled={!reason || !additionalTime}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestMoreTime;
