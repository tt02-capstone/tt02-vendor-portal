import React, { useState, useEffect } from "react";
import { Modal, Tag, Badge } from "antd";
import { getRestaurantDish } from "../../redux/restaurantRedux";
import CustomTablePagination from "../../components/CustomTablePagination";

export default function ViewAllDishModal(props) {
    const [selectedRestaurantDish, setSelectedRestaurantDish] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    async function getSelectedRestaurant(props) {
        try {
            let response = await getRestaurantDish(props.restId);
            setSelectedRestaurantDish(response.data);
            console.log(response.data)
        } catch (error) {
            alert('An error occurred! Failed to retrieve restaurant dish!');
        }
    }

    useEffect(() => {
    }, [selectedRestaurantDish])

    useEffect(() => {
        if (props.isViewAllDishModalOpen) {
            getSelectedRestaurant(props);
        }
    }, [props.isViewAllDishModalOpen]);

    const datasource = Array.isArray(selectedRestaurantDish) ? selectedRestaurantDish.map((item, index) => {
        const formattedPrice = '$ ' + item.price 

        return {
            key: index,
            name: item.name,
            price: formattedPrice,
            spicy: item.spicy,
            is_signature: item.is_signature, 
            dish_type: item.dish_type
        };
    }) : [] ;

    const columns = [
        {
            title: 'Dish Name',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 100,
        },
        {
            title: 'Spicy',
            dataIndex: 'spicy',
            key: 'spicy',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 100
        },
        {
            title: 'Signature',
            dataIndex: 'is_signature',
            key: 'is_signature',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 100
        },
        {
            title: 'Type',
            dataIndex: 'dish_type',
            key: 'dish_type',
            render: (type) => {
                let tagColor = 'default'; 
                switch (type) {
                    case 'MAINS':
                        tagColor = 'purple';
                        break;
                    case 'BEVERAGE':
                        tagColor = 'volcano';
                        break;
                    case 'SIDES':
                        tagColor = 'magenta';
                        break;
                    case 'DESSERT':
                        tagColor = 'geekblue';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{type}</Tag>
                );
            }, 
            width:150
        },
    ]

    return (
        <div>
            <Modal
                title="View All Dish(s)"
                centered
                open={props.isViewAllDishModalOpen}
                onCancel={props.onClickCancelViewAllDish}
                footer={[]}
                style={{
                    height: 500,
                }}
                width={800} 
            >
                <CustomTablePagination data={datasource} column={columns} tableLayout="fixed" style={{marginBottom: "-10px", marginTop:"20px"}}  />
            </Modal>
        </div>
    )
}