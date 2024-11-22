import React, { useState } from 'react';


const Adminlogin = () =>{
    const[adminId,setAdminId] = useState("");
    const[password,setPassword] = useState("");
    const[error,setError] = useState("");
    const[showPassword,setShowPassword] = useState(false);
    const[loading,setLoading]=useState(false);

    const handleSubmit = async (e)=>{
        //deafult page refresh
        e.preventDefault();
        setError("");

        //input validation
        if(!adminId || !password)
        {
            setError("Both fields are required");
            return;
        }
        if(adminId === "adminuov123" && password ==="adminp123")
        {
            alert("Login Successful");
        }
        else
        {
            setError("Invalid AdminId or Password")
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Admin Login</h1>

                <div>
                    <label>Admin ID</label>
                    <input 
                    type="text" 
                    placeholder='Enter Admin ID'
                    onChange={(e) => setAdminId(e.target.value)} 
                    />
                </div>

                <div>
                    <p>Password</p>
                    <input 
                    type="password" 
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