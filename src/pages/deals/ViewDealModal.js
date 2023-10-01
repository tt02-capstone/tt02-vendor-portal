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
                    console.log(response.data)
                    setSelectedDeal(response.data);

                } else {
                    console.log("Deal not fetched!");
                }
            }
            console.log('fetch');
            fetchData(props.selectedDealId);
        }
    }, [props.selectedDealId, props.viewDealModal]);

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


    function getDealTypeColour(type) {
        switch (type) {
            case 'CHINESE_NEW_YEAR':
                return "green"
            case 'NATIONAL_DAY':
                return 'cyan';
            case 'DEEPAVALLI':
                return 'blue';
            case 'NUS_WELLBEING_DAY':
                return 'geekblue';
            case 'SINGLES_DAY':
                return 'purple';
            case 'VALENTINES':
                return "pink"
            case 'HARI_RAYA':
                return 'yellow';
            case 'NEW_YEAR_DAY':
                return 'volcano';
            case 'BLACK_FRIDAY':
                return 'lime';
            case 'CHRISTMAS':
                return 'gold';
            case 'GOVERNMENT':
                return 'orange';
            default:
                return 'default';
        }
    }
    function renderProperty(label, value, color) {

        let formattedValue = typeof value === 'string' && value.includes('_') && label !== 'Promo Code'
            ? value.split('_').join(' ')
            : typeof value === 'string' && label === 'Contact Number'
                ? value.replace(/(\d{4})(\d{4})/, '$1 $2')
                : typeof value === 'string' && label === 'Area'
                    ? value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                    : label === 'Avg Rating' && value === 0
                        ? 'N/A'
                        : value;
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '200px' }}>{label}:</div>
                <div>
                    {label === 'Is Published?' || label === 'Is Government Voucher?' ? (
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
                title="View Deal"
                centered
                open={props.viewDealModal}
                onCancel={props.onCancelViewModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderDealImage(selectedDeal.deal_image_list)}
                    {renderProperty('Promo Code', selectedDeal.promo_code)}
                    {renderProperty('Deal Type', selectedDeal.deal_type, getDealTypeColour(selectedDeal.deal_type))}
                    {renderProperty('Discount Percentage', selectedDeal.discount_percent + '%', 'green')}
                    {renderProperty('Start DateTime', moment(selectedDeal.start_datetime).format('llll'))}
                    {renderProperty('End Day Time Group', moment(selectedDeal.end_datetime).format('llll'))}
                    {renderProperty('Is Government Voucher?', selectedDeal.is_govt_voucher)}
                    {renderProperty('Is Published?', selectedDeal.is_published)}
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