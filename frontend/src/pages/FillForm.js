import React, { useState, useEffect } from 'react';

const FillForm = () => {
    const [questions, setQuestions] = useState([]);const templateId = localStorage.getItem('templateId');

    useEffect(() => {
        const fetchTemplate = async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/templates/findalltemplates/${templateId}`);
            const data = await response.json();
            setQuestions(data.questions || []);
          } catch (err) {
            console.error('Error fetching template:', err);
          }
        };
    
        fetchTemplate();
      }, [templateId]);

    const handleInputChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = value;
        setQuestions(updatedQuestions);
      };
    
    const handleCheckboxChange = (index, option) => {
        const updatedQuestions = [...questions];
        const selectedOptions = updatedQuestions[index].answer || []; 
    
        if (selectedOptions.includes(option)) {
          updatedQuestions[index].answer = selectedOptions.filter((opt) => opt !== option);
        } else {
          updatedQuestions[index].answer = [...selectedOptions, option];
        }
    
        setQuestions(updatedQuestions);
    };
    
    return(
        <div>
        <h2>Fill the Form</h2>
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index}>
              <h4>{question.question}</h4>
              {question.answerType === 'text' && (
                <input
                  type="text"
                  value={question.answer || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  required
                />
              )}
              {question.answerType === 'radio' &&
                question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={question.answer === option}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                    <label>{option}</label>
                  </div>
                ))}
              {question.answerType === 'checkbox' &&
                question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={Array.isArray(question.answer) && question.answer.includes(option)}
                      onChange={() => handleCheckboxChange(index, option)}
                    />
                    <label>{option}</label>
                  </div>
                ))}
              {question.answerType === 'upload' && (
                <input
                  type="file"
                  onChange={(e) => handleInputChange(index, e.target.files[0]?.name || '')}
                />
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
        </div>
    )
}