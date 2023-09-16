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
        // display either tourist or local name
        // {
        //     title: 'Attraction',
        //     dataIndex: '',
        //     key: '',
        // },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
        },
        {
            title: 'Start Time',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
        },
        {
            title: 'End Time',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
        },
        // {
        //     title: 'Payment Status',
        //     dataIndex: '',
        //     key: '',
        // },
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
            const fetchData = async () => {
                const response = await getAttractionBookingListByVendor(vendor.vendor.vendor_id);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
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

                        {/* pagination */}
                        <CustomTablePagination
                            title="Attraction Bookings"
                            column={bookingsColumns}
                            data={attractionBookingsData}
                        />

                        {/* Modal to view attraction */}
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