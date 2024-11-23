import React from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();

  return (
    <div >
      <h1>Welcome to the Home Page</h1>
      <button onClick={() => navigate("/mainlogin")} style={{ margin: "10px", padding: "10px 20px" }}>
        Login
      </button>
      <button onClick={() => navigate("/mainregister")} style={{ margin: "10px", padding: "10px 20px" }}>
        Register
      </button>
    </div>
  );
}

export default Home;
