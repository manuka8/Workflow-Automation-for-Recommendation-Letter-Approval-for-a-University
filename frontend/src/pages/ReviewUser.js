import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/UserProfile.css";
import { useNavigate, useParams } from "react-router-dom";
const ReviewUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile/info/${userId}`
        );
        setUser(res.data.user);
        setUserType(res.data.userType); // ✅ Fix: Corrected "setUseType" to "setUserType"

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Generate a unique filename using timestamp and random string
    const uniqueFileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}${file.name.substring(file.name.lastIndexOf("."))}`;

    // Rename the file using the File constructor
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
    window.location.href = "/mainlogin"; // Redirect to login page
  };

  if (loading) return <p>Loading...</p>;
  console.log(`http://localhost:5000${user.profilePicture}`);
  return (
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

      

      <div className="profile-details">
        <p>
          <strong>ID:</strong> {user.studentId || user.staffId}
        </p>
        <p>
          <strong>Type of User:</strong> {userType}
        </p>
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
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

      <button onClick={() => navigate("/approve-submission")}>
      Finish Review
    </button>
    </div>
  );
};

export default ReviewUser;
