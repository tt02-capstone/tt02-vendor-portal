import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel } from "antd";
import { getAttractionByVendor } from "../../redux/attractionRedux";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export default function ViewAttractionModal(props) {

    const [selectedAttraction, setSelectedAttraction] = useState([]);
    const [priceList, setPriceList] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getAttraction(vendor, props) {
        try {
            let response = await getAttractionByVendor(vendor.user_id, props.attractionId);
            console.log("vendor.user_id", vendor.user_id);
            setSelectedAttraction(response.data);
            setPriceList(response.data.price_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
    }, [selectedAttraction, priceList])

    useEffect(() => {
        if (props.isViewAttractionModalOpen) {
            getAttraction(vendor, props);
        }
    }, [props.isViewAttractionModalOpen]);

    const formattedPriceList = priceList.map((item, index) => {
        const itemStyle = {
            margin: 0,
            padding: 0,
        };

        return (
            <p key={index} style={index === 0 ? { marginTop: 0 } : itemStyle}>
                {index === 0 ? null : <br />}
                <span>{item.ticket_type}</span><br />
                <span>Local Price: $</span> {item.local_amount}<br />
                <span>Tourist Price: $</span> {item.tourist_amount}
            </p>
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

    function getCategoryColor(attractionCategory) {
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
            default:
                return 'default';
        }
    }

    function renderAttractionImage(imageList) {
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

        let formattedValue = typeof value === 'string' && value.includes('_')
            ? value.split('_').join(' ')
            : typeof value === 'string' && label === 'Contact Number'
                ? value.replace(/(\d{4})(\d{4})/, '$1 $2')
                : typeof value === 'string' && label === 'Area'
                    ? value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                    : label === 'Avg Rating' && value === 0
                        ? 'N/A'
                        : value;

        if (label === 'Suggested Duration') {
            formattedValue += ' Hours';
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
                title={selectedAttraction.name}
                centered
                open={props.isViewAttractionModalOpen}
                onCancel={props.onClickCancelViewAttractionModal}
                footer={[]} // hide default buttons of modal
            >
                {/* seasonalactivity, reviewlist, tourtypelist */}

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderAttractionImage(selectedAttraction.attraction_image_list)}
                    {renderProperty('Description', selectedAttraction.description)}
                    {renderProperty('Category', selectedAttraction.attraction_category, getCategoryColor(selectedAttraction.attraction_category))}
                    {renderProperty('Address', selectedAttraction.address)}
                    {renderProperty('Area', selectedAttraction.generic_location)}
                    {renderProperty('Opening Hours', selectedAttraction.opening_hours)}
                    {renderProperty('Age Group', selectedAttraction.age_group)}
                    {renderProperty('Contact Number', selectedAttraction.contact_num)}
                    {renderProperty('Is Published?', selectedAttraction.is_published ? "Yes" : "No")}
                    {renderProperty('Suggested Duration', selectedAttraction.suggested_duration)}
                    {renderProperty('Avg Rating', selectedAttraction.avg_rating_tier)}
                    {renderProperty('Price Tier', selectedAttraction.estimated_price_tier, getPriceTierColor(selectedAttraction.estimated_price_tier))}
                    {renderProperty('Pricing', formattedPriceList)}
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