import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // route navigation 

    const baseURL = "http://localhost:8080/vendor";

    const formStyle ={
      maxWidth: "800px",
      margin: "10% auto",
      padding: "20px"
    }
  
    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      if (email && password) {
        axios.post(`${baseURL}/vendorLogin/${email}/${password}`).then((response) => {
          console.log(response);
          if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
            toast.error(response.data.errorMessage, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });

          } else {
            toast.success('Login Successful!', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
            localStorage.setItem("user_id", JSON.stringify(response.data.user_id));
            navigate('/home');  
          }
        })
        .catch((error) => {
          console.error("Axios Error : ", error)
        });
      }
    }
  
    return (
      <div className="Login">
        <form onSubmit={handleSubmit} style={formStyle}>
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
      </div>
    );
  }

  export default Login;