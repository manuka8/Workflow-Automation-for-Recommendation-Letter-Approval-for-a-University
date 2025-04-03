import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import "../css/UserRegistration.css";
import DashboardNavbar from "../components/DashboardNavbar";
const UserRegistration = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    Papa.parse(file, {
      complete: (result) => {
        setUploadedData(result.data);
        setMessage("File uploaded successfully.");
        setError("");
      },
      header: true,
      skipEmptyLines: true,
      error: (err) => {
        setError("Error parsing file.");
        setMessage("");
      },
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv",
  });

  const handleUpload = async () => {
    if (!uploadedData) {
      setError("No file uploaded.");
      return;
    }

    const userType = localStorage.getItem("uploadingType");
    const endpoint =
      userType === "student"
        ? "http://localhost:5000/api/profile/upload-student"
        : "http://localhost:5000/api/profile/upload-staff";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: uploadedData }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setUploadedData(null);
        localStorage.removeItem("uploadingType");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Upload failed.");
    }
  };

  return (
    <>
      <DashboardNavbar backLink="/mainregister" />
      <div className="user-reg-container">
        <h2 className="user-reg-title">
          {localStorage.getItem("uploadingType") === "student"
            ? "Student Registration (CSV Upload)"
            : "Staff Registration (CSV Upload)"}
        </h2>

        <div {...getRootProps()} className="user-reg-dropzone">
          <input {...getInputProps()} />
          <p>Drag & drop a CSV file here, or click to select one</p>
        </div>
        <button
          className="user-reg-button"
          onClick={handleUpload}
          disabled={!uploadedData}
        >
          Upload
        </button>
        {message && (
          <p className="user-reg-message user-reg-success">{message}</p>
        )}
        {error && <p className="user-reg-message user-reg-error">{error}</p>}
      </div>
    </>
  );
};

export default UserRegistration;
