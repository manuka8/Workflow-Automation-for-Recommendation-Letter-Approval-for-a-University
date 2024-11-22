import React, { useState} from "react";
 
 const Stafflogin = () => {
    const [staffId, setStaffId] = useState(""); 
    const [password, setPassword] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Staff Login Details:", { staffId, password });
      
    };

   return (
     <div>
       
     </div>
   )
 }
 
 export default Stafflogin
 