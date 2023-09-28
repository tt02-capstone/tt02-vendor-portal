import React, { useState, useEffect } from "react";
import { Modal, Tag, Badge, Carousel } from "antd";
import { getTourByTourId } from "../../redux/tourRedux";
import moment from 'moment';

export default function ViewTourModal(props) {

    const [selectedTour, setSelectedTour] = useState([]);
    const local = JSON.parse(localStorage.getItem("user"));

    async function getTour(props) {
        try {
            let response = await getTourByTourId(props.tourId);
            setSelectedTour(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour!');
        }
    }

    useEffect(() => {
    }, [selectedTour])

    useEffect(() => {
        if (props.isViewTourModalOpen) {
            getTour(props);
        }
    }, [props.isViewTourModalOpen]);

    function renderProperty(label, value, color) {
        let formattedValue = value;
        if (label === 'Start Time' || label === 'End Time') {
            formattedValue = moment(value).format('h.mm a');
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {formattedValue}
                </div>
            </div>
        );
    }

    const calculateDuration = (start, end) => {
        const startTime = new Date(Date.parse(start));
        const endTime = new Date(Date.parse(end));
        const timeDifference = Math.abs(endTime - startTime);
        const hours = Math.floor(timeDifference / 3600000); 
        const minutes = Math.floor((timeDifference % 3600000) / 60000); 
        
        if (hours < 1) {
            return `${minutes} minutes`;
        } else if (hours == 1) {
            return `${hours} hour ${minutes} minutes`;
        } else {
            return `${hours} hours ${minutes} minutes`;
        }
    };

    return (
        <div>
            <Modal
                title={moment(selectedTour.date).format('DD MMM YYYY')}
                centered
                open={props.isViewTourModalOpen}
                onCancel={props.onClickCancelViewTourModal}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Start Time', selectedTour.start_time)}
                    {renderProperty('End Time', selectedTour.end_time)}
                    {renderProperty('Duration', calculateDuration(selectedTour.start_time, selectedTour.end_time))}
                </div>
            </Modal>
        </div>
    )
}

const styles = {
    carousel: {
        backgroundColor: 'white',
        paddingBottom: '50px',
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignContent: 'center',
        height: '300px',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: '100%',
        objectFit: 'cover',
    },
};