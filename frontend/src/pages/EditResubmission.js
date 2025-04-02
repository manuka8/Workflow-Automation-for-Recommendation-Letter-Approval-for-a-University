import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditResubmission.css';
import ReactQuill from "react-quill";

const EditResubmission = () => {
  const { resubmissionId } = useParams(); 
  const navigate = useNavigate();
  const [resubmission, setResubmission] = useState(null);
  const [submission, setSubmission] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 

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

  
  const handleAnswerChange = (questionId, value) => {
    setSubmission((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === questionId ? { ...q, answer: value } : q
      ),
    }));
  };

 
  const handleCheckboxChange = (questionId, option, isChecked) => {
    setSubmission((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q._id === questionId
          ? {
              ...q,
              answer: isChecked
                ? [...q.answer, option] 
                : q.answer.filter((ans) => ans !== option), 
            }
          : q
      ),
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.put(
        `http://localhost:5000/api/resubmissions/update/${submission._id}/${resubmissionId}`,
        submission
      );

      console.log(submission);
      
      const submissionData = {
        submittedDate: new Date().toISOString().split('T')[0], // Current date
        questions: submission.questions, 
        selectedHierarchy: submission.hierarchy, 
        userId: submission.userId, 
      };
  
      if(response){
        navigate('/successresubmission', {
          state: {
            submissionData,
          },
        });
      }
    } catch (err) {
      setError('Failed to update submission. Please try again.');
      console.error(err);
    }
  };

  
  const renderQuestion = (question) => {
    switch (question.answerType) {
      case 'text':
        return (
          <div key={question._id} className="form-group">
            <input
              type="text"
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="form-control"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={question._id} className="form-group">
            <textarea
              value={question.answer || ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="form-control"
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={question._id} className="form-group">
            {question.options.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="checkbox"
                  checked={question.answer?.includes(option) || false}
                  onChange={(e) =>
                    handleCheckboxChange(question._id, option, e.target.checked)
                  }
                  className="form-check-input"
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div key={question._id} className="form-group">
            {question.options.map((option) => (
              <div key={option} className="form-check">
                <input
                  type="radio"
                  checked={question.answer === option}
                  onChange={() => handleAnswerChange(question._id, option)}
                  className="form-check-input"
                />
                <label className="form-check-label">{option}</label>
              </div>
            ))}
          </div>
        );
        case 'text-editor':
          return (
            <div key={question._id} className="edit-resubmission-form-group">
              <ReactQuill
                className="edit-resubmission-text-editor"
                value={question.answer || ''}
                onChange={(value) => handleAnswerChange(question._id, value)}
              />
            </div>
          );
      case 'single_date':
        return (
          <div key={question._id} className="form-group">
            
            <input
              type="date"
              value={question.answer ? question.answer.split('T')[0] : ''}
              onChange={(e) => handleAnswerChange(question._id, e.target.value)}
              className="form-control"
            />
          </div>
        );

      case 'duration':
        return (
          <div key={question._id} className="form-group">
            <div className="row">
              <div className="col">
                Start Date
                <input
                  type="date"
                  value={question.answer?.start ? question.answer.start.split('T')[0] : ''}
                  onChange={(e) =>
                    handleAnswerChange(question._id, {
                      ...question.answer,
                      start: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
              <div className="col">
                End Date
                <input
                  type="date"
                  value={question.answer?.end ? question.answer.end.split('T')[0] : ''}
                  onChange={(e) =>
                    handleAnswerChange(question._id, {
                      ...question.answer,
                      end: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="edit-resubmission-container">
    <h1 className="edit-resubmission-title">Edit Resubmission</h1>
    <p className="edit-resubmission-note">Resubmission Note: {resubmission.note}</p>
    {error && <div className="edit-resubmission-error">{error}</div>}
    <form onSubmit={handleSubmit}>
      {submission.questions.map((question) => (
        <div key={question._id} className="edit-resubmission-form-group">
          <label className="edit-resubmission-label">{question.question}</label>
          {renderQuestion(question)}
        </div>
      ))}
      <button type="submit" className="edit-resubmission-submit-button">
        Submit
      </button>
    </form>
  </div>
    );
};

export default EditResubmission;