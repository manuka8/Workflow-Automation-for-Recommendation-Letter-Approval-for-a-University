import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditResubmission.css';
import ReactQuill from "react-quill";

const EditResubmission = () => {
  const { resubmissionId } = useParams(); // Get resubmissionId from URL
  const navigate = useNavigate();
  const [resubmission, setResubmission] = useState(null); // Resubmission data
  const [submission, setSubmission] = useState(null); // Submission data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // Error state

  // Fetch resubmission and submission data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resubmissionResponse = await axios.get(`http://localhost:5000/api/resubmissions/resubmit/${resubmissionId}`);
        setResubmission(resubmissionResponse.data);
        console.log(resubmissionResponse.data);
        const submissionResponse = await axios.get(`http://localhost:5000/api/resubmissions/findsubmit/${resubmissionResponse.data.submissionId._id}`);
        setSubmission(submissionResponse.data);
        console.log()
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resubmissionId]);

  // Handle answer change for text, textarea, etc.
  const handleAnswerChange = (questionId, value) => {
    setSubmission((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === questionId ? { ...q, answer: value } : q
      ),
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (questionId, option, isChecked) => {
    setSubmission((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === questionId
          ? {
              ...q,
              answer: isChecked
                ? [...q.answer, option] // Add option if checked
                : q.answer.filter((ans) => ans !== option), // Remove option if unchecked
            }
          : q
      ),
    }));
  };
