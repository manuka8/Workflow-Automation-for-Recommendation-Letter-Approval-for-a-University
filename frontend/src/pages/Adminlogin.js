import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import '../css/Adminlogin.css';

const Adminlogin = () =>{
    const[adminId,setAdminId] = useState("");
    const[password,setPassword] = useState("");
    const[error,setError] = useState("");
    const[showPassword,setShowPassword] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        
        e.preventDefault();
        setError("");

        
        if(!adminId || !password)
        {
            setError("Both fields are required");
            return;
        }
        if(adminId === "admin" && password ==="123")
        {
            alert("Login Successful");
            navigate('/admindashboard');
        }
        else
        {
            setError("Invalid AdminId or Password");
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Admin Login</h1>
                {error && <div className='errpr'>{error}
                    </div>}
                <div className='form-group'>
                    <label htmlFor='admin-id'>Admin ID</label>
                    <input 
                    type="text" 
                    placeholder='Enter Admin ID'
                    onChange={(e) => setAdminId(e.target.value)} 
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input 
                    id="password" 
                    type={showPassword ? "text" : "password"}                   
                    placeholder="Enter Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                <div>
                <button type="submit">Login</button>
                </div>
                </form>
        </div>
    );
};

export default Adminlogin;