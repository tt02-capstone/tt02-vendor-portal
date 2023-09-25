import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel } from "antd";
import { getAccommodationByVendor } from "../../redux/accommodationRedux";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function ViewAccommodationModal(props) {

    const [selectedAccommodation, setSelectedAccommodation] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getAccommodation(vendor, props) {
        try {
            let response = await getAccommodationByVendor(vendor.user_id, props.accommodationId);
            console.log("vendor.user_id", vendor.user_id);
            setSelectedAccommodation(response.data);
            setRoomList(response.data.room_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve accommodation!');
        }
    }

    useEffect(() => {
    }, [selectedAccommodation, roomList])

    useEffect(() => {
        if (props.isViewAccommodationModalOpen) {
            getAccommodation(vendor, props);
        }
    }, [props.isViewAccommodationModalOpen]);

    const formattedRoomList = roomList.map((item, index) => {
        const itemStyle = {
            margin: 0,
            padding: 0,
        };

        return (
            <div>room</div>
            // need to edit
            // <p key={index} style={index === 0 ? { marginTop: 0 } : itemStyle}>
            //     {index === 0 ? null : <br />}
            //     <span>{item.ticket_type}</span><br />
            //     <span>Local Price: $</span> {item.local_amount}<br />
            //     <span>Tourist Price: $</span> {item.tourist_amount}
            // </p>
        );
    });

    function getPriceTierColor(priceTier) {
        switch (priceTier) {
            case 'TIER_1':
                return 'green';
            case 'TIER_2':
                return 'orange';
            case 'TIER_3':
                return 'red';
            case 'TIER_4':
                return 'blue';
            case 'TIER_5':
                return 'yellow';
            default:
                return 'default';
        }
    }

    function getTypeColor(type) {
        switch (type) {
            case 'HOTEL':
                return 'purple';
            case 'AIRBNB':
                return 'volcano';
            default:
                return 'default';
        }
    }

    function renderAccommodationImage(imageList) {
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
                          alt={`Accommodation ${index + 1}`}
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
                  alt="Accommodation"
                  style={{ maxWidth: '400px', maxHeight: '300px', width: '100%', height: 'auto' }}
                />
              </div>
            );
          }
        }
        return 'No Image';
      }


    function renderProperty(label, value, color) {

        let formattedValue;

        if (typeof value === 'string' && value.includes('_')) {
            formattedValue = value.split('_').join(' ');
        } else if (typeof value === 'string' && label === 'Contact Number') {
            formattedValue = value.replace(/(\d{4})(\d{4})/, '$1 $2');
        } else if (typeof value === 'string' && label === 'Area') {
            formattedValue = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        } else {
            formattedValue = value;
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Is Published?' ? (
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
                title={selectedAccommodation.name}
                centered
                open={props.isViewAccommodationModalOpen}
                onCancel={props.onClickCancelViewAccommodationModal}
                footer={[]} // hide default buttons of modal
            >

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderAccommodationImage(selectedAccommodation.accommodation_image_list)}
                    {renderProperty('Description', selectedAccommodation.description)}
                    {renderProperty('Category', selectedAccommodation.type, getTypeColor(selectedAccommodation.type))}
                    {renderProperty('Address', selectedAccommodation.address)}
                    {renderProperty('Area', selectedAccommodation.generic_location)}
                    {renderProperty('Contact Number', selectedAccommodation.contact_num)}
                    {renderProperty('Is Published?', selectedAccommodation.is_published ? "Yes" : "No")}
                    {renderProperty('Check In Time', selectedAccommodation.check_in_time)}
                    {renderProperty('Check Out Time', selectedAccommodation.check_out_time)}
                    {renderProperty('Price Tier', selectedAccommodation.estimated_price_tier, getPriceTierColor(selectedAccommodation.estimated_price_tier))}
                    {renderProperty('Rooms', formattedRoomList)}
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