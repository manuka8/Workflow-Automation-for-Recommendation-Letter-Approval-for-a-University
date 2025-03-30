import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/EditUser.css";
const EditUser = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const { userId } = useParams();
  const apiEndpoint =
    userType === "student"
      ? "http://localhost:5000/api/student"
      : "http://localhost:5000/api/staff";
  const emailEndpoint = `${apiEndpoint}/send-email`;

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(userType);
  useEffect(() => {
    if (userId) {
      axios
        .get(`${apiEndpoint}/${userId}`)
        .then((response) => {
          setUserData(response.data);
          setFormData({
            firstName: response.data?.firstName || "",
            lastName: response.data?.lastName || "",
            faculty: response.data?.faculty || "",
            department: response.data?.department || "",
            position: response.data?.position || "",
          });
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [userId, apiEndpoint]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiEndpoint}/${userId}`, formData);
      await axios.post(emailEndpoint, {
        to: userData.email,
        subject: "User Information Updated",
        message: "Your account details have been successfully updated.",
      });
      navigate("/selectuser");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiEndpoint}/${userId}`);
      await axios.post(emailEndpoint, {
        to: userData.email,
        subject: "Account Deleted",
        message: "Your account has been successfully deleted.",
      });
      navigate("/selectuser");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="edit-user-container">
      <h2 className="edit-user-title">Edit User Information</h2>
      <form className="edit-user-form" onSubmit={handleSubmit}>
        <label className="edit-user-label">
          First Name:
          <input
            type="text"
            name="firstName"
            className="edit-user-input"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label className="edit-user-label">
          Last Name:
          <input
            type="text"
            name="lastName"
            className="edit-user-input"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label className="edit-user-label">
          Email:
          <input
            type="email"
            className="edit-user-input"
            value={userData.email}
            disabled
          />
        </label>
        <label className="edit-user-label">
          Faculty:
          <input
            type="text"
            name="faculty"
            className="edit-user-input"
            value={formData.faculty}
            onChange={handleChange}
            required
          />
        </label>
        <label className="edit-user-label">
          Department:
          <input
            type="text"
            name="department"
            className="edit-user-input"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </label>
        {userType !== "student" && (
          <label className="edit-user-label">
            Position:
            <input
              type="text"
              name="position"
              className="edit-user-input"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </label>
        )}
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Update User
        </button>
      </form>
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: "red",
          color: "white",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
          padding: "10px",
          marginTop: "10px",
          textAlign: "center",
          transition: "color 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.color = "darkred")}
        onMouseOut={(e) => (e.target.style.color = "red")}
      >
        Delete User
      </button>
    </div>
  );
};

export default EditUser;
