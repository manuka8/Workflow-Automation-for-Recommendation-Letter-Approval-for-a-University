import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/EditTemplate.css'
import DashboardNavbar from "../components/DashboardNavbar";
const EditTemplate = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [canEditOrDelete, setCanEditOrDelete] = useState(false);
  const [formData, setFormData] = useState({
    templateName: "",
    type: "",
    duplicateSubmissionAllowed: false,
    questions: [],
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/templates/findtemplates/${templateId}`).then(({ data }) => {
      setTemplate(data.template);
      setCanEditOrDelete(data.canEditOrDelete);
      setFormData(data.template);
    });
  }, [templateId]);

  const handleChange = (index, key, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][key] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addOption = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index].options.push("");
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const removeOption = (qIndex, optIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/templates/edittemplates/${templateId}`, formData);
      alert("Template updated successfully.");
      navigate("/selectemplate-admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating template.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/templates/deletetemplate/${templateId}`);
      alert("Template deleted successfully.");
      navigate("/selectemplate-admin");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting template.");
    }
  };

  return (
    <>
    <DashboardNavbar backLink="/selectemplate-admin"/>
    <div className="edit-template-container">
      {template ? (
        <>
          <div className="template-preview">
            <h2>Previous Template</h2>
            <p><strong>Name:</strong> {template.templateName}</p>
            <p><strong>Type:</strong> {template.type}</p>
            <p><strong>Duplicate Submissions:</strong> {template.duplicateSubmissionAllowed ? "Allowed" : "Not Allowed"}</p>
            <h3>Questions:</h3>
            <ul className="questions-list">
              {template.questions.map((q, index) => (
                <li key={index} className="question-item">
                  <p><strong>Question:</strong> {q.question}</p>
                  <p><strong>Type:</strong> {q.answerType}</p>
                  {["checkbox", "radio"].includes(q.answerType) && q.options.length > 0 && (
                    <ul className="options-list">
                      {q.options.map((opt, i) => (
                        <li key={i} className="option-item">{opt}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="template-edit">
            <h2>Edit Template</h2>
            <input
              type="text"
              className="input-field"
              value={formData.templateName}
              onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
            />
            <select
              className="select-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Students">Students</option>
              <option value="Staff">Staff</option>
              <option value="NonAcademicStaff">NonAcademicStaff</option>
              <option value="BothStuandAcedamicStff">BothStuandAcedamicStff</option>
              <option value="BothStuandStaff">BothStuandStaff</option>
              <option value="Bothnonandacademic">Bothnonandacademic</option>
              <option value="all">All</option>
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.duplicateSubmissionAllowed}
                onChange={(e) => setFormData({ ...formData, duplicateSubmissionAllowed: e.target.checked })}
              />
              Allow Duplicate Submissions
            </label>

            <h3>Questions</h3>
            {formData.questions.map((q, index) => (
              <div key={index} className="question-block">
                <input
                  type="text"
                  className="input-field"
                  value={q.question}
                  onChange={(e) => handleChange(index, "question", e.target.value)}
                />
                <select
                  className="select-field"
                  value={q.answerType}
                  onChange={(e) => handleChange(index, "answerType", e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="textarea">Textarea</option>
                  <option value="text-editor">Text Editor</option>
                  <option value="radio">Radio</option>
                  <option value="upload">Upload</option>
                  <option value="single_date">Single Date</option>
                  <option value="single_date_future">Single Date Future</option>
                  <option value="duration">Duration</option>
                  <option value="duration_future">Duration Future</option>
                  <option value="doc_upload">Document Upload</option>
                  <option value="media_upload">Media Upload</option>
                </select>

                {["checkbox", "radio"].includes(q.answerType) && (
                  <div className="options-section">
                    <h4>Options</h4>
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="option-item">
                        <input
                          type="text"
                          className="input-field"
                          value={opt}
                          onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                        />
                        <button className="remove-btn" onClick={() => removeOption(index, optIndex)}>Remove</button>
                      </div>
                    ))}
                    <button className="add-btn" onClick={() => addOption(index)}>Add Option</button>
                  </div>
                )}
              </div>
            ))}

            {canEditOrDelete && <button className="update-btn" onClick={handleUpdate}>Update</button>}
            {canEditOrDelete && <button className="delete-btn" onClick={handleDelete}>Delete</button>}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </>
  );
};

export default EditTemplate;