import React, { useState, useEffect } from "react";
import { Modal, Tag, Badge, Carousel } from "antd";
import { getTourTypeByTourTypeId, getAttractionForTourTypeId } from "../../redux/tourRedux";

export default function ViewTourTypeModal(props) {

    const [selectedTourType, setSelectedTourType] = useState([]);
    const [selectedAttraction, setSelectedAttraction] = useState('');
    // const local = JSON.parse(localStorage.getItem("user"));

    async function getTourType(props) {
        try {
            let response = await getTourTypeByTourTypeId(props.tourTypeId);
            setSelectedTourType(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour type!');
        }
    }

    async function getAttraction(props) {
        try {
            let response = await getAttractionForTourTypeId(props.tourTypeId);
            setSelectedAttraction(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
    }, [selectedTourType])

    useEffect(() => {
        if (props.isViewTourTypeModalOpen) {
            getTourType(props);
            getAttraction(props);
        }
    }, [props.isViewTourTypeModalOpen]);

    function renderTourTypeImage(imageList) {
        if (Array.isArray(imageList) && imageList.length > 0) {
            // Render a Carousel of images if there are multiple images
            if (imageList.length > 1) {
                return (
                    <div style={styles.carousel}>
                        <Carousel autoplay arrows>
                            {imageList.map((imageUrl, index) => (
                                <div key={index}>
                                    <div style={styles.container}>
                                        <img
                                            src={imageUrl}
                                            alt={`Tour Type ${index + 1}`}
                                            style={styles.image}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                );
            } else {
                // Display a single image if there is only one in the list
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '35px' }}>
                        <img
                            src={imageList[0]}
                            alt="Tour"
                            style={{ maxWidth: '400px', maxHeight: '300px', width: '100%', height: 'auto' }}
                        />
                    </div>
                );
            }
        }
        return 'No Image';
    }


    function renderProperty(label, value, color) {

        let formattedValue = value;

        if (label === 'Price per Pax') {
            formattedValue = '$' + formattedValue;
        }

        if (label === 'Est. Duration') {
            formattedValue += ' Hours';
        }

        if (label === 'Special Notes' && value == null) {
            formattedValue = '-';
        }

        if (label === 'Published') {
            console.log('gab', formattedValue);
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Published' ? (
                        <Badge status={value ? 'success' : 'error'} text={value ? 'Yes' : 'No'} />
                    ) : (
                        color ? (
                            <Tag color={color}>{formattedValue}</Tag>
                        ) : (
                            formattedValue
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Modal
                title={selectedTourType.name}
                centered
                open={props.isViewTourTypeModalOpen}
                onCancel={props.onClickCancelViewTourTypeModal}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderTourTypeImage(selectedTourType.tour_image_list)}
                    {renderProperty('Attraction', selectedAttraction.name)}
                    {renderProperty('Description', selectedTourType.description)}
                    {renderProperty('Price per Pax', selectedTourType.price)}
                    {renderProperty('No. of Pax', selectedTourType.recommended_pax)}
                    {renderProperty('Est. Duration', selectedTourType.estimated_duration)}
                    {renderProperty('Special Notes', selectedTourType.special_note)}
                    {renderProperty('Published', selectedTourType.is_published)}
                    {selectedTourType.publishedUpdatedBy === 'INTERNAL_STAFF' && !selectedTourType.is_published && (
                        <div style={{ color: 'red', marginTop: '5px' }}>
                            Your tour was unpublished by an admin staff, contact us for more information.
                        </div>
                    )}
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