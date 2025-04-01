import React, { useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const RejectNote = () => {
  const [rejectReason, setRejectReason] = useState("");
  const navigate = useNavigate();
  const submissionId = localStorage.getItem("submissionId");

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/reject/rejectSubmission", {
        submissionId,
        rejectReason,
      });

      if (response.status === 200) {
        alert("Submission rejected successfully.");
        navigate("/pendingapprovals");
      } else {
        alert("Failed to reject submission.");
      }
    } catch (error) {
      console.error("Error rejecting submission:", error);
      alert("An error occurred while rejecting the submission.");
    }
  };

  return (
    <div>
      <Navbar/>
      <h2>Reject Submission</h2>
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Enter reason for rejection..."
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={handleReject}>Reject</button>
    </div>
  );
};

export default RejectNote;