import React, { useState } from "react";

const Staffregister = () => {
    const [staffId, setStaffId] = useState(""); 
    const [staffType, setStaffType] = useState("");  
    const [faculty, setFaculty] = useState("");  
    const [department, setDepartment] = useState("");  
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log("Staff Registration Details:", {
        staffId,
        staffType,
        faculty,
        department,
        email,
        position,
        password,
      });
      
    };

  return (
    <div>
    <h2>Staff Register</h2>
    <form onSubmit={handleSubmit}>
      <div >
        <label>Staff ID:</label>
        <input type="text"  value={staffId}  onChange={(e) => setStaffId(e.target.value)} placeholder="Enter your staff ID" required/>

      </div>

      <div >
        <label>Staff Type:</label>
        <select value={staffType} onChange={(e) => setStaffType(e.target.value)} required>
          <option value="">Select Staff Type</option>
          <option value="Academic Staff">Academic Staff</option>
          <option value="Non Academic Staff">Non Academic Staff</option>
        </select>
      </div>

      <div >
        <label>Faculty:</label>
        <select value={faculty} onChange={(e) => setFaculty(e.target.value)} required>
          <option value="">Select Faculty</option>
          <option value="Faculty of Applied Science">Faculty of Applied Science</option>
          <option value="Faculty of Technological Studies">Faculty of Technological Studies</option>
          <option value="Faculty of Business Studies">Faculty of Business Studies</option>
        </select>
      </div>

      <div >
        <label>Department:</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
          <option value="">Select Department</option>
          <option value="Physical Department">Physical Department</option>
          <option value="Biological Department">Biological Department</option>
          <option value="Technological Department">Technological Department</option>
          <option value="Business Studies Department">Business Studies Department</option>
          <option value="Project Management">Project Management</option>
        </select>
      </div>

      <div >
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
      </div>

      <div >
        <label>Position:</label>
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Enter your position" required/>

      </div>

      <div >
        <label>Password:</label>
        <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required/>
      </div>

      <div >
        <label>Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required/>
      </div>

      <button type="submit">Register</button>
    </form>
  </div>
  );
};

export default Staffregister;
