import React, { useState, useEffect } from "react";
import {Form, Modal, Tag} from "antd";
import { getBookingById } from "../../redux/bookingRedux";
import moment from 'moment';

export default function ViewItemBookingModal(props) {

    const [selectedBooking, setSelectedBooking] = useState();


    useEffect(() => {
        if (props.openViewModal) {
            const fetchData = async (id) => {
                const response = await getBookingById(id);
                if (response.status) {
                    console.log(response.data);
                    let obj = {
                        ...response.data,
                        name: response.data.booked_user === 'LOCAL' ? response.data.local_user.name : response.data.tourist_user.name,
                        email: response.data.booked_user === 'LOCAL' ? response.data.local_user.email : response.data.tourist_user.email,
                        contact: response.data.booked_user === 'LOCAL' ? response.data.local_user.country_code + " " + response.data.local_user.mobile_num 
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
            case 'SHIPPED_OUT':
            case 'PREPARE_FOR_SHIPMENT':
            case 'DELIVERED':
            case 'PENDING_VENDOR_PICKUP':
            case 'PREPARE_FOR_PICKUP':
            case 'READY_FOR_PICKUP':
            case 'PENDING_VENDOR_DELIVERY':
            case 'UPCOMING':
                return 'processing';
            case 'ONGOING':
                return 'warning';
            case 'DELIVERED':
            case 'PICKED_UP':
            case 'COMPLETED':
                return 'success';
            case 'CANCELLED':
                return 'error';
        }
    }

    function getPaymentStatusColor(paymentStatus) {
        switch (paymentStatus) {
            case 'PAID':
                return 'success'; 
            case 'UNPAID':
                return 'error';  
            default:
                return '';
        }
    }

    function getCustomerType(text) {
        if (text === 'LOCAL') {
            return 'success';
        } else if (text === 'TOURIST') {
            return 'error';
        } else {
            return '';
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

    function renderBookingItems() {
        const bookingItems = selectedBooking.booking_item_list || [];
        
        // Create an array of formatted ticket descriptions
        const ticketDescriptions = bookingItems.map((bookingItem) => {
          return `${bookingItem?.activity_selection} (${bookingItem?.quantity} pax)`;
        });
        
        const tickets = ticketDescriptions.join(', ');
      
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', minWidth: '200px' }}>Tickets:</div>
            <div>{tickets}</div>
          </div>
        );
      }

    return (
        <div>
            {selectedBooking && <Modal
                title={'Booking Details (Item): ' + selectedBooking.item.name}
                centered
                open={props.openViewModal}
                onCancel={props.onClickCancelViewItemBookingModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Customer Name', selectedBooking.name)}
                    {renderProperty('Customer Email', selectedBooking.email)}
                    {renderProperty('Customer Type', selectedBooking.booked_user === 'LOCAL' ? 'Local' : 'Tourist', getCustomerType(selectedBooking.booked_user))}
                    {renderProperty('Customer Contact', selectedBooking.contact)}
                    {renderProperty('Booking Status', selectedBooking.status, getBookingStatusColor(selectedBooking.status))}
                    {renderProperty('Last Updated', selectedBooking.last_update)}
                    {renderProperty('Start Date', selectedBooking.start_datetime)}
                    {renderProperty('End Date', selectedBooking.end_datetime)}
                    {/*{renderBookingItems()}*/}
                    {renderProperty('Payment Status', selectedBooking.payment.is_paid ? "Paid" : "Unpaid", getPaymentStatusColor(selectedBooking.payment.is_paid))}
                    {renderProperty('Amount Earned', selectedBooking.payment_amount)}
                </div>
            </Modal >}
        </div >
    )
}