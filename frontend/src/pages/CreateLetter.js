import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";




return (
    <div>
      <h2>Create Letter Template</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
            required
          />
        </div>

        <div>
          <h3>Type:</h3>
          <label>
            <input
              type="radio"
              name="type"
              value="Students"
              checked={type === "Students"}
              onChange={(e) => setType(e.target.value)}
            />
            Students
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="Staff"
              checked={type === "Staff"}
              onChange={(e) => setType(e.target.value)}
            />
            Staff
          </label>
        </div>

        <h3>Approval Hierarchy</h3>
        {hierarchy.map((step, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <label>Position:</label>
            <select
              value={step.position}
              onChange={(e) => handleHierarchyChange(index, "position", e.target.value)}
              required
            >
              <option value="">Select Position</option>
              {[...new Set(staffData.map((staff) => staff.position))].map((position, idx) => (
                <option key={idx} value={position}>
                  {position}
                </option>
              ))}
            </select>

            <label>Staff ID:</label>
            <select
              value={step.staffId}
              onChange={(e) => handleHierarchyChange(index, "staffId", e.target.value)}
              required
            >
              <option value="">Select Staff ID</option>
              {staffData
                .filter((staff) => staff.position === step.position)
                .map((staff) => (
                  <option key={staff._id} value={staff.staffId}>
                    {staff.staffId}
                  </option>
                ))}
            </select>

            <button 
            type="button" 
            onClick={() => removeHierarchyStep(index)}>
              Remove
            </button>
          </div>
        ))}

        <button 
        type="button" 
        onClick={addHierarchyStep}>
          Add Hierarchy Step
        </button>

        <button 
        type="submit">Create Template</button>
      </form>
    </div>
  );
};

export default CreateLetterTemplate;