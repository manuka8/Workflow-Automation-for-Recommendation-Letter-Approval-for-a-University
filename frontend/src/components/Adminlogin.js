import React from 'react';

const Adminlogin = () =>{
    return(
        <div>
            <form action="">
                <h1>Admin Login</h1>

                <div>
                    <p>Admin ID</p>
                    <input type="text" placeholder='' required/>
                </div>

                <div>
                    <p>Password</p>
                    <input type="password" placeholder='' required/>
                </div>

                <button type="submit">Login</button>


            </form>
        </div>
    );
};

export default Adminlogin;