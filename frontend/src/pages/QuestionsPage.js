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