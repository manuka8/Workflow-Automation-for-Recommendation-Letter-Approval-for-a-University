import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/QuestionsPage.css";
import Navbar from "../components/Navbar";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [submission, setSubmission] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const submissionId = localStorage.getItem("submissionId");
        const staffId = localStorage.getItem("ID");

        if (!submissionId || !staffId) {
          throw new Error("Missing submissionId or staffId in local storage");
        }

        const response = await axios.get(
          `http://localhost:5000/api/pending-approvals/questions/${submissionId}`,
          {
            params: { staffId },
          }
        );
        setSubmission(response.data.submission);
        setQuestions(response.data.questions || []);
        setIsFinalStep(response.data.isFinalStep); // Set isFinalStep based on the response
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch questions");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleApprove = async () => {
    try {
      const staffId = localStorage.getItem("ID");
      const submissionId = localStorage.getItem("submissionId");

      await axios.put(
        `http://localhost:5000/api/pending-approvals/${submissionId}/approve`,
        { staffId }
      );

      alert("Submission approved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve the submission.");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null/undefined
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };
  const handleFinalApprove = async () => {
    try {
      const staffId = localStorage.getItem("ID");
      const submissionId = localStorage.getItem("submissionId");

      await axios.put(
        `http://localhost:5000/api/pending-approvals/${submissionId}/approve`,
        { staffId }
      );

      alert("Final approval granted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to give final approval.");
    }
  };

  const handleResubmission = () => {
    navigate("/resubmit-note");
  };

  const handleReject = () => {
    navigate("/reject-note");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  console.log(questions);
  return (
    <div className="form-content-wrapper">
  <Navbar backLink="/pendingapprovals" />
  <div className="form-content-container">
    <h1 className="form-content-title">Form Content</h1>
    <div className="form-content-layout">
      {/* Left Side: Q&A Section */}
      <div className="form-content-questions">
        <h3 className="form-content-subtitle">Q&A</h3>
        {questions.length === 0 ? (
          <p className="form-content-no-questions">No questions available for you.</p>
        ) : (
          <ul className="form-content-question-list">
            {questions.map((q, index) => (
              <li key={index} className="form-content-question-item">
                <div className="form-content-question-text">
                  <strong>Question:</strong> {q.question}
                </div>
                <div className="form-content-answer">
                  {/* Check if answer is a file */}
                  {typeof q.answer === "string" &&
                  /\.(pdf|jpg|jpeg|png|gif|docx|xlsx)$/i.test(q.answer) ? (
                    <div>
                      <strong>Answer is a file:</strong>
                      <a
                        href={`http://localhost:5000/${q.answer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="form-content-file-link"
                      >
                        Open File in New Tab
                      </a>
                    </div>
                  ) : /* Check if answer contains HTML */
                  typeof q.answer === "string" &&
                    q.answer.includes("<") &&
                    q.answer.includes(">") ? (
                    <div>
                      <strong>Answer:</strong>
                      <div
                        dangerouslySetInnerHTML={{ __html: q.answer }}
                        className="form-content-html-answer"
                      />
                    </div>
                  ) : /* Check for date-based answer types */
                  ["single_date", "single_date_future"].includes(q.answerType) &&
                  typeof q.answer === "string" ? (
                    <div>
                      <strong>Answer:</strong> {formatDate(q.answer)}
                    </div>
                  ) : ["duration", "duration_future"].includes(q.answerType) &&
                    q.answer &&
                    typeof q.answer === "object" ? (
                    <div>
                      <strong>Start Date:</strong> {formatDate(q.answer.start)}
                      <br />
                      <strong>End Date:</strong> {formatDate(q.answer.end)}
                    </div>
                  ) : (
                    <div>
                      <strong>Answer:</strong> {String(q.answer)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Side: Submission Information */}
      <div className="form-content-submission-info">
        <div className="form-content-submission-details">
          <h4 className="form-content-submission-title">Submission Informations</h4>
          <p className="form-content-submission-text">
            <strong>User ID:</strong> {submission.userId}
          </p>
          <p className="form-content-submission-text">
            <strong>Submitted At:</strong>{" "}
            {new Date(submission.submittedAt).toLocaleString()}
          </p>
          <Link
            to={`/review-user/${submission.userId}`}
            className="form-content-review-link"
          >
            Review User Information
          </Link>
        </div>
      </div>
    </div>

    {/* Buttons Section */}
    <div className="form-content-buttons">
      {isFinalStep ? (
        <button
          onClick={handleFinalApprove}
          className="form-content-button form-content-button-final-approve"
        >
          Final Approve
        </button>
      ) : (
        <button
          onClick={handleApprove}
          className="form-content-button form-content-button-approve"
        >
          Approve
        </button>
      )}
      <button
        onClick={handleResubmission}
        className="form-content-button form-content-button-resubmission"
      >
        Resubmission
      </button>
      <button
        onClick={handleReject}
        className="form-content-button form-content-button-reject"
      >
        Reject
      </button>
    </div>
  </div>
</div>
  );
};

export default QuestionsPage;
