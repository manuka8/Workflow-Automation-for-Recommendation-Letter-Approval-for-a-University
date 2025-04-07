import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/PendingResubmission.css';
import Navbar from '../components/Navbar';

const PendingResubmission = () => {
  const [resubmissions, setResubmissions] = useState([]);
  const [filteredResubmissions, setFilteredResubmissions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const userType = localStorage.getItem("type");
  const userId = localStorage.getItem('ID');

  useEffect(() => {
    const fetchResubmissions = async () => {
      try {
        const resubmissionResponse = await axios.get(
          `http://localhost:5000/api/resubmissions/findresubmissions?userId=${userId}`
        );
        const resubmissionsData = resubmissionResponse.data;

        const populatedResubmissions = await Promise.all(
          resubmissionsData.map(async (resubmission) => {
            try {
              const submissionResponse = await axios.get(
                `http://localhost:5000/api/resubmissions/submissions/${resubmission.submissionId}`
              );
              const submissionData = submissionResponse.data;

              return {
                ...resubmission,
                templateName: submissionData.templateId.templateName,
                submittedAt: submissionData.submittedAt,
                moreTimeRequested: resubmission.moreTimeRequested || false, // Flag for more time requested
              };
            } catch (error) {
              console.error(
                `Error fetching submission for ID: ${resubmission.submissionId}`,
                error
              );
              return null;
            }
          })
        );

        const validResubmissions = populatedResubmissions.filter(Boolean);
        setResubmissions(validResubmissions);
        setFilteredResubmissions(validResubmissions);
      } catch (error) {
        console.error('Error fetching resubmissions:', error);
      }
    };

    fetchResubmissions();
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);

    if (query === '') {
      setFilteredResubmissions(resubmissions);
    } else {
      const filtered = resubmissions.filter((resubmission) =>
        resubmission._id.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResubmissions(filtered);
    }
  };

  const handleButtonClick = (resubmission, action) => {
    if (action === 'edit') {
      navigate(`/edit-resubmission/${resubmission._id}`);
    } else if (action === 'request-time') {
      navigate(`/request-time/${resubmission._id}`);
    }
  };

  const renderCountdown = (deadline) => {
    const timeLeft = new Date(deadline) - currentTime;

    if (timeLeft <= 0) {
      return 'Deadline Passed';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getActionButton = (resubmission) => {
    if (resubmission.moreTimeRequested) {
      return <span className="more-time-requested">More Time Requested</span>;
    }

    const timeLeft = new Date(resubmission.deadline) - currentTime;

    if (timeLeft <= 0) {
      return (
        <button
          className="request-time-button"
          onClick={() => handleButtonClick(resubmission, 'request-time')}
        >
          Request More Time
        </button>
      );
    }

    return (
      <button
        className="edit-resubmission-button"
        onClick={() => handleButtonClick(resubmission, 'edit')}
      >
        Review & Edit
      </button>
    );
  };

  return (
    <>
    {
          userType==='student'?<Navbar backLink="/studentdashboard" />:<Navbar backLink="/staffdashboard" />
     }
    <div className="pending-resubmissions-container">
      <h1 className="pending-resubmissions-title">Pending Resubmissions</h1>

      <input
        type="text"
        placeholder="Search by Resubmission ID..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-box"
      />

      {filteredResubmissions.length > 0 ? (
        <table className="pending-resubmissions-table">
          <thead>
            <tr>
              <th>Resubmission ID</th>
              <th>Template Name</th>
              <th>Submitted Date</th>
              <th>Deadline Countdown</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResubmissions.map((resubmission) => (
              <tr key={resubmission._id}>
                <td>{resubmission._id}</td>
                <td>{resubmission.templateName}</td>
                <td>{new Date(resubmission.submittedAt).toLocaleDateString()}</td>
                <td>{renderCountdown(resubmission.deadline)}</td>
                <td>{getActionButton(resubmission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-resubmissions-message">No pending resubmissions found.</p>
      )}
    </div>
    </>
  );
};

export default PendingResubmission;
