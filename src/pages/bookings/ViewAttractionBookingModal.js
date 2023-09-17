import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Tag } from "antd";
import { getAttractionBookingByVendor } from "../../redux/bookingRedux";

export default function ViewAttractionBookingModal(props) {

    const { Option } = Select;
    const [selectedAttractionBooking, setSelectedAttractionBooking] = useState([]);
    // const [priceList, setPriceList] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getBooking(vendor, props) {
        try {
            console.log("vendor.vendor id ", vendor.vendor_id)
            console.log("props.bookingId ", props.bookingId)
            let response = await getAttractionBookingByVendor(vendor.vendor_id, props.bookingId);
            console.log("selectedAttractionBooking ", selectedAttractionBooking)
            setSelectedAttractionBooking(response.data);
            // setPriceList(response.data.price_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve booking!');
        }
    }

    useEffect(() => {
    }, [selectedAttractionBooking])

    useEffect(() => {
        if (props.isViewAttractionBookingModalOpen) {
            getBooking(vendor.vendor, props);
        }
    }, [props.isViewAttractionBookingModalOpen]);

    function getBookingStatusColor(bookingStatus) {
        switch (bookingStatus) {
            case 'UPCOMING':
                return 'processing';
            case 'ONGOING':
                return 'warning';
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
        }
    }

    function getAttractionCategoryColor(attractionCategory) {
        switch (attractionCategory) {
            case 'HISTORICAL':
                return 'purple';
            case 'CULTURAL':
                return 'volcano';
            case 'NATURE':
                return 'magenta';
            case 'ADVENTURE':
                return 'geekblue';
            case 'SHOPPING':
                return 'gold';
            case 'ENTERTAINMENT':
                return 'cyan';
        }
    }

    function getPaymentStatusColor(paymentStatus) {
        switch (paymentStatus) {
            case 'PAID':
                return 'success'; // Set to green for 'Paid'
            case 'UNPAID':
                return 'error';   // Set to red for 'Unpaid'
            default:
                return '';
        }
    }

    function formatDate(dateTime) {
        if (!dateTime) return '';
        const dateObj = new Date(dateTime);
        const formattedDate = dateObj.toLocaleDateString(); // Format the date as per the user's locale
        const formattedTime = dateObj.toLocaleTimeString(); // Format the time as per the user's locale
        return `${formattedDate} ${formattedTime}`;
    }

    // Helper function to format date
    function formatStartEndDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    }

    function renderCustomerName(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.name;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.name;
        } else {
            return '';
        }
    }

    function getCustomerType(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return 'Tourist';
        } else if (selectedBooking.local_user) {
            return 'Local';
        }
    }

    function getCustomerEmail(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.email;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.email;
        } else {
            return '';
        }
    }

    function getCustomerMobileNumber(selectedBooking) {
        if (selectedBooking.tourist_user) {
            return selectedBooking.tourist_user.mobile_num;
        } else if (selectedBooking.local_user) {
            return selectedBooking.local_user.mobile_num;
        } else {
            return '';
        }
    }

    function calculateVendorEarns(payment) {
        if (payment && payment.is_paid && payment.comission_percentage != null) {
            const amountVendorEarns = (payment.payment_amount * (1 - payment.comission_percentage));
            return `$${amountVendorEarns.toFixed(2)}`;
        } else {
            return '';
        }
    }


    function renderProperty(label, value, color) {

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {color ? (
                        <Tag color={color}>{value}</Tag>
                    ) : (
                        value
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Modal
                title={`Booking ID: ${selectedAttractionBooking.booking_id}`}
                centered
                open={props.isViewAttractionBookingModalOpen}
                onCancel={props.onClickCancelViewAttractionBookingModal}
                footer={[]} // hide default buttons of modal
            >

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Customer Name', renderCustomerName(selectedAttractionBooking))}
                    {renderProperty('Customer Type', getCustomerType(selectedAttractionBooking))}
                    {renderProperty('Customer Email', getCustomerEmail(selectedAttractionBooking))}
                    {renderProperty('Customer Number', getCustomerMobileNumber(selectedAttractionBooking))}
                    {renderProperty('Attraction Name', selectedAttractionBooking.attraction ? selectedAttractionBooking.attraction.name : '')}
                    {/* {renderProperty('Attraction Category', selectedAttractionBooking.attraction ? selectedAttractionBooking.attraction.attraction_category : '', getAttractionCategoryColor(selectedAttractionBooking.attraction.attraction_category))} */}
                    {renderProperty('Booking Status', selectedAttractionBooking.status, getBookingStatusColor(selectedAttractionBooking.status))}
                    {renderProperty('Last Updated', formatDate(selectedAttractionBooking.last_update))}
                    {renderProperty('Start Date', formatStartEndDate(selectedAttractionBooking.start_datetime))}
                    {renderProperty('End Date', formatStartEndDate(selectedAttractionBooking.end_datetime))}
                    {renderProperty('Payment Status', selectedAttractionBooking.payment ? (selectedAttractionBooking.payment.is_paid ? 'PAID' : 'UNPAID') : '', getPaymentStatusColor(selectedAttractionBooking.payment ? (selectedAttractionBooking.payment.is_paid ? 'PAID' : 'UNPAID') : ''))}
                    {renderProperty('Amount User Paid', selectedAttractionBooking.payment ? `$${selectedAttractionBooking.payment.payment_amount.toFixed(2)}` : '')}
                    {renderProperty('Amount Vendor Earns', calculateVendorEarns(selectedAttractionBooking.payment))}
                </div>
            </Modal>
        </div>
    )
}