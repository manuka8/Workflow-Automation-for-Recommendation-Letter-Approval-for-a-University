import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/ViewDetails.css"; // Import CSS file
import Navbar from "../components/Navbar";

const ViewDetails = () => {
  const { submittedId } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/submissions/view-details/${submittedId}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching submission details:", error);
      }
    };

    fetchDetails();
  }, [submittedId]);

  if (!details) return <p className="viewdetails-loading">Loading...</p>;

  const { templateName, submittedAt, hierarchy } = details;

  const getStatus = (index) => {
    const beforeSteps = hierarchy.slice(0, index);
    const afterSteps = hierarchy.slice(index + 1);

    const allBeforeApproved = beforeSteps.every((step) => step.approved);
    const hasPending = hierarchy[index].pending;

    if (hierarchy[index].approved) {
      return "Already Approved";
    }

    if (hasPending && allBeforeApproved) {
      return "Pending Resubmission";
    }

    if (!hasPending && allBeforeApproved) {
      return "Pending Approval";
    }

    return "Waiting Approve";
  };

  return (
    <><Navbar backLink="/realtimetracking"/>
    <div className="viewdetails-container">
      <header className="viewdetails-header">
        <h1 className="viewdetails-title">Template: {templateName}</h1>
        <p className="viewdetails-date">
          Submitted Date: {new Date(submittedAt).toLocaleDateString()}
        </p>
      </header>
      <main className="viewdetails-main">
        <h2 className="viewdetails-subtitle">Hierarchy Details</h2>
        <ul className="viewdetails-list">
          {hierarchy.map((step, index) => (
            <li key={index} className="viewdetails-list-item">
              <p className="viewdetails-position">
                <strong>Position:</strong> {step.position}
              </p>
              <p className="viewdetails-staff">
                <strong>Staff ID:</strong> {step.staffId}
              </p>
              <p className={`viewdetails-status viewdetails-status-${getStatus(index).toLowerCase().replace(" ", "-")}`}>
                <strong>Status:</strong> {getStatus(index)}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
    </>
  );
};

export default ViewDetails;
