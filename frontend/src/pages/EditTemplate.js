import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/EditTemplate.css";
import DashboardNavbar from "../components/DashboardNavbar";

const EditTemplate = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const [hasSubmissions, setHasSubmissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    templateName: "",
    type: "",
    duplicateSubmissionAllowed: false,
    questions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check for submissions first
        const submissionsResponse = await axios.get(
          `http://localhost:5000/api/templates/check-submissions/${templateId}`
        );
        
        if (submissionsResponse.data.hasSubmissions) {
          setHasSubmissions(true);
          setCanEditOrDelete(false);
          
          // Still fetch template data to display (read-only)
          const templateResponse = await axios.get(
            `http://localhost:5000/api/templates/findtemplates/${templateId}`
          );
          setTemplate(templateResponse.data.template);
          setFormData(templateResponse.data.template);
        } else {
          // No submissions - proceed normally
          const templateResponse = await axios.get(
            `http://localhost:5000/api/templates/findtemplates/${templateId}`
          );
          setTemplate(templateResponse.data.template);
          setCanEditOrDelete(templateResponse.data.canEditOrDelete);
          setFormData(templateResponse.data.template);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert(err.response?.data?.message || "Error loading template data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [templateId]);

  const handleChange = (index, key, value) => {
    if (hasSubmissions) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][key] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    if (hasSubmissions) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (index) => {
    if (hasSubmissions) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    if (hasSubmissions) return;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/templates/edittemplates/${templateId}`,
        formData
      );
      alert("Template updated successfully.");
      navigate("/selectemplate-admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating template.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/templates/deletetemplate/${templateId}`
      );
      alert("Template deleted successfully.");
      navigate("/selectemplate-admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting template.");
    }
  };

  if (loading) {
    return (
      <>
        <DashboardNavbar backLink="/selectemplate-admin" />
        <div className="edit-template-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar backLink="/selectemplate-admin" />
      <div className="edit-template-container">
        {template && (
          <>
            <div className="template-edit">
              <h2>{hasSubmissions ? "View Template" : "Edit Template"}</h2>
              
              {hasSubmissions && (
                <div className="submission-warning">
                  <p>
                    This template has submissions and cannot be edited. 
                    You can only view the template details.
                  </p>
                </div>
              )}

              <div className={`form-group ${hasSubmissions ? 'disabled' : ''}`}>
                <label>Template Name</label>
                <input
                  type="text"
                  className="input-fields"
                  value={formData.templateName}
                  onChange={(e) =>
                    setFormData({ ...formData, templateName: e.target.value })
                  }
                  disabled={hasSubmissions}
                />
              </div>

              <div className={`form-group ${hasSubmissions ? 'disabled' : ''}`}>
                <label>Template Type</label>
                <select
                  className="select-field"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  disabled={hasSubmissions}
                >
                  <option value="Students">Students</option>
                  <option value="Staff">Staff</option>
                  <option value="NonAcademicStaff">NonAcademicStaff</option>
                  <option value="BothStuandAcedamicStff">
                    BothStuandAcedamicStff
                  </option>
                  <option value="BothStuandStaff">BothStuandStaff</option>
                  <option value="Bothnonandacademic">Bothnonandacademic</option>
                  <option value="all">All</option>
                </select>
              </div>

              <div className={`form-group ${hasSubmissions ? 'disabled' : ''}`}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.duplicateSubmissionAllowed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duplicateSubmissionAllowed: e.target.checked,
                      })
                    }
                    disabled={hasSubmissions}
                  />
                  Allow Duplicate Submissions
                </label>
              </div>

              <h3>Questions</h3>
              {formData.questions.map((q, index) => (
                <div key={index} className="question-block">
                  <div className={`form-group ${hasSubmissions ? 'disabled' : ''}`}>
                    <label>Question {index + 1}</label>
                    <input
                      type="text"
                      className="input-fields"
                      value={q.question}
                      onChange={(e) =>
                        handleChange(index, "question", e.target.value)
                      }
                      disabled={hasSubmissions}
                    />
                  </div>

                  <div className={`form-group ${hasSubmissions ? 'disabled' : ''}`}>
                    <label>Answer Type</label>
                    <select
                      className="select-field"
                      value={q.answerType}
                      onChange={(e) =>
                        handleChange(index, "answerType", e.target.value)
                      }
                      disabled={hasSubmissions}
                    >
                      <option value="text">Text</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="textarea">Textarea</option>
                      <option value="text-editor">Text Editor</option>
                      <option value="radio">Radio</option>
                      <option value="upload">Upload</option>
                      <option value="single_date">Single Date</option>
                      <option value="single_date_future">
                        Single Date Future
                      </option>
                      <option value="duration">Duration</option>
                      <option value="duration_future">Duration Future</option>
                      <option value="doc_upload">Document Upload</option>
                      <option value="media_upload">Media Upload</option>
                    </select>
                  </div>

                  {["checkbox", "radio"].includes(q.answerType) && (
                    <div className={`options-section ${hasSubmissions ? 'disabled' : ''}`}>
                      <h4>Options</h4>
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="option-item">
                          <input
                            type="text"
                            className="input-fields"
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optIndex,
                                e.target.value
                              )
                            }
                            disabled={hasSubmissions}
                          />
                          {!hasSubmissions && (
                            <button
                              className="remove-btn"
                              onClick={() => removeOption(index, optIndex)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      {!hasSubmissions && (
                        <button
                          className="add-btn"
                          onClick={() => addOption(index)}
                        >
                          Add Option
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!hasSubmissions && canEditOrDelete && (
                <div className="action-buttons">
                  <button className="update-btn" onClick={handleUpdate}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EditTemplate;