import React, {useContext, useState} from "react";
import { FormLabel, TextField } from '@mui/material';
import {useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'antd';
import {AuthContext, TOKEN_KEY} from "../redux/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const authContext = useContext(AuthContext);

  const navigate = useNavigate(); // route navigation 
  const signUpRouteChange = () => {
    let path = `/signup`;
    navigate(path);
  }
  const passwordResetRouteChange = () => {
    let path = `/forgetpassword`;
    navigate(path);
  }

  const baseURL = "http://localhost:8080/user";

  const formStyle = {
    maxWidth: "800px",
    margin: "0% auto",
    padding: "20px"
  }

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (email && password) {
      setLoading(true);
      axios.post(`${baseURL}/webLogin/${email}/${password}`).then((response) => {
        console.log(response);
        if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404 || response.data.httpStatusCode === 422) {
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
          setLoading(false);
        } else {
          toast.success('Login Successful!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem(TOKEN_KEY, response.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

          console.log('login', response.data)

          setLoading(false);

          authContext.setAuthState({
            authenticated: true
          });

          setTimeout(() => {
            navigate('/profile')
          }, 700);
          setLoading(false);
        }
      })
        .catch((error) => {
          console.error("Axios Error : ", error);
          setLoading(false);
        });
    }
  }

  return (
    <div className="Login" style={{backgroundColor: "white", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center", minHeight: "100vh"}}>
      <br /><br /><br />
      <center><h1>WithinSG Vendor Portal</h1></center>
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
          <Button type="primary" htmlType="submit" loading={loading} disabled={!validateForm()}>Login</Button>
          <br /><br />
          <Button type="link" onClick={passwordResetRouteChange}>Forgotten your password?</Button>
        </div>
        <ToastContainer />

        <center>
          <h3>Keen to join us as a vendor? Sign up for an account today!</h3>
          <Button type="primary" onClick={signUpRouteChange}>Sign Up</Button>
        </center>
      </form>
    </div>
  );
}

export default Login;