import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import { MailOutlined } from '@ant-design/icons';
import LogoutIcon from '@mui/icons-material/Logout';
import {Footer} from "antd/es/layout/layout";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";
import ForgetPassword from "./pages/ForgetPassword";
import AttractionManagement from "./pages/attractions/AttractionManagement";

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const menuItems = [
      {key: '/home', label: 'Home', icon: <MailOutlined />},
      {key: '/attractionmanagement', label: 'Attractions Management',icon: <MailOutlined />,},
      {key: '/', label: 'Logout',icon: <LogoutIcon />,}
  ];

  const onClickNewTab = (tab) => {
      console.log(tab.key);
      setCurrentTab(tab.key);
      navigate(tab.key);
  };

  return (
    <Layout hasSider={location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword'}>
      {location.pathname !== '/' && location.pathname !== '/signup' && location.pathname !== '/passwordreset' && location.pathname !== '/forgetpassword' &&
          <Navbar
              currentTab={currentTab}
              menuItems={menuItems}
              onClickNewTab={onClickNewTab}
          />
      }
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/attractionmanagement" element={<AttractionManagement />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

