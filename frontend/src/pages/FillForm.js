import React, { useState, useEffect } from 'react';

const FillForm = () => {
    return(
        <div>
        <h2>Fill the Form</h2>
        <form>
          {questions.map((question, index) => (
            <div key={index}>
              <h4>{question.question}</h4>
              {question.answerType === 'text' && (
                <input
                  type="text"
                  value={question.answer || ''}
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
                    />
                    <label>{option}</label>
                  </div>
                ))}
              {question.answerType === 'upload' && (
                <input
                  type="file"
                />
              )}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
        </div>
    )
}