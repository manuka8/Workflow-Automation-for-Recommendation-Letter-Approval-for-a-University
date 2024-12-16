import React from "react";
import { useNavigate } from "react-router-dom";


function Mainregister() {
    const navigate = useNavigate();

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Register</h1>
        <button onClick={() => navigate("/studentregister")} style={{ margin: "10px", padding: "10px 20px" }}>
          Student Register
        </button>
        
        <button onClick={() => navigate("/staffregister")} style={{ margin: "10px", padding: "10px 20px" }}>
          Staff Register
        </button>
      
      </div>
    );
}

export default Mainregister

 