import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CreateLetterTemplate.css";
import DisableBackButton from "../components/DisableBackButton";
import Select from "react-select"; // Import react-select for searchable dropdown
import DashboardNavbar from "../components/DashboardNavbar";

const CreateLetterTemplate = () => {
  const [templateName, setTemplateName] = useState("");
  const [type, setType] = useState("Students");
  const [duplicateSubmissionAllowed, setDuplicateSubmissionAllowed] =
    useState(false);
  const [questions, setQuestions] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [positions, setPositions] = useState([]); // List of all positions
  const navigate = useNavigate();

  // Fetch positions from the backend
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/templates/positions"
        );
        const positionOptions = response.data.map((pos) => ({
          value: pos,
          label: pos,
        }));
        setPositions(positionOptions);
      } catch (err) {
        console.error("Error fetching positions:", err);
      }
    };

    fetchPositions();
  }, []);

  // Handle back button to navigate to admin dashboard
  useEffect(() => {
    const handlePopState = () => {
      navigate("/admindashboard");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // Add a new hierarchy step
  const handleAddHierarchyStep = () => {
    setHierarchy([...hierarchy, { position: "" }]);
  };

  // Remove a hierarchy step
  const handleRemoveHierarchyStep = (index) => {
    setHierarchy(hierarchy.filter((_, i) => i !== index));
  };

  // Handle change in hierarchy position
  const handleHierarchyChange = (index, selectedOption) => {
    const newHierarchy = [...hierarchy];
    newHierarchy[index].position = selectedOption.value;
    setHierarchy(newHierarchy);
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answerType: "text",
        optional: false,
        options: [],
        hideVisibility: [],
      },
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Handle change in question fields
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Handle change in question options
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  // Add a new option to a question
  const handleAddOption = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  const getHierarchyPositions = () => {
    return hierarchy.map((step) => step.position).filter(Boolean);
  };
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const getVisibilityOptions = () => {
    return getHierarchyPositions().map((position) => ({
      value: position,
      label: position,
    }));
  };

  const handleHideVisibilityChange = (questionIndex, selectedOptions) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].hideVisibility = selectedOptions.map(
      (option) => option.value
    );
    setQuestions(newQuestions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/templates/create-template",
        {
          templateName,
          type,
          duplicateSubmissionAllowed,
          questions,
          hierarchy,
        }
      );

      if (response.data) {
        const submissionData = {
          templateName,
          type,
          duplicateSubmissionAllowed,
          questions,
          hierarchy,
        };
        navigate("/printetemplate", { state: { template: submissionData } });
      }
    } catch (err) {
      console.error("Error creating template:", err);
      alert("Failed to create template. Try again.");
    }
  };
  return (
    <>
      <DashboardNavbar backLink="/admindashboard" />
      <div className="template-container">
        <DisableBackButton />
        <h2 className="template-header">Create Letter Template</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Template Name:</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <h3>Type:</h3>
            <br />
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="Students"
                checked={type === "Students"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Students
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="Staff"
                checked={type === "Staff"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Academic Staff
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="NonAcademicStaff"
                checked={type === "NonAcademicStaff"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Non Academic Staff
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="BothStuandAcedamicStff"
                checked={type === "BothStuandAcedamicStff"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Both Student and Academic Staff
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="BothStuandStaff"
                checked={type === "BothStuandStaff"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Both Student and Staff
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="Bothnonandacademic"
                checked={type === "Bothnonandacademic"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              Both Non Academic and Academic Staff
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="all"
                checked={type === "all"}
                onChange={(e) => setType(e.target.value)}
              />{" "}
              For All
            </label>
          </div>

          <div className="form-group">
            <h3>Duplicate Submission Allowed:</h3>
            <br />
            <label className="radio-option">
              <input
                type="radio"
                name="duplicateSubmission"
                value="true"
                checked={duplicateSubmissionAllowed}
                onChange={() => setDuplicateSubmissionAllowed(true)}
              />{" "}
              Yes
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="duplicateSubmission"
                value="false"
                checked={!duplicateSubmissionAllowed}
                onChange={() => setDuplicateSubmissionAllowed(false)}
              />{" "}
              No
            </label>
          </div>

          <div className="form-group">
            <h3>Position Hierarchy:</h3>
            {hierarchy.map((step, index) => {
              const selectedPositions = hierarchy.map((s) => s.position);
              const availableOptions = positions.filter(
                (pos) =>
                  !selectedPositions.includes(pos.value) ||
                  pos.value === step.position
              );

              return (
                <div key={index} className="hierarchy-step">
                  <Select
                    options={availableOptions}
                    value={positions.find((pos) => pos.value === step.position)}
                    onChange={(selectedOption) =>
                      handleHierarchyChange(index, selectedOption)
                    }
                    placeholder="Select Position"
                    className="select-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHierarchyStep(index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddHierarchyStep}
              className="add-button"
            >
              Add Position
            </button>
          </div>

          <h3>Define Template Format</h3>
          {questions.map((q, index) => (
            <div key={index} className="question-card">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(index, "question", e.target.value)
                  }
                  required
                  className="question-input"
                />

                <select
                  value={q.answerType}
                  onChange={(e) =>
                    handleQuestionChange(index, "answerType", e.target.value)
                  }
                  className="select-input"
                >
                  <option value="text">Text Box</option>
                  <option value="checkbox">Check Box</option>
                  <option value="radio">Radio Button</option>
                  <option value="textarea">Textarea</option>
                  <option value="text-editor">Text Editor</option>
                  <option value="doc_upload">Document Upload</option>
                  <option value="media_upload">Media Upload (MP3, MP4)</option>
                  <option value="single_date">Single Date</option>
                  <option value="single_date_future">
                    Single Date (future dates only)
                  </option>
                  <option value="duration">Duration</option>
                  <option value="duration_future">
                    Duration (future dates only)
                  </option>
                </select>
              </div>

              {["checkbox", "radio"].includes(q.answerType) && (
                <div className="option-container">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="option-item">
                      <input
                        type="text"
                        placeholder={`Option ${optIndex + 1}`}
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(index, optIndex, e.target.value)
                        }
                        className="option-input"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index, optIndex)}
                        className="remove-button small"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className="add-button small"
                  >
                    Add Option
                  </button>
                </div>
              )}

              <div className="radio-group">
                <label>Optional:</label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`optional_${index}`}
                    value="true"
                    checked={q.optional === true}
                    onChange={() =>
                      handleQuestionChange(index, "optional", true)
                    }
                  />
                  Yes
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name={`optional_${index}`}
                    value="false"
                    checked={q.optional === false}
                    onChange={() =>
                      handleQuestionChange(index, "optional", false)
                    }
                  />
                  No
                </label>
              </div>
              {getHierarchyPositions().length > 0 && (
                <div className="form-group">
                  <label>Hide this question from:</label>
                  <Select
                    isMulti
                    options={getVisibilityOptions()}
                    value={getVisibilityOptions().filter((option) =>
                      q.hideVisibility?.includes(option.value)
                    )}
                    onChange={(selectedOptions) =>
                      handleHideVisibilityChange(index, selectedOptions)
                    }
                    placeholder="Select positions to hide from"
                    className="select-input"
                  />
                  {q.hideVisibility?.length > 0 && (
                    <div className="selected-visibility-tags">
                      {q.hideVisibility.map((pos, i) => (
                        <span key={i} className="visibility-tag">
                          {pos}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="note-container">
                <label>Add a Note</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`note_${index}`}
                      value="yes"
                      checked={q.includeNote === true}
                      onChange={() =>
                        handleQuestionChange(index, "includeNote", true)
                      }
                    />
                    Yes
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name={`note_${index}`}
                      value="no"
                      checked={q.includeNote === false}
                      onChange={() =>
                        handleQuestionChange(index, "includeNote", false)
                      }
                    />
                    No
                  </label>
                </div>
              </div>

              {q.includeNote && (
                <textarea
                  placeholder="Enter note here..."
                  value={q.note || ""}
                  onChange={(e) =>
                    handleQuestionChange(index, "note", e.target.value)
                  }
                  className="note-textarea"
                />
              )}

              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="remove-button"
              >
                Remove Question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="add-button"
          >
            Add Question
          </button>

          <button type="submit" className="submit-button">
            Create Template
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateLetterTemplate;
