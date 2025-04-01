import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ResubmitNote.css";

const ResubmitNote = () => {
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const staffId = localStorage.getItem("ID");
      const submissionId = localStorage.getItem("submissionId");
      setIsDisabled(true);
      await axios.post(
        `http://localhost:5000/api/resubmissions/${submissionId}`,
        {
          note,
          deadline,
          staffId,
        }
      );
      alert("Resubmission note and deadline set successfully!");
      navigate("/pendingapprovals");
    } catch (error) {
      console.error("Error saving resubmission note:", error);
      setError("Failed to save resubmission note.");
    }
  };

  return (
    <div className="resubmit-container">
      <h1 className="resubmit-title">Resubmit Note</h1>
      {error && <p className="resubmit-error">{error}</p>}

      <div className="resubmit-form">
        <label className="resubmit-label">
          Resubmit Note:
          <textarea
            className="resubmit-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        <label className="resubmit-label">
          Resubmit Deadline:
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </label>

        <button
          className="resubmit-button"
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{
            backgroundColor: "#2f00ff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ResubmitNote;
