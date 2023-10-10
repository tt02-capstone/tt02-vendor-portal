import React, { useState, useEffect, useRef } from "react";
import { Modal, Tag, Badge, Layout , Input, Space, Button} from "antd";
import { Content } from "antd/es/layout/layout";
import CustomHeader from "../../components/CustomHeader";
import { getRestaurantDish , deleteDish, addDish, updateDish } from "../../redux/restaurantRedux";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import CustomButton from "../../components/CustomButton";
import { useLocation, Navigate } from "react-router-dom"; 
import { PlusOutlined } from "@ant-design/icons";
import AddDishModal from "./AddDishModal";
import EditDishModal from "./EditDishModal";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function DishManagement() {
    const location = useLocation();
    const restId  = location.state.restId; // get from restaurant main page 
    const [selectedRestaurantDish, setSelectedRestaurantDish] = useState([]); // the list of dish in this restaurant 
    const [selectedDishId, setSelectedDishId] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    const dishBreadCrumb = [
        {
          title: 'Restaurants',
          to: '/restaurant'
        },
        {
            title: 'Manage Menu',
        },
    ];
 

    async function getSelectedRestaurant() {
        try {
            let response = await getRestaurantDish(restId);
            setSelectedRestaurantDish(response.data);
            console.log(response.data)
        } catch (error) {
            alert('An error occurred! Failed to retrieve restaurant dish!');
        }
    }

    async function deleteD(selectedDish) {
        try {
            let response = await deleteDish(restId,selectedDish);
            setSelectedRestaurantDish(response.data);
            console.log(response.data)
            toast.success('Dish successfully removed!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        } catch (error) {
            alert('An error occurred! Failed to delete dish!');
        }
    }

    useEffect(() => {
        getSelectedRestaurant();
    }, [])

    // table filters 
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const datasource = Array.isArray(selectedRestaurantDish) ? selectedRestaurantDish.map((item, index) => {
        const formattedPrice = '$ ' + item.price 

        return {
            dish_id: item.dish_id,
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
            title: 'Menu Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
            width: 150,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price.localeCompare(b.price),
            ...getColumnSearchProps('price'),
            width: 100,
        },
        {
            title: 'Spicy',
            dataIndex: 'spicy',
            key: 'spicy',
            sorter: (a, b) => String(a.spicy).localeCompare(String(b.spicy)),
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
            sorter: (a, b) => String(a.is_signature).localeCompare(String(b.is_signature)),
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
            title: 'Menu Type',
            dataIndex: 'dish_type',
            key: 'dish_type',
            filters: [
                {
                    text: 'Mains',
                    value: 'MAINS',
                },
                {
                    text: 'Beverage',
                    value: 'BEVERAGE',
                },
                {
                    text: 'Sides',
                    value: 'SIDES',
                },
                {
                    text: 'Dessert',
                    value: 'DESSERT',
                }
            ],
            onFilter: (value, record) => record.dish_type.indexOf(value) === 0,
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
            width:100
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <CustomButton
                        text="Delete Dish"
                        style ={{ fontSize : 13, fontWeight: "bold"}}
                        onClick={() => deleteD(record.dish_id)}
                    />
                    <br/><br/>
                    <CustomButton
                        text="Edit Dish"
                        style ={{ fontSize : 13, fontWeight: "bold"}}
                        onClick={() => editDish(record.dish_id)}
                    />
                </div>
            },
            width: 100,
        }
    ]

    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);

    const showAddModal = () => {
        setAddModal(true);
    };

    const addModalCancel = () => {
        setAddModal(false);
    };

    const addModalSubmit = async (values) => {
        const requestBody = {
            name: values.name, 
            price: values.price, 
            spicy: values.spicy, 
            is_signature: values.is_signature,
            dish_type: values.dish_type
        }

        try {
            let createDish = await addDish(restId,requestBody)
            setSelectedRestaurantDish(createDish.data)
            setAddModal(false); 
            toast.success('Dish Added!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        } catch (error) {
            alert('An error occurred! Failed to add dish!');
        }
    };

    const showEditModal = () => {
        setEditModal(true);
    }

    const editModalCancel = () => {
        setEditModal(false);
    }

    const editModalSubmit = async (values) => {
        const requestBody = {
            dish_id: selectedDishId,
            name: values.name, 
            price: values.price, 
            spicy: values.spicy, 
            is_signature: values.is_signature,
            dish_type: values.dish_type
        }

        try {
            let updateD = await updateDish(restId,requestBody);
            setSelectedRestaurantDish(updateD.data)
            setEditModal(false);
            toast.success('Updated Dish Information', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        } catch (error) {
            alert('An error occurred! Failed to update dish!');
        }
    }   

    const editDish = (dishId) => {
        setSelectedDishId(dishId);
        showEditModal()
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={dishBreadCrumb}/>
             <Content style={styles.content}>
                <CustomButton
                    text="Add Dish"
                    style={{ marginLeft: '3px'}}
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                />

                <AddDishModal
                    isVisible={addModal}
                    onCancel={addModalCancel}
                    onSubmit={addModalSubmit}
                />

                <EditDishModal
                    isVisible={editModal}
                    onCancel={editModalCancel}
                    onSubmit={editModalSubmit}
                    selectedDishId={selectedDishId}
                />

                <CustomTablePagination data={datasource} column={columns} tableLayout="fixed" style={{marginBottom: "-10px", marginTop:"20px"}}  />
                <ToastContainer />
            
                <ToastContainer />
             </Content>
        </Layout>
    ):
    ( 
        <Navigate to="/" />
    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:'-5px'
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}