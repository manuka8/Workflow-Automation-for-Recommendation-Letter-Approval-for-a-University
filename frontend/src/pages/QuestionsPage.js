import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [hierarchy, setHierarchy] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const staffId = localStorage.getItem('ID');
        const submissionId = localStorage.getItem('submissionId');

        if (!staffId || !submissionId) {
          throw new Error('Missing staffId or submissionId in local storage');
        }

        const response = await axios.get(`http://localhost:5000/api/pending-approvals/questions/${submissionId}`, {
          params: { staffId },
        });

        setQuestions(response.data.questions || []); 
        setHierarchy(response.data.hierarchy || []); 
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch submission data');
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, []);
  const handleApprove = async () => {
    try {
      const staffId = localStorage.getItem('ID');
      const submissionId = localStorage.getItem('submissionId');

      await axios.put(`http://localhost:5000/api/pending-approvals/${submissionId}/approve`, { staffId });

      alert('Submission approved successfully!');
      setHierarchy((prevHierarchy) =>
        prevHierarchy.map((item) =>
          item.staffId === staffId ? { ...item, approved: true } : item
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to approve the submission.');
    }
  };

  const handleResubmission = () => {
    navigate('/resubmit-note');
  };

  const handleReject = () => {
    navigate('/reject-note');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Questions and Answers</h1>
      {questions.length === 0 ? (
        <p>No questions available for you.</p>
      ) : (
        <ul>
          {questions.map((q, index) => (
            <li key={index} style={{ marginBottom: '15px' }}>
              <strong>Question:</strong> {q.question} <br />
              <strong>Answer:</strong> {q.answer.toString()} <br />
              <em>Visibility:</em> {q.visibility}
            </li>
          ))}
        </ul>
      )}

<div style={{ marginTop: '20px' }}>
        <button
          onClick={handleApprove}
          style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          Approve
        </button>
        <button
          onClick={handleResubmission}
          style={{ marginRight: '10px', backgroundColor: 'orange', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          Resubmission
        </button>
        <button
          onClick={handleReject}
          style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default QuestionsPage;