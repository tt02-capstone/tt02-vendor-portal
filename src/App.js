import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VendorStaff from "./pages/vendor/VendorStaff";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import {Footer} from "antd/es/layout/layout";
import Profile from "./pages/profileAndPassword/Profile";
import Signup from "./pages/Signup/Signup";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import EmailVerification from "./pages/EmailVerification";
import { HomeOutlined, UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Logout } from "@mui/icons-material";

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const vendorStaffMenuItems = [
      {key: '/home', label: 'Home', icon: <HomeOutlined />},
      {key: '/profile', label: 'Profile', icon: <UserOutlined />},
      {key: '/vendorStaff', label: 'Users', icon: <UsergroupAddOutlined />},
      {key: '/', label: 'Logout',icon: <Logout />,}
  ];

  const localMenuItems = [
    {key: '/home', label: 'Home', icon: <HomeOutlined />},
    {key: '/profile', label: 'Profile', icon: <UserOutlined />},
    {key: '/', label: 'Logout',icon: <Logout />,}
];

  const onClickNewTab = (tab) => {
      console.log(tab.key);
      setCurrentTab(tab.key);
      navigate(tab.key);
  };

  return (
    <Layout hasSider={location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword' && location.pathname !== '/verifyemail'}>
      {location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword' && location.pathname !== '/verifyemail' &&
          <Navbar
              currentTab={currentTab}
              vendorStaffMenuItems={vendorStaffMenuItems}
              localMenuItems={localMenuItems}
              onClickNewTab={onClickNewTab}
          />
      }
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/vendorStaff" element={<VendorStaff />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/verifyemail" element={<EmailVerification />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

