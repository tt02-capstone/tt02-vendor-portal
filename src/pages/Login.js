import React, { useState } from "react";
import { FormLabel, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Space
} from 'antd';
import { alignProperty } from "@mui/material/styles/cssUtils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // route navigation 
  const routeChange = () => {
    let path = `/signup`;
    navigate(path);
  }

  const baseURL = "http://localhost:8080/vendor";

  const formStyle = {
    maxWidth: "800px",
    margin: "10% auto",
    padding: "20px"
  }

  localStorage.removeItem("user");

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
          localStorage.setItem("user", JSON.stringify(response.data));
          setTimeout(() => {
            navigate('/home')
          }, 700);
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
          sx={{ mb: 3 }}
        />

        <FormLabel>Password</FormLabel>
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          sx={{ mb: 3 }}
        />
        <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" disabled={!validateForm()}>Login</Button>
        </div>
        <ToastContainer />

        <center>
          <h3>Keen to join us as a vendor? Sign up for an account today!</h3>
          <Button type="primary" onClick={routeChange}>Sign Up</Button>
        </center>
      </form>
    </div>
  );
}

export default Login;