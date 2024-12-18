import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const SelectTemplate = () => {

    const [templates, setTemplates] = useState([]); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    
    const userID = localStorage.getItem("ID");
    const userType = localStorage.getItem("type");

   
     useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/templates/findalltemplates", {
                    userID,
                    userType,
                });

          
                const validTemplates = response.data.map(template => ({
                    ...template,
                    templateId: template.templateId || `TPL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
                }));

                setTemplates(validTemplates);
            } catch (err) {
                console.error("Error fetching templates:", err);
                setError("Failed to fetch template data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [userID, userType]);

    const handleTemplateId = (id) => {
        localStorage.setItem('templateId', id); 
        navigate('/fillform'); 
    };
    
    return (
        <div>
            {loading && <p>Loading templates...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <ul>
                    {templates.map((template, index) => ( 
                        <li key={template.templateId || index}>
                            <button onClick={() => handleTemplateId(template.templateId)}>
                                {template.templateName}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectTemplate;