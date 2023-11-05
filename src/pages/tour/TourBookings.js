import React, { useState, useEffect, useRef } from "react";
import { Layout, Input, Button, Space, Tag } from 'antd';
import { Content } from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllBookingsByLocal } from "../../redux/tourRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import ViewTourBookingModal from "./ViewTourBookingModal";
import { CSVLink } from 'react-csv';

export default function TourBookings() {

    // const navigate = useNavigate();
    const local = JSON.parse(localStorage.getItem("user"));
    const [getBookingsData, setGetBookingsData] = useState(true);
    const [bookingsData, setBookingsData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    // const [selectedBooking, setSelectedBooking] = useState();

    const viewBookingBreadCrumb = [
        {
            title: 'Tour Bookings',
        }
    ];

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
                if (record.local_user != null) {
                    return <Tag color='success'>LOCAL</Tag>;
                } else if (record.tourist_user != null) {
                    return <Tag color='error'>TOURIST</Tag>;
                } else {
                    return 'Bug';
                }
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
                }

                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            sorter: (a, b) => new Date(a.last_update) > new Date(b.last_update),
            ...getColumnSearchProps('last_update'),
        },
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
                return <Space>
                    <CustomButton
                        text="View"
                        style={{ fontWeight: "bold" }}
                        onClick={() => onClickOpenViewTourBookingModal(record.booking_id)}
                    />
                </Space>
            }
        },
    ];

    const csvHeaders = [
        { label: 'Customer Name', key: 'name' },
        { label: 'Customer Email', key: 'email' },
        { label: 'Customer Type', key: 'booked_user' },
        { label: 'Customer Contact', key: 'contact' },
        { label: 'Status', key: 'status' },
        { label: 'Last Updated', key: 'last_update' },
        { label: 'Start Time', key: 'start_time' },
        { label: 'End Time', key: 'end_time' },
        { label: 'Payment Status', key: 'payment' },
        { label: 'Amount Earned', key: 'payment_amount' },
    ];

    const csvData = bookingsData.map(item => ({
        name: item.name,
        email: item.local_user ? item.local_user.email : item.tourist_user ? item.tourist_user.email : 'UNKNOWN',
        booked_user: item.local_user ? 'LOCAL' : item.tourist_user ? 'TOURIST' : 'UNKNOWN',
        contact: item.local_user ? item.local_user.country_code + ' ' + item.local_user.mobile_num : item.tourist_user
            ? item.tourist_user.country_code + ' ' + item.tourist_user.mobile_num : 'UNKNOWN',
        status: item.status,
        last_update: item.last_update,
        start_time: moment(item.tour.start_time).format('h.mm a'),
        end_time: moment(item.tour.end_time).format('h.mm a'),
        payment: item.payment.is_paid ? 'PAID' : 'UNPAID',
        payment_amount: item.payment_amount
    }));

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
                const response = await getAllBookingsByLocal(local.user_id);
                if (response.status) {
                    console.log(response.data);
                    var tempData = response.data.map((val) => ({
                        ...val,
                        name: val.local_user != null ? val.local_user.name : val.tourist_user.name,
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

    const [isViewTourBookingModalOpen, setIsViewTourBookingModalOpen] = useState(false);
    function onClickOpenViewTourBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewTourBookingModalOpen(true);
    }

    function onClickCancelViewTourBookingModal() {
        setIsViewTourBookingModalOpen(false);
        setSelectedBookingId(null);
    }

    return local ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={viewBookingBreadCrumb} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomTablePagination
                            title="Bookings"
                            column={bookingsColumns}
                            data={bookingsData}
                            rowKey="booking_id"
                            tableLayout="fixed"
                        />

                        <ViewTourBookingModal
                            openViewModal={isViewTourBookingModalOpen}
                            onClickCancelViewTourBookingModal={onClickCancelViewTourBookingModal}
                            id={selectedBookingId}
                        />

                        <CSVLink data={csvData} headers={csvHeaders}>
                            <Button type="primary">
                                Export to Excel
                            </Button>
                        </CSVLink>
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
        minWidth: '91.5vw'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%"
    },
}