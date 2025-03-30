import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/SelectTemplate.css";
import Navbar from "../components/Navbar";

const SelectTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const navigate = useNavigate();

  const userID = localStorage.getItem("ID");
  const userType = localStorage.getItem("type");

  // Toggle dark mode

  // Update theme based on dark mode state
  const updateTheme = (isDarkMode) => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }
  };

  // Check for saved dark mode preference on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    updateTheme(savedDarkMode);
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/templates/findalltemplates",
          {
            userID,
            userType,
          }
        );
        setTemplates(response.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to fetch template data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userID, userType]);

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      if (userType === "student") {
        navigate(`/studentdashboard`);
      } else {
        navigate(`/staffdashboard`);
      }
    };

    // Listen for the popstate event (browser back button)
    window.addEventListener("popstate", handleBackButton);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate, userID]);

  const filteredTemplates = templates.filter((template) =>
    template.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="all">
      <div className="main-containerx">
        {
          userType==='student'?<Navbar backLink="/studentdashboard" />:<Navbar backLink="/staffdashboard" />
        }
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
                  <div className="select-template-info">
                    <div className="select-template-name">
                      {template.templateName}
                    </div>
                  </div>
                  <Link
                    to={`/fillform`}
                    className="select-template-link"
                    onClick={() =>
                      localStorage.setItem("templateId", template._id)
                    }
                  >
                    Go to Form
                  </Link>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredTemplates.length === 0 && (
            <p className="select-template-error">No templates found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectTemplate;
