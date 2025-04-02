import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/SelectTemplate.css";
import DashboardNavbar from "../components/DashboardNavbar";

const SelectEditTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userID = "ADMIN";
  const userType = "admin";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/templates/findalltemplates/admin",
          {
            userID,
            userType,
          }
        );
        setTemplates(response.data);
        const handleBackButton = (event) => {
          event.preventDefault();
          navigate("/admindashboard"); // Redirect when user clicks back
        };
    
        window.addEventListener("popstate", handleBackButton);
        
        return () => {
          window.removeEventListener("popstate", handleBackButton);
        };
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to fetch template data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userID, userType,navigate]);

  const filteredTemplates = templates.filter((template) =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <><DashboardNavbar backLink="/admindashboard" />
    <div className="select-template-container">
      <h1 className="select-template-header">Select a Template</h1>

      <div className="select-template-search">
        <input
          type="text"
          className="select-template-search-input"
          placeholder="Search by template name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && (
        <p className="select-template-loading">Loading templates...</p>
      )}
      {error && <p className="select-template-error">{error}</p>}

      {!loading && !error && filteredTemplates.length > 0 && (
        <div className="select-template-cards">
          {filteredTemplates.map((template) => (
            <div key={template._id} className="select-template-card">
              <div className="select-template-name">
                {template.templateName}
              </div>
              <Link
                to={`/editform/${template._id}`}
                className="select-template-link"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredTemplates.length === 0 && (
        <p className="select-template-error">No templates found.</p>
      )}
    </div>
    </>
  );
};

export default SelectEditTemplate;
