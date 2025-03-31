import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/RealtimeTracking.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const RealtimeTracking = () => {
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("card"); 

  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      const userId = localStorage.getItem("ID");
      const params = {
        userId,
        search,
        sort,
        startDate,
        endDate,
        status,
      };

      const response = await axios.get("http://localhost:5000/api/submissions/findsubmissions", { params });
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [search, sort, startDate, endDate, status]);

  const handleViewDetails = (submittedId) => {
    navigate(`/viewdetails/${submittedId}`);
  };