import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = ({ backLink }) => {
  const [profileImage, setProfileImage] = useState(
    "../assets/default-avatar.jpg"
  );
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("ID");
  const userType = localStorage.getItem("type");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !userType) {
        console.error("User ID or User Type not found in localStorage");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profile/${userId}`,
          {
            params: { userType },
          }
        );

        if (response.data) {
          setProfileImage(
            response.data.profilePicture
              ? `http://localhost:5000${response.data.profilePicture}`
              : "../assets/default-avatar.jpg"
          );
          setUserName(response.data.firstName || "User");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userType]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/mainlogin";
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    updateTheme(newDarkMode);
  };

  const updateTheme = (isDarkMode) => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-theme");
    } else {
      root.classList.remove("dark-theme");
    }
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    updateTheme(savedDarkMode);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(profileImage);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {backLink && (
          <button className="back-button" onClick={() => navigate(backLink)}>
            &larr;
          </button>
        )}
        {userType === "student" ? "Student Portal" : "Staff Portal"}
      </div>
      <div className="navbar-right">
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="profile-section" onClick={toggleDropdown}>
          <img
            src={
              profileImage && profileImage.includes("uploads/profile_pic/")
                ? profileImage
                : require("../assets/default-avatar.jpg")
            }
            alt="Profile"
            className="profile-photo"
          />

          <span className="profile-name">{userName}</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">
                Profile
              </Link>
              <Link to="/changepasssword" className="dropdown-item">
                Change Password
              </Link>
              <div className="dropdown-item logout" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
