import React, { useState, useEffect } from "react";
import { Modal, Tag } from "antd";
import { getBookingByBookingId } from "../../redux/tourRedux";
import moment from 'moment';

export default function ViewTourBookingModal(props) {

    const [selectedBooking, setSelectedBooking] = useState();

    useEffect(() => {
        if (props.openViewModal) {
            const fetchData = async (id) => {
                const response = await getBookingByBookingId(id);
                if (response.status) {
                    console.log(response.data);
                    let obj = {
                        ...response.data,
                        name: response.data.local_user != null ? response.data.local_user.name : response.data.tourist_user.name,
                        email: response.data.local_user != null ? response.data.local_user.email : response.data.tourist_user.email,
                        contact: response.data.local_user != null ? response.data.local_user.country_code + " " + response.data.local_user.mobile_num 
                        :  response.data.tourist_user.country_code + " " + response.data.tourist_user.mobile_num,
                        last_update: moment(response.data.last_update).format('llll'),
                        start_datetime: moment(response.data.start_datetime).format('ll'),
                        end_datetime: moment(response.data.end_datetime).format('ll'),
                        payment_amount: `$${(response.data.payment.payment_amount * (1 - response.data.payment.comission_percentage)).toFixed(2)}`,
                    }
                    setSelectedBooking(obj);
                } else {
                    console.log("Booking not fetched!");
                }
            }

            fetchData(props.id);
        }
    }, [props.openViewModal]);

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

    function getPaymentStatusColor(paymentStatus) {
        switch (paymentStatus) {
            case true:
                return 'success'; 
            case false:
                return 'error';  
            default:
                return '';
        }
    }

    function getCustomerType(text, localUser) {
        if (localUser) {
            return <Tag color="success">LOCAL</Tag>;
        } else {
            return <Tag color="error">TOURIST</Tag>;
        } 
    }

    function renderProperty(label, value, color) {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>{label}:</div>
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

    function formatStartEndDate(date) {
        if (!date) return '';
        return new Date(date).toLocaleDateString();
    }

    function formatDate(dateTime) {
        if (!dateTime) return '';
        const dateObj = new Date(dateTime);
        const formattedDate = dateObj.toLocaleDateString(); 
        const formattedTime = dateObj.toLocaleTimeString(); 
        return `${formattedDate} ${formattedTime}`;
    }

    function formatTime(time) {
        return moment(time).format('h.mm a')
    }

    return (
        <div>
            {selectedBooking && <Modal
                title={"Booking Details (Tour): " + selectedBooking.activity_name}
                centered
                open={props.openViewModal}
                onCancel={props.onClickCancelViewTourBookingModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Customer Name', selectedBooking.name)}
                    {renderProperty('Customer Email', selectedBooking.email)}
                    {renderProperty('Customer Type', getCustomerType(selectedBooking.booked_user, selectedBooking.local_user))}
                    {renderProperty('Customer Contact', selectedBooking.contact)}
                    {renderProperty('Booking Status', selectedBooking.status, getBookingStatusColor(selectedBooking.status))}
                    {renderProperty('Last Updated', formatDate(selectedBooking.last_update))}
                    {renderProperty('Date', formatStartEndDate(selectedBooking.tour.date))}
                    {renderProperty('Start Time', formatTime(selectedBooking.tour.start_time))}
                    {renderProperty('End Time', formatTime(selectedBooking.tour.end_time))}
                    {renderProperty('Payment Status', selectedBooking.payment.is_paid ? "PAID" : "UNPAID", getPaymentStatusColor(selectedBooking.payment.is_paid))}
                    {renderProperty('Amount Earned', selectedBooking.payment_amount)}
                </div>
            </Modal >}
        </div >
    )
}