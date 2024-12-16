import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DefineFormat = () => {
  const { templateId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/templates/${templateId}/hierarchy`);
        const data = await response.json();
        setHierarchy(data.hierarchy || []);
      } catch (err) {
        console.error('Error fetching hierarchy:', err);
      }
    };

    fetchHierarchy();
  }, [templateId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answerType: 'text', options: [], visibility: 'all' }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[questionIndex].options];
    updatedOptions[optionIndex] = value;
    newQuestions[questionIndex].options = updatedOptions;
    setQuestions(newQuestions);
  };

  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    const updatedOptions = [...newQuestions[index].options, ''];
    newQuestions[index].options = updatedOptions;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/templates/${templateId}/format`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        navigate('/admin-dashboard');
      } else {
        alert('Failed to define format');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Define Format for Letter Template</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
            
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
              style={{ marginBottom: '10px', width: '100%' }}
            />

            
            <select
              value={q.answerType}
              onChange={(e) => handleQuestionChange(index, 'answerType', e.target.value)}
              style={{ marginBottom: '10px' }}
            >
              <option value="text">Text Box</option>
              <option value="checkbox">Check Box</option>
              <option value="radio">Radio Button</option>
              <option value="upload">Document Upload</option>
            </select>

            
            {['checkbox', 'radio'].includes(q.answerType) && (
              <div>
                <h4>Options:</h4>
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} style={{ marginBottom: '5px' }}>
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      style={{ marginRight: '10px' }}
                    />
                  </div>
                ))}
                <button type="button" onClick={() => handleAddOption(index)}>
                  Add Option
                </button>
              </div>
            )}

            
            <div style={{ marginTop: '10px' }}>
              <h4>Set Privacy:</h4>
              <select
                value={q.visibility}
                onChange={(e) => handleQuestionChange(index, 'visibility', e.target.value)}
              >
                <option value="all">View All Members in Hierarchy</option>
                {hierarchy.map((member, idx) => (
                  <option key={idx} value={member.staffId}>
                    {member.position} - {member.staffId}
                  </option>
                ))}
              </select>
            </div>

            
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              style={{ marginTop: '10px', color: 'red' }}
            >
              Remove Question
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddQuestion} style={{ marginTop: '20px' }}>
          Add Question
        </button>

        <button type="submit" style={{ marginTop: '20px' }}>
          Publish Template
        </button>
      </form>
    </div>
  );
};

export default DefineFormat;