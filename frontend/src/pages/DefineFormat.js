import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../css/DefineFormat.module.css';

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
        alert('Template format successfully updated!');
        navigate('/admindashboard');
      } else {
        alert('Failed to define format');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.definePageWrapper}>
      <div className={styles.formatFormContainer}>
        <h2 className={styles.templateHeader}>Define Format of New Letter Template</h2>
        <form className={styles.templateForm} onSubmit={handleSubmit}>
          {questions.map((q, index) => (
            <div key={index} className={styles.questionBox}>
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                required
                className={styles.templateInputField}
              />

              <select
                value={q.answerType}
                onChange={(e) => handleQuestionChange(index, 'answerType', e.target.value)}
                className={styles.templateSelectDropdown}
              >
                <option value="text">Text Box</option>
                <option value="checkbox">Check Box</option>
                <option value="radio">Radio Button</option>
                <option value="textarea">Textarea</option>
                <option value="text-editor">Text Editor</option>
                <option value="upload">Document Upload</option>
              </select>

              {['checkbox', 'radio'].includes(q.answerType) && (
                <div>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex}>
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                        className={styles.optionField}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className={styles.addOptionBtn}
                  >
                    Add Option
                  </button>
                </div>
              )}
              <p>Setup privacy of question</p>
              <select
                value={q.visibility}
                onChange={(e) => handleQuestionChange(index, 'visibility', e.target.value)}
                className={styles.visibilitySelect} 
              >
                <option value="all">View All Members in Hierarchy</option>
                {hierarchy.map((member, idx) => (
                  <option key={idx} value={member.staffId}>
                    {member.position} - {member.staffId}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className={styles.removeQuestionBtn}
              >
                Remove Question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className={styles.addQuestionBtn}
          >
            Add Question
          </button>

          <button type="submit" className={styles.publishTemplateBtn}>
            Publish Template
          </button>
        </form>
      </div>
    </div>
  );
};

export default DefineFormat;
