import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ViewRequest.css';

const ViewRequest = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [requestDetails, setRequestDetails] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newDeadline, setNewDeadline] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/resubmissions/view-request/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRequestDetails(data.data);
        }
      })
      .catch((error) => console.error('Error fetching request details:', error));
  }, [id]);

  const handleReject = () => {
    fetch(`http://localhost:5000/api/resubmissions/delete-request/${id}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Request rejected and resubmission deleted.');
          navigate('/requests');
        }
      })
      .catch((error) => console.error('Error rejecting request:', error));
  };

  const handleExtend = () => {
    if (!newDeadline) {
      alert('Please select a new deadline.');
      return;
    }

    fetch(`http://localhost:5000/api/resubmissions/extend-deadline/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newDeadline }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Deadline extended successfully.');
          navigate('/requests');
        }
      })
      .catch((error) => console.error('Error extending deadline:', error));
  };

  if (!requestDetails) {
    return <div>Loading...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="view-request-container">
      <h1 className="view-request-header">View Request</h1>
      <p className="view-request-detail"><strong>User ID:</strong> {requestDetails.resubmissionId.userId}</p>
      <p className="view-request-detail"><strong>Request Type:</strong> Resubmission More Time Request</p>
      <p className="view-request-detail"><strong>Reason:</strong> {requestDetails.reason}</p>

      {showDatePicker && (
        <div className="date-picker-container">
          <label htmlFor="newDeadline">Select New Deadline:</label>
          <input
            type="date"
            id="newDeadline"
            value={newDeadline}
            min={today}
            max={maxDateString}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <button className="btn confirm-btn" onClick={handleExtend}>Confirm</button>
        </div>
      )}

      <div className="button-container">
        <button className="btn reject-btn" onClick={handleReject}>Reject Request</button>
        <button className="btn extend-btn" onClick={() => setShowDatePicker(true)}>Extend Deadline</button>
      </div>
    </div>
  );
};

export default ViewRequest;
