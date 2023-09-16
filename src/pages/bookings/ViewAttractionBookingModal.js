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
            let response = await getAttractionBookingByVendor(vendor.vendor_id, props.bookingId);
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

    // STOPPED HERE. TO EDIT
    function renderProperty(label, value, color) {

        // const formattedValue = typeof value === 'string' && value.includes('_')
        // ? value.split('_').join(' ')
        // : typeof value === 'string' && label === 'Contact Number'
        // ? value.replace(/(\d{4})(\d{4})/, '$1 $2')
        // : typeof value === 'string' && label === 'Location Area'
        // ? value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        // : label === 'Average Rating' && value === 0
        // ? 'N/A'
        // : value;

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
                title={selectedAttractionBooking.booking_id}
                centered
                open={props.isViewAttractionBookingModalOpen}
                onCancel={props.onClickCancelViewAttractionBookingModal}
                footer={[]} // hide default buttons of modal
            >
                {/* img list */}
                {/* seasonalactivity, reviewlist, tourtypelist */}

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Booking ID', selectedAttractionBooking.booking_id)}
                    {/* tourist/local and attraction */}
                    {renderProperty('Booking Status', selectedAttractionBooking.status, getBookingStatusColor(selectedAttractionBooking.status))}
                    {renderProperty('Last Updated', selectedAttractionBooking.last_update)}
                    {renderProperty('Start Time', selectedAttractionBooking.start_datetime)}
                    {renderProperty('End Time', selectedAttractionBooking.end_datetime)}
                    {/* payment status */}
                </div>
            </Modal>
        </div>
    )
}