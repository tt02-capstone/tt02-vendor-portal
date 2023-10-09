import {Routes, Route, useNavigate, useLocation} from "react-router-dom";
import Login from "./pages/Login";
import VendorStaff from "./pages/vendor/VendorStaff";
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "./components/Navbar";
import {Layout, Menu} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {Footer} from "antd/es/layout/layout";
import AttractionManagement from "./pages/attractions/AttractionManagement";
import AccommodationManagement from "./pages/accommodations/AccommodationManagement";
import RoomManagement from "./pages/accommodations/RoomManagement";
import BookingManagement from "./pages/bookings/BookingManagement";
import Profile from "./pages/profileAndPassword/Profile";
import Signup from "./pages/Signup/Signup";
import PasswordReset from "./pages/PasswordReset/PasswordReset";
import ForgetPassword from "./pages/PasswordReset/ForgetPassword";
import EmailVerification from "./pages/EmailVerification";
import AttractionManageTicket from "./pages/attractions/AttractionManageTicket";
import {
    UserOutlined,
    UsergroupAddOutlined,
    BarsOutlined,
    CalendarOutlined,
    HomeOutlined,
    BankOutlined,
    MoneyCollectOutlined,
    PhoneOutlined,
    ScheduleOutlined
} from '@ant-design/icons';
import {Logout} from "@mui/icons-material";
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {AuthContext, AuthProvider} from "./redux/AuthContext";
import TelecomManagement from "./pages/telecom/TelecomManagement";
import DealManagement from "./pages/deals/DealManagement";
import RestaurantManagement from "./pages/restaurant/RestaurantManagement";
import DishManagement from "./pages/restaurant/DishManagment";
import TourTypes from "./pages/tour/TourTypes";
import Tours from "./pages/tour/Tours";
import TourBookings from "./pages/tour/TourBookings";

function AppLayout() {

    const stripePromise = loadStripe('pk_test_51NmFq8JuLboRjh4q4oxGO4ZUct2x8EzKnOtukgnrwTU2rr7A8AcL33OpPxtxGPLHoqCspNQtRA0M1P1uuaViRXNF00HZxqJgEg');

    const navigate = useNavigate();
    const location = useLocation();
    const {authState, logout} = useContext(AuthContext);
    const [currentTab, setCurrentTab] = useState('/profile');

    const vendorStaffMenuItems = [
        {key: '/profile', label: 'Profile', icon: <UserOutlined/>},
        {key: '/vendorStaff', label: 'Users', icon: <UsergroupAddOutlined/>},
        {key: '/attraction', label: 'Attractions', icon: <BankOutlined/>,},
        {key: '/accommodation', label: 'Accommodations', icon: <BankOutlined/>,},
        {key: '/telecom', label: 'Telecoms', icon: <PhoneOutlined/>,},
        {key: '/restaurant', label: 'Restaurants', icon: <HomeOutlined/>,},
        {key: '/deal', label: 'Deals', icon: <MoneyCollectOutlined />,},
        {key: '/bookingmanagement', label: 'Bookings', icon: <CalendarOutlined/>,},
        {key: '/', label: 'Logout', icon: <Logout/>,}
    ];

    const localMenuItems = [
        {key: '/profile', label: 'Profile', icon: <UserOutlined/>},
        {key: '/tourtypes', label: 'Tours', icon: <ScheduleOutlined/>},
        {key: '/tourbookings', label: 'Tour Bookings', icon: <CalendarOutlined/>},
        {key: '/', label: 'Logout', icon: <Logout/>,}
    ];

    const onClickNewTab = async (tab) => {
        console.log(tab.key);
        if (tab.key === '/') {
            console.log('In logout')
            await logout();
            navigate(tab.key);
        } else {
            setCurrentTab(tab.key);
            navigate(tab.key);
        }
    };

    return (
        <Layout hasSider={authState?.authenticated}>
            {authState?.authenticated &&
                <Navbar
                    currentTab={currentTab}
                    vendorStaffMenuItems={vendorStaffMenuItems}
                    localMenuItems={localMenuItems}
                    onClickNewTab={onClickNewTab}
                />
            }
            <Routes>
                {authState?.authenticated ? (
                    <>
                        <Route path="/attraction" element={<AttractionManagement/>}/>
                        <Route path="/accommodation" element={<AccommodationManagement/>}/>
                        <Route path="/attraction/viewTicket" element={<AttractionManageTicket/>}/>
                        <Route path="/accommodation/rooms" element={<RoomManagement/>}/>
                        <Route path="/bookingmanagement" element={<BookingManagement/>}/>
                        <Route path="/profile" element={<Elements stripe={stripePromise}><Profile/></Elements>}/>
                        <Route path="/vendorStaff" element={<VendorStaff/>}/>
                        <Route path="/telecom" element={<TelecomManagement/>}/>
                        <Route path="/restaurant" element={<RestaurantManagement/>}/>
                        <Route path="/dish" element={<DishManagement/>}/>
                        <Route path="/tourtypes" element={<TourTypes />}/>
                        <Route path="/tours/:tourTypeId" element={<Tours />}/>
                        <Route path="/deal" element={<DealManagement/>}/>
                        <Route path="/tourbookings" element={<TourBookings/>}/>
                        <Route path="*" element={<Elements stripe={stripePromise}><Profile/></Elements>}/>
                    </>) : (<>
                        <Route path="/" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/passwordreset" element={<PasswordReset/>}/>
                        <Route path="/forgetpassword" element={<ForgetPassword/>}/>
                        <Route path="/verifyemail" element={<EmailVerification/>}/>
                        <Route path="*" element={<Login/>}/>
                    </>
                )}
            </Routes>
            {/*<Footer style={{ textAlign: 'center' }}>TT02 Captsone ©2023</Footer>*/}
        </Layout>
    );
}

const App = () => {

    return (
        <AuthProvider>
            <AppLayout>
            </AppLayout>
        </AuthProvider>
    )
}


export default App;

