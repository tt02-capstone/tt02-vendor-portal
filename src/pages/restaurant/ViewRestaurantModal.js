import React, { useState, useEffect } from "react";
import { Modal, Tag, Badge, Carousel } from "antd";
import { getRestaurant } from "../../redux/restaurantRedux";

export default function ViewRestaurantModal(props) {
    const [selectedRestaurant, setSelectedRestaurant] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    async function getSelectedRestaurant(props) {
        try {
            let response = await getRestaurant(props.restId);
            setSelectedRestaurant(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve restaurant!');
        }
    }

    useEffect(() => {
    }, [selectedRestaurant])

    useEffect(() => {
        if (props.isViewRestaurantModalOpen) {
            getSelectedRestaurant(props);
        }
    }, [props.isViewRestaurantModalOpen]);


    function getPriceTierColor(priceTier) {
        switch (priceTier) {
            case 'TIER_0':
                return 'grey';
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

    function getType(type) {
        switch (type) {
            case 'FAST_FOOD':
                return 'purple';
            case 'CHINESE':
                return'volcano';
            case 'MEIXCAN':
                return 'magenta';
            case 'KOREAN':
                return 'geekblue';
            case 'WESTERN':
                return 'gold';
            case 'JAPANESE':
                return 'cyan';
            default:
                return 'default';
        }
    }

    function renderRestaurantImage(imageList) {
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
                          alt={`Restaurant ${index + 1}`}
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
                  alt="Restaurant"
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

        if (label === 'Suggested Duration') {
            formattedValue += ' Hours';
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Is Published' ? (
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
                title={selectedRestaurant.name}
                centered
                open={props.isViewRestaurantModalOpen}
                onCancel={props.onClickCancelViewRestaurantModal}
                footer={[]} 
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderRestaurantImage(selectedRestaurant.restaurant_image_list)}
                    {renderProperty('Description', selectedRestaurant.description)}
                    {renderProperty('Restaurant Type', selectedRestaurant.restaurant_type, getType(selectedRestaurant.restaurant_type))}
                    {renderProperty('Address', selectedRestaurant.address)}
                    {renderProperty('Area', selectedRestaurant.generic_location)}
                    {renderProperty('Opening Hours', selectedRestaurant.opening_hours)}
                    {renderProperty('Contact Number', selectedRestaurant.contact_num)}
                    {renderProperty('Is Published', selectedRestaurant.is_published ? "Yes" : "No")}
                    {renderProperty('Suggested Duration', selectedRestaurant.suggested_duration)}
                    {renderProperty('Price Tier', selectedRestaurant.estimated_price_tier, getPriceTierColor(selectedRestaurant.estimated_price_tier))}
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