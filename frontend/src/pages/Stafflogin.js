import React, {useState} from "react";
 
 const Stafflogin = () => {
    const [staffId, setStaffId] = useState(""); 
    const [password, setPassword] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Staff Login Details:", { staffId, password });
      
    };

   return (


    <div >
    <h2>Staff Login</h2>
    <form onSubmit={handleSubmit}>
      <div >
        <label>Staff ID:</label>
        <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Enter your staff ID" required/>
      </div>
      <div >
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}  placeholder="Enter your password" required/>

      </div>
      <button type="submit">Login</button>
    </form>
  </div>
   );
 };
 
 export default Stafflogin;
 