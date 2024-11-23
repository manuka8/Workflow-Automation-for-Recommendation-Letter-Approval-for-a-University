import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login</h1>
      <button onClick={() => navigate("/studentlogin")} style={{ margin: "10px", padding: "10px 20px" }}>
        Student Login
      </button>
      <button onClick={() => navigate("/adminlogin")} style={{ margin: "10px", padding: "10px 20px" }}>
        Admin Login
      </button>
      <button onClick={() => navigate("/stafflogin")} style={{ margin: "10px", padding: "10px 20px" }}>
        Staff Login
      </button>
    
    </div>
  );
}

export default Home;
