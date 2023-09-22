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

    const [getAttractionBookingsData, setGetAttractionBookingsData] = useState(true);
    const [attractionBookingsData, setAttractionBookingsData] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState([]);

    const viewBookingBreadCrumb = [
        {
          title: 'Bookings',
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
              placeholder={`Search ${Array.isArray(dataIndex) ? dataIndex.join(', ') : dataIndex}`}
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
              {/* <Button
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
              </Button> */}
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
        onFilter: (value, record) => {

            console.log("onFilter value", value);
            console.log("onFilter record", record);
            console.log("onFilter dataIndex", dataIndex);
            
            if (dataIndex == 'customerName') {
                const customerName = record.tourist_user.name;
                console.log("customer name", customerName);
                if (customerName) {
                    return customerName.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'customerType') {
                const customerType = record.tourist_user;
                if (customerType) {
                    return 'Tourist'.toLowerCase().includes(value.toLowerCase());
                } else {
                    return 'Local'.toLowerCase().includes(value.toLowerCase());
                }
            } else if (dataIndex == 'attractionName') {
                const attractionName = record.attraction;
                if (attractionName) {
                    return attractionName.name.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'status') {
                const status = record.status;
                if (status) {
                    return status.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'last_update') {
                const lastUpdate = record.last_update;
                if (lastUpdate) {
                    return lastUpdate.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'start_datetime') {
                const startDatetime = record.start_datetime;
                if (startDatetime) {
                    return startDatetime.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'end_datetime') {
                const endDatetime = record.end_datetime;
                if (endDatetime) {
                    return endDatetime.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            } else if (dataIndex == 'payment') {
                const payment = record.payment;
                if (payment) {
                    return payment.is_paid.toLowerCase().includes(value.toLowerCase());
                } else {
                    return false;
                }
            }
        },
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        },

        render: (text) =>{
            console.log("render text", text);
            console.log("render dataIndex", dataIndex);
            console.log("render searchedColumn", searchedColumn);
            return searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
            ) : (
              text
            );
        }
      });     
    
      
    const bookingsColumns = [
        {
            title: 'Id',
            dataIndex: 'booking_id',
            key: 'booking_id',
            width: 80,
            sorter: (a, b) => Number(a.booking_id) - Number(b.booking_id),
            // not displaying correctly due to text rendering issues too
            // ...getColumnSearchProps('booking_id'),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (text, record) => {
                const customerName = record.tourist_user
                    ? record.tourist_user.name
                    : record.local_user
                    ? record.local_user.name
                    : '';
        
                return customerName;
            },
            sorter: (a, b) => {
                const nameA = a.tourist_user ? a.tourist_user.name : a.local_user ? a.local_user.name : '';
                const nameB = b.tourist_user ? b.tourist_user.name : b.local_user ? b.local_user.name : '';
        
                return nameA.localeCompare(nameB);
            },
            // ...getColumnSearchProps('customerName')
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
                const getTypeValue = (record) => {
                    if (record.tourist_user) {
                        return 1; // Tourist
                    } else if (record.local_user) {
                        return 2; // Local
                    } else {
                        return 0; 
                    }
                };
        
                const typeA = getTypeValue(a);
                const typeB = getTypeValue(b);
        
                return typeA - typeB;
            },
            // ...getColumnSearchProps('customerType')
          },
        {
            title: 'Attraction',
            dataIndex: 'attractionName',
            key: 'attractionName',
            render: (text, record) => {
                console.log("text", text);
                console.log("record", record);
                return record.attraction.name;
            },
            sorter: (a, b) => {
                const nameA = (a.attraction && a.attraction.name) || ''; 
                const nameB = (b.attraction && b.attraction.name) || ''; 
        
                return nameA.localeCompare(nameB);
            },
            // ...getColumnSearchProps('record.attraction.name'),
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
            sorter: (a, b) => {
                const statusOrder = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
                const statusA = a.status || ''; 
                const statusB = b.status || ''; 
        
                return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
            },
            // formatting not preserved
            // ...getColumnSearchProps('status'),
        },
        {
            title: 'Last Updated',
            dataIndex: 'last_update',
            key: 'last_update',
            render: (lastUpdate) => {
                const dateObj = new Date(lastUpdate);
                const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.toLocaleTimeString()}`;
                return formattedDate;
            },
            sorter: (a, b) => {
                // Extract the underlying date values for 'a' and 'b'
                const dateA = new Date(a.last_update).getTime();
                const dateB = new Date(b.last_update).getTime();
        
                // Compare the date values for sorting
                return dateA - dateB;
            },
            // formatting not preserved
            // ...getColumnSearchProps('last_update'),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
            render: (startTime) => {
                return startTime ? new Date(startTime).toLocaleDateString() : '';
            },
            sorter: (a, b) => {
                // Extract the underlying date values for 'a' and 'b'
                const dateA = new Date(a.start_datetime).getTime();
                const dateB = new Date(b.start_datetime).getTime();
        
                // Compare the date values for sorting
                return dateA - dateB;
            },
            // formatting not preserved
            // ...getColumnSearchProps('start_datetime'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
            render: (endTime) => {
                return endTime ? new Date(endTime).toLocaleDateString() : '';
            },
            sorter: (a, b) => {
                // Extract the underlying date values for 'a' and 'b'
                const dateA = new Date(a.end_datetime).getTime();
                const dateB = new Date(b.end_datetime).getTime();
        
                // Compare the date values for sorting
                return dateA - dateB;
            },
            // formatting not preserved
            // ...getColumnSearchProps('end_datetime'),
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
            sorter: (a, b) => {
                const isPaidA = (a.payment && a.payment.is_paid) || false; 
                const isPaidB = (b.payment && b.payment.is_paid) || false; 
        
                return isPaidA - isPaidB;
            },
            // missing search
        },
        {
            title: 'Amount Earned',
            dataIndex: 'payment',
            key: 'payment',
            render: (payment) => {
                return `$${(payment.payment_amount * (1 - payment.comission_percentage)).toFixed(2)}`
            },
            sorter: (a, b) => {
                const amountA = a.payment.payment_amount * (1 - a.payment.comission_percentage);
                const amountB = b.payment.payment_amount * (1 - b.payment.comission_percentage);
        
                return amountA - amountB;
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
            <CustomHeader items={viewBookingBreadCrumb}/>
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