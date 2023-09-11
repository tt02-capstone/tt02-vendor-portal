import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { vendorPortalLogin } from "../redux/commonRedux";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    localStorage.removeItem("user");

    const navigate = useNavigate(); // route navigation 

    const formStyle ={
      maxWidth: "800px",
      margin: "10% auto",
      padding: "20px"
    }
  
    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    async function handleLoginSubmit(event) {
      event.preventDefault();
      if (email && password) {
        let response = await vendorPortalLogin(email, password);
        if (response.status) {
          console.log("vendor staff login success!");
          toast.success('Login Successful!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
          localStorage.setItem("user", JSON.stringify(response.data));
          navigate('/home');

        } else {
          console.log("vendor staff login failed!");
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }
      }
    }
  
    return (
      <div className="Login">
        <form onSubmit={handleLoginSubmit} style={formStyle}>
            <FormLabel>Email</FormLabel>
            <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                sx={{mb: 3}}
            />
 
            <FormLabel>Password</FormLabel>
            <TextField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                sx={{mb: 3}}
            />
            
            <Button fullWidth variant="contained" type="submit" disabled={!validateForm()}>
              Login
            </Button>
        </form>
        
        <ToastContainer />
      </div>
    );
  }

  export default Login;