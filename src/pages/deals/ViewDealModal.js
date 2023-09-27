import React, { useState, useEffect } from "react";
import { Modal, Select, Tag, Badge, Carousel, Spin } from "antd";
import { getDealById } from "../../redux/dealRedux";

export default function ViewDealModal(props) {

    const [deal, setDeal] = useState();

    useEffect(() => {
        if (props.selectedDealId) {
            const fetchData = async (id) => {
                const response = await getDealById(id);
                if (response.status) {
                    setDeal(response.data);
                    
                } else {
                    console.log("Deal not fetched!");
                }
            }
            console.log('fetch');
            fetchData(props.selectedDealId);
        }
    }, [props.selectedDealId]);

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

    function renderProperty(label, value, color) {

        let formattedValue = value;

        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', minWidth: '160px' }}>{label}:</div>
                <div>
                    {label === 'Published' && value === true && <Badge status="success" text="Yes" />}
                    {label === 'Published' && value === false && <Badge status="error" text="No" />}
                    {color ? <Tag color={color}>{formattedValue}</Tag> : formattedValue}
                </div>
            </div>
        );
    }

    return (
        <div>
            {deal &&
            <Modal
                title={deal.name}
                centered
                open={props.viewDealModal}
                onCancel={props.onCancelViewModal}
                footer={[]} // hide default buttons of modal
            >
                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
                    {renderProperty('Description', deal.description)}
                    {renderProperty('Published', deal.is_published )}
                    {renderProperty('Price', deal.price)}
                    {renderProperty('Price Tier', getPriceTierCount(deal.estimated_price_tier))}
                    {renderProperty('Duration', deal.num_of_days_valid)}
                    {renderProperty('Duration Category', deal.plan_duration_category, getValidityColor(deal.plan_duration_category))}
                    {renderProperty('Data Limit', deal.data_limit)}
                    {renderProperty('Data Limit Category', deal.data_limit_category, getDataLimitColor(deal.data_limit_category))}
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