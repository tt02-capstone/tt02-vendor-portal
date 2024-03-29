import React, { useState, useEffect, useRef } from "react";
import { Layout, Input, Button, Space, Tag } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getBookingListByVendor, getBookingByVendor } from "../../redux/bookingRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewAttractionBookingModal from "./ViewAttractionBookingModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import ViewTelecomBookingModal from "./ViewTelecomBookingModal";
import ViewRoomBookingModal from "./ViewRoomBookingModal";
import ViewItemBookingModal from "../delivery/ViewItemBookingModal";

export default function BookingManagement() {

    const navigate = useNavigate();
    const vendor = JSON.parse(localStorage.getItem("user"));

    const [getBookingsData, setGetBookingsData] = useState(true);
    const [bookingsData, setBookingsData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState();

    const viewBookingBreadCrumb = [
        {
          title: 'Bookings',
        }
    ];

    const statusDisplayNames = {
        PENDING_VENDOR_DELIVERY: 'Pending Vendor Delivery',
        PREPARE_FOR_SHIPMENT: 'Prepare for Shipment',
        SHIPPED_OUT: 'Shipped Out',
        DELIVERED: 'Delivered',
        PENDING_VENDOR_PICKUP: 'Pending Vendor Pickup',
        PREPARE_FOR_PICKUP: 'Prepare for Pickup',
        READY_FOR_PICKUP: 'Ready for Pickup',
        PICKED_UP: 'Picked Up',
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
      
    const bookingsColumns = [
        {
            title: 'Customer Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name > b.name,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Customer Type',
            dataIndex: 'booked_user',
            key: 'booked_user',
            filters: [
                {
                    text: 'Local',
                    value: 'LOCAL',
                },
                {
                    text: 'Tourist',
                    value: 'TOURIST',
                },
            ],
            onFilter: (value, record) => record.booked_user === value,
            render: (text, record) => {
              if (text === 'LOCAL') {
                return <Tag color='success'>LOCAL</Tag>;
              } else if (text === 'TOURIST') {
                return <Tag color='error'>TOURIST</Tag>;
              } else {
                return 'Bug';
              }
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                {
                    text: 'Accommodation',
                    value: 'ACCOMMODATION',
                },
                {
                    text: 'Telecom',
                    value: 'TELECOM',
                },
                {
                    text: 'Attraction',
                    value: 'ATTRACTION',
                },
                {
                    text: 'Tour',
                    value: 'TOUR',
                },
                {
                    text: 'Item',
                    value: 'ITEM',
                },
            ],
            onFilter: (value, record) => record.type === value,
            render: (text, record) => {
                let color = '';
                let value = '';
                switch (text) {
                    case 'ITEM':
                        color = 'yellow';
                        value = 'ITEM';
                        break;
                    case 'ACCOMMODATION':
                        color = 'purple';
                        value = 'ACCOMMODATION';
                        break;
                    case 'TELECOM':
                        color = 'magenta';
                        value = 'TELECOM';
                        break;
                    case 'ATTRACTION':
                        color = 'volcano';
                        value = 'ATTRACTION';
                        break;
                    case 'TOUR':
                        color = 'geekblue';
                        value = 'TOUR';
                        break;
                }

                return <Tag color={color}>{value}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Upcoming',
                    value: 'UPCOMING',
                },
                {
                    text: 'Ongoing',
                    value: 'ONGOING',
                },
                {
                    text: 'Completed',
                    value: 'COMPLETED',
                },
                {
                    text: 'Cancelled',
                    value: 'CANCELLED',
                },
                {
                    text: 'Pending Vendor Delivery',
                    value: 'PENDING_VENDOR_DELIVERY',
                },
                {
                    text: 'Prepare for Shipment',
                    value: 'PREPARE_FOR_SHIPMENT',
                },
                {
                    text: 'Shipped Out',
                    value: 'SHIPPED_OUT',
                },
                {
                    text: 'Delivered',
                    value: 'DELIVERED',
                },
                {
                    text: 'Pending Vendor Pickup',
                    value: 'PENDING_VENDOR_PICKUP',
                },
                {
                    text: 'Prepare for Pickup',
                    value: 'PREPARE_FOR_PICKUP',
                },
                {
                    text: 'Ready for Pickup',
                    value: 'READY_FOR_PICKUP',
                },
                {
                    text: 'Picked Up',
                    value: 'PICKED_UP',
                },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                let color = 'default';
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
                    case 'PENDING_VENDOR_DELIVERY':
                        color = 'processing';
                        break;
                    case 'PREPARE_FOR_SHIPMENT':
                        color = 'processing';
                        break;
                    case 'SHIPPED_OUT':
                        color = 'processing';
                        break;
                    case 'DELIVERED':
                        color = 'success';
                        break;
                    case 'PENDING_VENDOR_PICKUP':
                        color = 'processing';
                        break;
                    case 'PREPARE_FOR_PICKUP':
                        color = 'processing';
                        break;
                    case 'READY_FOR_PICKUP':
                        color = 'processing';
                        break;
                    case 'PICKED_UP':
                        color = 'success';
                        break;
                    default:
                        color = 'default';
                }

                const displayName = statusDisplayNames[status] || status;

                return <Tag color={color}>{displayName}</Tag>;
            },
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            sorter: (a, b) => new Date(a.last_update) > new Date(b.last_update),
            ...getColumnSearchProps('last_update'),
        },
        // {
        //     title: 'Start Date',
        //     dataIndex: 'start_datetime',
        //     key: 'start_datetime',
        //     sorter: (a, b) => new Date(a.start_datetime) > new Date(b.start_datetime),
        //     ...getColumnSearchProps('start_datetime'),
        // },
        // {
        //     title: 'End Date',
        //     dataIndex: 'end_datetime',
        //     key: 'end_datetime',
        //     sorter: (a, b) => new Date(a.end_datetime) > new Date(b.end_datetime),
        //     ...getColumnSearchProps('end_datetime'),
        // },
        {
            title: 'Payment Status',
            dataIndex: 'payment',
            key: 'payment',
            filters: [
                {
                    text: 'Paid',
                    value: true,
                },
                {
                    text: 'Unpaid',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.payment.is_paid === value,
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
            dataIndex: 'payment_amount',
            key: 'payment_amount',
            sorter: (a, b) => a.payment_amount > b.payment_amount,
            ...getColumnSearchProps('payment_amount'),
        },
        {
            title: 'Action(s)',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            render: (text, record) => {
                if (text === 'ATTRACTION') {
                    return <Space>
                            <CustomButton
                                text="View"
                                style={{fontWeight: "bold"}}
                                onClick={() => onClickOpenViewAttractionBookingModal(record.booking_id)}
                            />
                        </Space>
                } else if (text === 'TELECOM') {
                    return <Space>
                            <CustomButton
                                text="View"
                                style={{fontWeight: "bold"}}
                                onClick={() => onClickOpenViewTelecomBookingModal(record.booking_id)}
                            />
                        </Space>
                } else if (text === 'ACCOMMODATION') {
                    return <Space>
                            <CustomButton
                                text="View"
                                style={{fontWeight: "bold"}}
                                onClick={() => onClickOpenViewRoomBookingModal(record.booking_id)}
                            />
                        </Space>
                } else if (text === 'ITEM') {
                    return <Space>
                        <CustomButton
                            text="View"
                            style={{fontWeight: "bold"}}
                            onClick={() => onClickOpenViewItemBookingModal(record.booking_id)}
                        />
                    </Space>
                }  else {
                    return <p>'Bug</p>
                }
            }
        },
    ];


    // async function onItemStatusSubmit(telecom) {
    //     let obj = {
    //         ...telecom,
    //         telecom_id: editTelecomId,
    //     }
    //
    //     const response = await updateTelecom(obj);
    //     if (response.status) {
    //         setFetchTelecomList(true); // update list
    //         setEditTelecomId(undefined);
    //         setEditTelecomModal(false);
    //         toast.success('Telecom successfully updated!', {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 1500
    //         });
    //     } else {
    //         toast.error(response.data.errorMessage, {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 1500
    //         });
    //     }
    // }

    function formatDate(dateTime) {
        if (!dateTime) return '';
        const dateObj = new Date(dateTime);
        const formattedDate = dateObj.toLocaleDateString(); 
        const formattedTime = dateObj.toLocaleTimeString(); 
        return `${formattedDate} ${formattedTime}`;
    }

    useEffect(() => {
        if (getBookingsData) {
            const fetchData = async () => {
                const response = await getBookingListByVendor(vendor.user_id);
                if (response.status) {
                    console.log(response.data);
                    var tempData = response.data.map((val) => ({
                        ...val,
                        name: val.booked_user === 'LOCAL' ? val.local_user.name : val.tourist_user.name,
                        start_datetime: moment(val.start_datetime).format('ll'),
                        end_datetime: moment(val.end_datetime).format('ll'),
                        payment_amount: `$${(val.payment.payment_amount * (1 - val.payment.comission_percentage)).toFixed(2)}`,
                        last_update: formatDate(val.last_update),
                        key: val.user_id,
                    }));
                    setBookingsData(tempData);
                    setGetBookingsData(false);
                } else {
                    console.log("List of bookings not fetched!");
                }
            }

            fetchData();
            setGetBookingsData(false);
        }
    }, [getBookingsData]);

    // view booking modal
    const [isViewAttractionBookingModalOpen, setIsViewAttractionBookingModalOpen] = useState(false);
    const [isViewTelecomBookingModalOpen, setIsViewTelecomBookingModalOpen] = useState(false);
    const [isViewRoomBookingModalOpen, setIsViewRoomBookingModalOpen] = useState(false);
    const [isViewItemBookingModalOpen, setIsViewItemBookingModalOpen] = useState(false);


    //view item booking modal open button
    function onClickOpenViewItemBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewItemBookingModalOpen(true);
    }

    // view attraction booking modal cancel button
    function onClickCancelViewItemBookingModal() {
        setIsViewItemBookingModalOpen(false);
        setSelectedBookingId(null);
    }

    //view attraction booking modal open button
    function onClickOpenViewAttractionBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewAttractionBookingModalOpen(true);
    }

    // view attraction booking modal cancel button
    function onClickCancelViewAttractionBookingModal() {
        setIsViewAttractionBookingModalOpen(false);
        setSelectedBookingId(null);
    }

    //view telecom booking modal open button
    function onClickOpenViewTelecomBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewTelecomBookingModalOpen(true);
    }

    // view telecom booking modal cancel button
    function onClickCancelViewTelecomBookingModal() {
        setIsViewTelecomBookingModalOpen(false);
        setSelectedBookingId(null);
    }

    function onClickOpenViewRoomBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewRoomBookingModalOpen(true);
    }

    // view telecom booking modal cancel button
    function onClickCancelViewRoomBookingModal() {
        setIsViewRoomBookingModalOpen(false);
        setSelectedBookingId(null);
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
            <CustomHeader items={viewBookingBreadCrumb}/>
                <Layout style={{ padding: '0 24px 24px', backgroundColor: 'white' }}>
                    <Content style={styles.content}>

                        <CustomTablePagination
                            title="Bookings"
                            column={bookingsColumns}
                            data={bookingsData}
                            rowKey="booking_id"
                            tableLayout="fixed"
                        />

                        <ViewAttractionBookingModal
                            openViewModal={isViewAttractionBookingModalOpen}
                            onClickCancelViewAttractionBookingModal={onClickCancelViewAttractionBookingModal}
                            id={selectedBookingId}
                        />

                        <ViewTelecomBookingModal
                            openViewModal={isViewTelecomBookingModalOpen}
                            onClickCancelViewTelecomBookingModal={onClickCancelViewTelecomBookingModal}
                            id={selectedBookingId}
                        />

                        <ViewRoomBookingModal
                            openViewModal={isViewRoomBookingModalOpen}
                            onClickCancelViewRoomBookingModal={onClickCancelViewRoomBookingModal}
                            id={selectedBookingId}
                        />

                        <ViewItemBookingModal
                            openViewModal={isViewItemBookingModalOpen}
                            onClickCancelViewItemBookingModal={onClickCancelViewItemBookingModal}
                            id={selectedBookingId}
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
        minWidth: '91.5vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%", 
        marginTop:'-5px'
    },
}