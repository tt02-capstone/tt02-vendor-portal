import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel, Spin } from "antd";
import { getTelecomById } from "../../redux/telecomRedux";

export default function ViewTelecomModal(props) {

    const [telecom, setTelecom] = useState();

    useEffect(() => {
        if (props.selectedTelecomId) {
            const fetchData = async (id) => {
                const response = await getTelecomById(id);
                if (response.status) {
                    setTelecom(response.data);
                    
                } else {
                    console.log("Telecom not fetched!");
                }
            }
            console.log('fetch');
            fetchData(props.selectedTelecomId);
        }
    }, [props.selectedTelecomId]);

    function getTypeColor(type) {
        switch (type) {
            case 'PHYSICALSIM':
                return 'magenta';
            case 'ESIM':
                return 'cyan';
            default:
                return 'default';
        }
    }

    function getPriceTierCount(count) {
        switch (count) {
            case 'TIER_1':
                return '$';
            case 'TIER_2':
                return '$$';
            case 'TIER_3':
                return '$$$';
            case 'TIER_4':
                return '$$$$';
            case 'TIER_5':
                return '$$$$$';
            default:
                return 'Bug';
        }
    }

    function getValidityColor(type) {
        switch (type) {
            case 'ONE_DAY':
                return 'green';
            case 'THREE_DAY':
                return 'cyan';
            case 'SEVEN_DAY':
                return 'blue';
            case 'FOURTEEN_DAY':
                return 'geekblue';
            case 'MORE_THAN_FOURTEEN_DAYS':
                return 'purple';
            default:
                return 'default';
        }
    }

    function getDataLimitColor(type) {
        switch (type) {
            case 'VALUE_10':
                return 'magenta';
            case 'VALUE_30':
                return 'red';
            case 'VALUE_50':
                return 'volcano';
            case 'VALUE_100':
                return 'orange';
            case 'UNLIMITED':
                return 'gold';
            default:
                return 'default';
        }
    }

    function formatDurationCategory(text) {
        if (text === 'ONE_DAY') {
            return '1 day';
        } else if (text === 'THREE_DAY') {
            return 'Bet 2 and 3 days';
        } else if (text === 'SEVEN_DAY') {
            return 'Bet 4 and 7 days';
        } else if (text === 'FOURTEEN_DAY') {
            return 'Bet 8 and 14 days';
        } else {
            return 'More than 14 days';
        }
    }

    function formatDataLimitText(text) {
        if (text === 'VALUE_10') {
            return '10GB and less';
        } else if (text === 'VALUE_30') {
            return 'Bet 10GB and 30GB';
        } else if (text === 'VALUE_50') {
            return 'Bet 30GB and 50GB';
        } else if (text === 'VALUE_100') {
            return 'Bet 50GB and 100GB';
        } else {
            return 'Beyond 100GB';
        }
    }

    function renderProperty(label, value, color) {

        let formattedValue = value;

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Price' && '$' + formattedValue}
                    {label === 'Duration' && formattedValue + ' day(s)'}
                    {label === 'Data Limit' && formattedValue + 'GB'}
                    {label === 'Published' && value === true && <Badge status="success" text="Yes" />}
                    {label === 'Published' && value === false && <Badge status="error" text="No" />}
                    {color ? <Tag color={color}>{formattedValue}</Tag> : (label === 'Description' || label === 'Price Tier') && formattedValue}
                </div>
            </div>
        );
    }

    return (
        <div>
            {telecom &&
            <Modal
                title={telecom.name}
                centered
                open={props.viewTelecomModal}
                onCancel={props.onCancelViewModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Description', telecom.description)}
                    {renderProperty('Published', telecom.is_published )}
                    {renderProperty('Price', telecom.price)}
                    {renderProperty('Price Tier', getPriceTierCount(telecom.estimated_price_tier))}
                    {renderProperty('Duration', telecom.num_of_days_valid)}
                    {renderProperty('Duration Category', formatDurationCategory(telecom.plan_duration_category), getValidityColor(telecom.plan_duration_category))}
                    {renderProperty('Data Limit', telecom.data_limit)}
                    {renderProperty('Data Limit Category', formatDataLimitText(telecom.data_limit_category), getDataLimitColor(telecom.data_limit_category))}
                </div>
            </Modal>}
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