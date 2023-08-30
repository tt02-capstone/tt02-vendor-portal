import Navbar from "../components/Navbar"
import React, { useState } from "react";
import { FormLabel, Button, TextField } from '@mui/material';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateAdmin() {
    const [vendorName, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const baseURL = "http://localhost:8080/vendor";

    const formStyle ={
      maxWidth: "800px",
      margin: "10% auto",
      padding: "20px"
    }
  
    function validateForm() {
      return email.length > 0 && password.length > 0 && vendorName.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();

      if (email && password && vendorName) {
        axios.post(`${baseURL}/createVendor`, {
          vendor_name : vendorName,
          email : email,
          password : password
        }).then((response) => {
          if (response.data.httpStatusCode === 400) {
            toast.error(response.data.errorMessage, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
          } else {
            toast.success('Vendor Created!', {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });

            navigate('/home');  
          }
        })
        .catch((error) => {
          console.error("Axios Error : ", error)
        });
      }
    }
  
    return (
        <div className="createAdmin">
            <Navbar />
            <form onSubmit={handleSubmit} style={formStyle}>
                <FormLabel>Vendor Name</FormLabel>
                <TextField
                    type="vendorName"
                    value={vendorName}
                    onChange={(e) => setName(e.target.value)}
                    required
                    fullWidth
                    sx={{mb: 3}}
                />

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
                    Submit
                </Button>
    
            </form>
        </div>
  
    );
  }
