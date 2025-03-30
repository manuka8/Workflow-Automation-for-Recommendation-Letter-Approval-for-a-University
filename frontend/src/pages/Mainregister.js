import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";


function Mainregister() {
    const navigate = useNavigate();

    useEffect(() => {
      const handlePopState = () => {
        navigate("/admindashboard");
      };
      window.removeEventListener("popstate",handlePopState);

      return () =>{
        window.removeEventListener("popstate",handlePopState);
      };
      
    }, [navigate]);

    return (
      <>
      <DashboardNavbar backlink = "/admindashboard" />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Register</h1>
        <button 
        onClick={() => navigate("/studentregister")} 
        style={{ margin: "10px", padding: "10px 20px" }}>
          Student Register
        </button>
        
        <button 
        onClick={() => navigate("/staffregister")} 
        style={{ margin: "10px", padding: "10px 20px" }}>
          Staff Register
        </button>
      
      </div>
      </>
    );
}

export default Mainregister

 