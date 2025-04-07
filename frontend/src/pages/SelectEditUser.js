import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import DashboardNavbar from "../components/DashboardNavbar";

function SelectEditUser() {
  const navigate = useNavigate();
  useEffect(() => {
    const handlePopState = () => {
      navigate("/admindashboard");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  return (
    <>
    <DashboardNavbar backLink="/admindashboard" />
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      <h1>Edit User Informations</h1>
      <button
        onClick={() => {
          localStorage.setItem("userType", "student");
          navigate("/selectuser");
        }}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Student
      </button>

      <button
        onClick={() => {
          localStorage.setItem("userType", "Academic Staff");
          navigate("/selectuser");
        }}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Academic Staff
      </button>

      <button
        onClick={() => {
          localStorage.setItem("userType", "Non-Academic Staff");
          navigate("/selectuser");
        }}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Non-Academic Staff
      </button>
    </div>
    </>
  );
}

export default SelectEditUser;
