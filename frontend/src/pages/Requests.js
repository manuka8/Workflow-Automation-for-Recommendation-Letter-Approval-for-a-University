import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const staffId = localStorage.getItem('ID'); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/resubmissions/requests?staffId=${staffId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
      });
  }, [staffId]);

  const handleViewRequest = (requestId) => {
    navigate(`/ViewRequest/${requestId}`);
  };

  return (
    <div className="requests-container">
      <h1 className="requests-header">Resubmission Time Requests</h1>
      {requests.length > 0 ? (
        <ul className="requests-list">
          {requests.map((request) => (
            <li
              key={request._id}
              className="request-item"
              onClick={() => handleViewRequest(request._id)}
            >
              <div className="request-type">Request Type: Resubmission More Time Request</div>
              <div className="request-user">User ID: {request.resubmissionId.userId}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-requests-message">No requests available for your review.</p>
      )}
    </div>
  );
};

export default Requests;
