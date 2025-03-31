import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/UserProfile.css";
import Navbar from "../components/Navbar";
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);

  const userType = localStorage.getItem("type"); 
  const userId = localStorage.getItem("ID");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/${userId}`,
          { params: { userType } }
        );
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, userType]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uniqueFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${file.name.substring(file.name.lastIndexOf("."))}`;

    const renamedFile = new File([file], uniqueFileName, { type: file.type });

    const formData = new FormData();
    formData.append("profilePicture", renamedFile);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/picture/${userId}`,
        formData,
        { params: { userType } }
      );
      setUser((prev) => ({ ...prev, profilePicture: res.data.profilePicture }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/mainlogin"; 
  };
