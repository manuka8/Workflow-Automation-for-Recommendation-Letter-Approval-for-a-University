import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../css/FillForm.css";
import Navbar from "../components/Navbar";
import Select from "react-select"; 

const FillForm = () => {
  const [questions, setQuestions] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [approvalPath, setApprovalPath] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState([]);
  const [dates, setDates] = useState({});
  const [duplicate, setDuplicate] = useState(false);
  const [predefinedHierarchy, setPredefinedHierarchy] = useState([]);
  const templateId = localStorage.getItem("templateId");
  const userId = localStorage.getItem("ID");
  const type = localStorage.getItem("type");

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/templates/findalltemplates/${templateId}`
        );
        const data = await response.json();
        setQuestions(data.questions || []);
        setTemplateName(data.templateName);
        console.log(data.templateName);
        setDuplicate(data.duplicateSubmissionAllowed);
        setPredefinedHierarchy(data.hierarchy || []); 
      } catch (err) {
        console.error("Error fetching template:", err);
      }
    };
    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    if (approvalPath) {
      fetchStaff();
    }
  }, [approvalPath]);

  const fetchStaff = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/staff/findstaff?approvalPath=${approvalPath}&userId=${userId}&type=${type}`
      );
      const data = await response.json();
      console.log(data);
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const handleInputChange = (index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => (i === index ? { ...q, answer: value } : q))
    );
  };

  const handleCheckboxChange = (index, option) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) => {
        if (i === index) {
          const selectedOptions = q.answer || [];
          return {
            ...q,
            answer: selectedOptions.includes(option)
              ? selectedOptions.filter((opt) => opt !== option)
              : [...selectedOptions, option],
          };
        }
        return q;
      })
    );
  };

  const generateUniqueFilename = (file) => {
    const fileExtension = file.name.split(".").pop();
    const uniqueNumber = Math.floor(10000000 + Math.random() * 90000000);
    return `${uniqueNumber}.${fileExtension}`;
  };

  const handleFileUpload = (index, file) => {
    if (!file) return;

    const newFileName = generateUniqueFilename(file);
    const renamedFile = new File([file], newFileName, { type: file.type });

    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index ? { ...q, answer: renamedFile } : q
      )
    );
  };

  const handleSelectStaff = (positionIndex, selectedOption) => {
    const selectedStaff = staffList.find(
      (staff) => staff.staffId === selectedOption.value
    );

    if (!selectedStaff) return;

    if (
      selectedHierarchy.some(
        (member) => member.staffId === selectedStaff.staffId
      )
    ) {
      alert("This staff member is already selected.");
      return;
    }

    const updatedHierarchy = [...selectedHierarchy];
    updatedHierarchy[positionIndex] = selectedStaff;
    setSelectedHierarchy(updatedHierarchy);
  };

  const handleRemoveStaff = (positionIndex) => {
    const updatedHierarchy = [...selectedHierarchy];
    updatedHierarchy[positionIndex] = null; 
    setSelectedHierarchy(updatedHierarchy);
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      selectedHierarchy.length !== predefinedHierarchy.length ||
      selectedHierarchy.some((member) => !member)
    ) {
      alert("Please select staff members for all positions in the hierarchy.");
      return;
    }

    try {
      const formData = new FormData();

      const updatedQuestions = questions.map((q) => {
        if (q.answer instanceof File) {
          return { ...q, answer: q.answer.name };
        }
        return q;
      });

      const data = {
        userId,
        templateId,
        questions: updatedQuestions,
        selectedHierarchy,
      };

      formData.append("data", JSON.stringify(data));

      questions.forEach((q) => {
        if (q.answer instanceof File) {
          formData.append("files", q.answer, q.answer.name);
        }
      });

      const response = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const responseData = await response.json();
        const submissionId = responseData.submissionId;
        alert("Form submitted successfully!");
        navigate("/successsubmission", {
          state: {
            submissionData: {
              submissionId,
              submittedDate: new Date().toISOString().split("T")[0],
              questions: updatedQuestions,
              selectedHierarchy,
              userId,
              templateName,
            },
          },
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to submit form: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div>
      <Navbar backLink="/selectemplate" />
      <div className="form-page-container">
        <div className="form-wrapper">
          <h2 className="form-main-title">{templateName} FORM</h2>
          {duplicate ? (
            <p className="form-duplicate-note">
              This template allows duplicate submissions.
            </p>
          ) : (
            <p className="form-duplicate-note">
              This template does not allow duplicate submissions.
            </p>
          )}
          <form onSubmit={handleSubmit} className="form-content">
            {questions.map((question, index) => (
              <div key={index} className="form-question-block">
                <h4 className="form-question-text">{question.question}</h4>

                
                {question?.answerType === "text" && (
                  <input
                    type="text"
                    className="form-text-input"
                    value={question.answer || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    required
                  />
                )}

                {question?.answerType === "textarea" && (
                  <textarea
                    className="form-textarea-input"
                    value={question.answer || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    required
                  />
                )}

                {question?.answerType === "text-editor" && (
                  <ReactQuill
                    className="form-text-editor"
                    value={question.answer || ""}
                    onChange={(value) => handleInputChange(index, value)}
                  />
                )}

                {question?.answerType === "radio" &&
                  question.options.map((option, optIndex) => (
                    <div key={optIndex} className="form-radio-option">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={question.answer === option}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                      <label>{option}</label>
                    </div>
                  ))}

                {question?.answerType === "checkbox" &&
                  question.options.map((option, optIndex) => (
                    <div key={optIndex} className="form-checkbox-option">
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          Array.isArray(question.answer) &&
                          question.answer.includes(option)
                        }
                        onChange={() => {
                          const updatedAnswers = Array.isArray(question.answer)
                            ? question.answer.includes(option)
                              ? question.answer.filter(
                                  (item) => item !== option
                                )
                              : [...question.answer, option]
                            : [option];

                          handleInputChange(index, updatedAnswers);
                        }}
                      />
                      <label>{option}</label>
                    </div>
                  ))}

                {question?.answerType === "single_date" && (
                  <DatePicker
                    selected={dates[index] || question.answer}
                    onChange={(date) => {
                      setDates((prev) => ({ ...prev, [index]: date }));
                      handleInputChange(index, date);
                    }}
                    className="form-date-picker"
                  />
                )}

                {question?.answerType === "single_date_future" && (
                  <DatePicker
                    selected={dates[index] || question.answer}
                    onChange={(date) => {
                      setDates((prev) => ({ ...prev, [index]: date }));
                      handleInputChange(index, date);
                    }}
                    className="form-date-picker"
                    minDate={new Date()}
                  />
                )}

                {question?.answerType === "duration" && (
                  <div className="form-duration-picker">
                    <p>start date(Click and select date)</p>
                    <DatePicker
                      selected={dates[index]?.start || question.answer?.start}
                      onChange={(date) => {
                        setDates((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], start: date, end: null },
                        }));
                        handleInputChange(index, { start: date, end: null });
                      }}
                      className="form-date-picker"
                    />
                    <p>end date</p>
                    <DatePicker
                      selected={dates[index]?.end || question.answer?.end}
                      onChange={(date) => {
                        if (
                          !dates[index]?.start ||
                          date >= dates[index].start
                        ) {
                          setDates((prev) => ({
                            ...prev,
                            [index]: { ...prev[index], end: date },
                          }));
                          handleInputChange(index, {
                            start: dates[index]?.start,
                            end: date,
                          });
                        }
                      }}
                      className="form-date-picker"
                      minDate={dates[index]?.start}
                    />
                  </div>
                )}
                {question?.answerType === "duration_future" && (
                  <div className="form-duration-picker">
                    <p>start date(Click and select date)</p>
                    <DatePicker
                      selected={dates[index]?.start || question.answer?.start}
                      onChange={(date) => {
                        setDates((prev) => ({
                          ...prev,
                          [index]: { ...prev[index], start: date, end: null },
                        }));
                        handleInputChange(index, { start: date, end: null });
                      }}
                      minDate={new Date()}
                      className="form-date-picker"
                    />
                    <p>end date</p>
                    <DatePicker
                      selected={dates[index]?.end || question.answer?.end}
                      onChange={(date) => {
                        if (
                          !dates[index]?.start ||
                          date >= dates[index].start
                        ) {
                          setDates((prev) => ({
                            ...prev,
                            [index]: { ...prev[index], end: date },
                          }));
                          handleInputChange(index, {
                            start: dates[index]?.start,
                            end: date,
                          });
                        }
                      }}
                      className="form-date-picker"
                      minDate={dates[index]?.start}
                    />
                  </div>
                )}
                {question?.answerType === "doc_upload" && (
                  <div className="form-file-upload">
                    <p>Upload Document:</p>
                    <input
                      type="file"
                      className="form-file-input"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleFileUpload(index, e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                )}

                {question?.answerType === "media_upload" && (
                  <div className="form-media-upload">
                    <p>Upload Media:</p>
                    <input
                      type="file"
                      className="form-file-input"
                      accept="image/*,audio/*,video/mp4"
                      onChange={(e) => {
                        if (e.target.files.length > 0) {
                          handleFileUpload(index, e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

              </div>
            </div>

            <button type="submit" className="form-submit-buttonx">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FillForm;
