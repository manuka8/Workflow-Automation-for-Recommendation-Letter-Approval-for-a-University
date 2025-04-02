import { useState } from "react";
import axios from "axios";
import "../css/changePassword.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const userId = localStorage.getItem("ID");
  const userType = localStorage.getItem("type");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setMessageType("error");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/change-password/${userId}`,
        {
          userType,
          currentPassword,
          newPassword,
        }
      );

      setMessage(res.data.message);
      setMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      alert("You have successfully updated your password. Now logging out...");
      localStorage.clear();
      navigate("/mainlogin");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error changing password";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };
  return (
    <>
      <Navbar />
      <div className="password-change__container">
        <h2 className="password-change__title">Change Password</h2>
        {message && (
          <p
            className={`password-change__alert password-change__alert--${messageType}`}
          >
            {message}
          </p>
        )}
        <form className="password-change__form" onSubmit={handleChangePassword}>
          <input
            className="password-change__input"
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            className="password-change__input"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className="password-change__input"
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="password-change__submit-btn">
            Update Password
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
