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