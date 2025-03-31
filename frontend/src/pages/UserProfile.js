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


  if (loading) return <p>Loading...</p>;
  console.log(`http://localhost:5000${user.profilePicture}`);
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h2>User Profile</h2>
        <img
          src={
            user.profilePicture
              ? `http://localhost:5000${user.profilePicture}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="profile-picture"
        />

        <label className="file-input-label">
          Upload New Photo
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>

        <div className="profile-details">
          <p>
            <strong>ID:</strong> {user.studentId || user.staffId}
          </p>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Faculty:</strong> {user.faculty}
          </p>
          <p>
            <strong>Department:</strong> {user.department}
          </p>
          {userType !== "student" && (
            <p>
              <strong>Position:</strong> {user.position}
            </p>
          )}
        </div>

        <button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "10px 5px",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          style={{
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            margin: "10px 5px",
          }}
          onClick={() => (window.location.href = "/changepasssword")}
        >
          Change Password
        </button>
      </div>
    </>
  );
};

export default UserProfile;
