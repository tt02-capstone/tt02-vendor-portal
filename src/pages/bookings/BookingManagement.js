import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Menu } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAttractionBookingListByVendor, getAttractionBookingByVendor } from "../../redux/bookingRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewAttractionBookingModal from "./ViewAttractionBookingModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';

export default function BookingManagement() {

    const navigate = useNavigate();
    // const { Header, Content, Sider, Footer } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    const [getAttractionBookingsData, setGetAttractionBookingsData] = useState(true);
    const [attractionBookingsData, setAttractionBookingsData] = useState([]); // list of attractions
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState([]);

    const bookingsColumns = [
        {
            title: 'Id',
            dataIndex: 'booking_id',
            key: 'booking_id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => {
                if (record.tourist_user) {
                    return record.tourist_user.name; 
                } else if (record.local_user) {
                    return record.local_user.name; 
                } else {
                    return '';
                }
            },
        },
        {
            title: 'Customer Type',
            dataIndex: 'customerType',
            key: 'customerType',
            render: (text, record) => {
                if (record.tourist_user) {
                    return 'Tourist'; 
                } else if (record.local_user) {
                    return 'Local'; 
                } else {
                    return '';
                }
            },
        },
        {
            title: 'Attraction',
            dataIndex: 'attraction', 
            key: 'attraction',
            render: (attraction) => {
                return attraction ? attraction.name : '';
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'UPCOMING':
                        color = 'processing';
                        break;
                    case 'ONGOING':
                        color = 'warning';
                        break;
                    case 'COMPLETED':
                        color = 'success';
                        break;
                    case 'CANCELLED':
                        color = 'error';
                        break;
                }
    
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            render: (lastUpdate) => {
                const dateObj = new Date(lastUpdate);
                const formattedDate = dateObj.toLocaleDateString(); // Format the date as per the user's locale
                const formattedTime = dateObj.toLocaleTimeString(); // Format the time as per the user's locale
                return `${formattedDate} ${formattedTime}`;
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
            render: (startTime) => {
                return startTime ? new Date(startTime).toLocaleDateString() : '';
            },
        },
        {
            title: 'End Date',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
            render: (endTime) => {
                return endTime ? new Date(endTime).toLocaleDateString() : '';
            },
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => {
                let color = '';
                if (payment && payment.is_paid) {
                    color = 'green';
                } else {
                    color = 'red';
                }
    
                return <Tag color={color}>{payment ? (payment.is_paid ? 'PAID' : 'UNPAID') : 'N/A'}</Tag>;
            },
        },
        {
            title: 'Amount Earned',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => {
                return `$${(payment.payment_amount * (1 - payment.comission_percentage)).toFixed(2)}`
            },
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <Space>
                    <CustomButton
                        text="View"
                        onClick={() => onClickOpenViewAttractionBookingModal(record.booking_id)}
                    />
                </Space>
            }
        },
    ];

    useEffect(() => {
        if (getAttractionBookingsData) {
            console.log("user id", vendor.user_id)
            console.log("vendor vendor vendor",vendor.vendor.vendor_id)
            const fetchData = async () => {
                const response = await getAttractionBookingListByVendor(vendor.vendor.vendor_id);
                console.log("response data", response.data)
                if (response.status) {
                    var tempData = response.data.map((val) => ({ // an object is returned! but need array. i guess bc only 1 attraction?? 
                        ...val,
                        key: val.user_id,
                    }));
                    setAttractionBookingsData(tempData);
                    setGetAttractionBookingsData(false);
                    console.log(response.data)
                } else {
                    console.log("List of attraction bookings not fetched!");
                }
            }

            fetchData();
            setGetAttractionBookingsData(false);
        }
    }, [getAttractionBookingsData]);

    // View Booking 
    const [isViewAttractionBookingModalOpen, setIsViewAttractionBookingModalOpen] = useState(false); // boolean to open modal

    useEffect(() => {

    }, [selectedBookingId])

    //view attraction modal open button
    function onClickOpenViewAttractionBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewAttractionBookingModalOpen(true);

    }

    // view attraction modal cancel button
    function onClickCancelViewAttractionBookingModal() {
        setIsViewAttractionBookingModalOpen(false);
    }

    async function getBooking(vendor, selectedBookingId) {
        try {
            let response = await getAttractionBookingByVendor(vendor.vendor_id, selectedBookingId);
            setSelectedBooking(response.data);
            // setPriceList(response.data.price_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve booking!');
        }
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomTablePagination
                            title="Attraction Bookings"
                            column={bookingsColumns}
                            data={attractionBookingsData}
                        />

                        
                        <ViewAttractionBookingModal
                            isViewAttractionBookingModalOpen={isViewAttractionBookingModalOpen}
                            onClickCancelViewAttractionBookingModal={onClickCancelViewAttractionBookingModal}
                            bookingId={selectedBookingId}
                        />

                    </Content>
                </Layout>
            </Layout>

            <ToastContainer />
        </div>
    ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}