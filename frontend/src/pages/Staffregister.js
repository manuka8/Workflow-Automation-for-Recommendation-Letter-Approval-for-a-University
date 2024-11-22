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
      
    </div>
  );
};

export default Staffregister;
