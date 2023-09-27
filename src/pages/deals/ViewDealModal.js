import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel, Spin } from "antd";
import { getDealById } from "../../redux/dealRedux";
import moment from "moment";

export default function ViewDealModal(props) {

    const [selectedDeal, setSelectedDeal] = useState([]);

    useEffect(() => {
        if (props.selectedDealId) {
            const fetchData = async (id) => {
                const response = await getDealById(id);
                if (response.status) {
                    setSelectedDeal(response.data);

                } else {
                    console.log("Deal not fetched!");
                }
            }
            console.log('fetch');
            fetchData(props.selectedDealId);
        }
    }, [props.selectedDealId]);

    function renderDealImage(imageList) {
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
                                            alt={`Attraction ${index + 1}`}
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
                            alt="Attraction"
                            style={{ maxWidth: '400px', maxHeight: '300px', width: '100%', height: 'auto' }}
                        />
                    </div>
                );
            }
        }
        return 'No Image';
    }

    function renderProperty(label, value, color) {

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>{label}:</div>
                <div>
                    {label === 'Is Published?' || label === 'Is Government Voucher?' ? (
                        <Badge status={value ? 'success' : 'error'} text={value ? 'Yes' : 'No'} />
                    ) : (
                        color ? (
                            <Tag color={color}>{value}</Tag>
                        ) : (
                            value
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <Modal
                title="View Deal"
                centered
                open={props.viewDealModal}
                onCancel={props.onCancelViewModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderDealImage(selectedDeal.deal_image_list)}
                    {renderProperty('Promo Code', selectedDeal.promo_code)}
                    {renderProperty('Deal Type', selectedDeal.deal_type, 'blue')}
                    {renderProperty('Discount Percentage', selectedDeal.discount_percent + '%', 'green')}
                    {renderProperty('Start DateTime', moment(selectedDeal.start_datetime).format('llll'))}
                    {renderProperty('End Day Time Group', moment(selectedDeal.end_datetime).format('llll'))}
                    {renderProperty('Is Government Voucher?', selectedDeal.is_govt_voucher ? "Yes" : "No")}
                    {renderProperty('Is Published?', selectedDeal.is_published ? "Yes" : "No")}
                    {renderProperty('Publish Date', moment(selectedDeal.publish_date).format('ll'))}

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