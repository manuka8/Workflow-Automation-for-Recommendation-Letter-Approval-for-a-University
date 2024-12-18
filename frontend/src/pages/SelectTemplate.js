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