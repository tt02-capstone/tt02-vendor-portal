import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Menu, Table } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAttractionBookingListByVendor, getAttractionBookingByVendor } from "../../redux/bookingRedux";
import CustomHeader from "../../components/CustomHeader";
import ViewAttractionBookingModal from "./ViewAttractionBookingModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ToastContainer, toast } from 'react-toastify';

export default function BookingManagement() {

    const navigate = useNavigate();
    const vendor = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(false);

    const [getAttractionBookingsData, setGetAttractionBookingsData] = useState(true);
    const [attractionBookingsData, setAttractionBookingsData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);

    const breadcrumbItems = [
        {
          title: 'Bookings',
        },
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
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
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

    function getCustomerNameForSorting(record) {
        if (record.tourist_user) {
          return record.tourist_user.name.toLowerCase();
        } else if (record.local_user) {
          return record.local_user.name.toLowerCase();
        } else {
          return '';
        }
      }
      
      function getCustomerTypeForSorting(record) {
        if (record.tourist_user) {
          return 'Tourist';
        } else if (record.local_user) {
          return 'Local';
        } else {
          return '';
        }
      }
      
    const bookingsColumns = [
        {
            title: 'Id',
            dataIndex: 'booking_id',
            key: 'booking_id',
            sorter: (a, b) => a.booking_id.localeCompare(b.booking_id),
            ...getColumnSearchProps('booking_id'),
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
            sorter: (a, b) => {
                const nameA = getCustomerNameForSorting(a);
                const nameB = getCustomerNameForSorting(b);
                return nameA.localeCompare(nameB);
              },
              ...getColumnSearchProps('customerName'),
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
            sorter: (a, b) => {
              const typeA = getCustomerTypeForSorting(a);
              const typeB = getCustomerTypeForSorting(b);
              return typeA.localeCompare(typeB);
            },
            ...getColumnSearchProps('customerType'),
          },
        {
            title: 'Attraction',
            dataIndex: 'attraction',
            key: 'attraction',
            render: (attraction) => {
                return attraction ? attraction.name : '';
            },
            sorter: (a, b) => {
                const nameA = ((a.attraction && a.attraction.name) || '').toLowerCase();
                const nameB = ((b.attraction && b.attraction.name) || '').toLowerCase();
                return nameA.localeCompare(nameB);
              },
              ...getColumnSearchProps('attraction.name'),
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
            sorter: (a, b) => a.status.localeCompare(b.status),
            ...getColumnSearchProps('status'),
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            render: (lastUpdate) => {
                const dateObj = new Date(lastUpdate);
                const formattedDate = dateObj.toLocaleDateString();
                const formattedTime = dateObj.toLocaleTimeString();
                return `${formattedDate} ${formattedTime}`;
            },
            sorter: (a, b) => a.lastUpdate - b.lastUpdate, 
            ...getColumnSearchProps('last_update'), 
        },
        {
            title: 'Start Date',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
            render: (startTime) => {
                return startTime ? new Date(startTime).toLocaleDateString() : '';
            },
            sorter: (a, b) => a.startTime.localeCompare(b.startTime),
            ...getColumnSearchProps('startTime'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
            render: (endTime) => {
                return endTime ? new Date(endTime).toLocaleDateString() : '';
            },
            sorter: (a, b) => a.endTime.localeCompare(b.endTime),
            ...getColumnSearchProps('endTime'),
        },
        {
            title: 'Tickets',
            dataIndex: 'booking_item_list',
            key: 'booking_item_list',
            render: (bookingItemList) => {
                if (bookingItemList && bookingItemList.length > 0) {
                    const ticketDescriptions = bookingItemList.map((bookingItem) => (
                        `${bookingItem.activity_selection} (${bookingItem.quantity})`
                    ));
                    const ticketDescriptionString = ticketDescriptions.join(', ');

                    return <div>{ticketDescriptionString}</div>;
                } else {
                    return 'N/A';
                }
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
            sorter: (a, b) => a.payment.is_paid.localeCompare(b.payment.is_paid),
            ...getColumnSearchProps('payment'),
        },
        {
            title: 'Amount Earned',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => {
                return `$${(payment.payment_amount * (1 - payment.comission_percentage)).toFixed(2)}`
            },
            sorter: (a, b) => a.payment.is_paid.localeCompare(b.payment.is_paid),
            ...getColumnSearchProps('payment.is_paid'),
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
            console.log("vendor vendor vendor", vendor.vendor.vendor_id)
            const fetchData = async () => {
                const response = await getAttractionBookingListByVendor(vendor.user_id);
                console.log("response data", response.data)
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

    // VIEW BOOKING
    const [isViewAttractionBookingModalOpen, setIsViewAttractionBookingModalOpen] = useState(false);

    useEffect(() => {

    }, [selectedBookingId])

    //view booking modal open button
    function onClickOpenViewAttractionBookingModal(bookingId) {
        setSelectedBookingId(bookingId);
        setIsViewAttractionBookingModalOpen(true);
    }

    // view booking modal cancel button
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
            <CustomHeader items={breadcrumbItems}/>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomTablePagination
                            title="Bookings"
                            column={bookingsColumns}
                            data={attractionBookingsData}
                            tableLayout="fixed"
                            
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
        minWidth: '90vw'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}