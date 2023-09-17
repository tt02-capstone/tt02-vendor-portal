import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import VendorStaff from "./pages/vendor/VendorStaff";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, { useEffect, useState } from "react";
import {Footer} from "antd/es/layout/layout";
import AttractionManagement from "./pages/attractions/AttractionManagement";
import BookingManagement from "./pages/bookings/BookingManagement";
import Profile from "./pages/profileAndPassword/Profile";
import Signup from "./pages/Signup/Signup";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import EmailVerification from "./pages/EmailVerification";
import AttractionManageTicket from "./pages/attractions/AttractionManageTicket";
import { HomeOutlined, UserOutlined, UsergroupAddOutlined, BarsOutlined, CalendarOutlined, BankOutlined } from '@ant-design/icons';
import { Logout } from "@mui/icons-material";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

function App() {

  const stripePromise = loadStripe('pk_test_51NmFq8JuLboRjh4q4oxGO4ZUct2x8EzKnOtukgnrwTU2rr7A8AcL33OpPxtxGPLHoqCspNQtRA0M1P1uuaViRXNF00HZxqJgEg');

  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState('/home');

  const vendorStaffMenuItems = [
      {key: '/home', label: 'Home', icon: <HomeOutlined />},
      {key: '/profile', label: 'Profile', icon: <UserOutlined />},
      {key: '/vendorStaff', label: 'Users', icon: <UsergroupAddOutlined />},
      {key: '/attraction', label: 'Attractions',icon: <BankOutlined />,},
      {key: '/bookingmanagement', label: 'Bookings',icon: <CalendarOutlined />,},
      {key: '/', label: 'Logout',icon: <Logout />,}
  ];

  const localMenuItems = [
    {key: '/home', label: 'Home', icon: <HomeOutlined />},
    {key: '/profile', label: 'Profile', icon: <UserOutlined />},
    {key: '/', label: 'Logout',icon: <Logout />,}
  ];

  const onClickNewTab = (tab) => {
    console.log(tab.key);
    if (tab.key == '/') {
      localStorage.removeItem("user");
      navigate(tab.key);
    } else {
      setCurrentTab(tab.key);
      navigate(tab.key);
    }
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
          <Route path="/profile" element={
          <Elements stripe={stripePromise}>
            <Profile />
          </Elements>
          } />
          <Route path="/vendorStaff" element={<VendorStaff />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/passwordreset" element={<PasswordReset />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/bookingmanagement" element={<BookingManagement />} />
          <Route path="/verifyemail" element={<EmailVerification />} />
          <Route path="/attraction" element={<AttractionManagement />} />
          <Route path="/attraction/viewTicket" element={<AttractionManageTicket />} />
      </Routes>
        {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
    </Layout>
  );
}

export default App;

