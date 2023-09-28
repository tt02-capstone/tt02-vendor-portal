import { Layout } from 'antd';
import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/CustomHeader';
import { Content } from "antd/es/layout/layout";
import CustomButton from "../../components/CustomButton";
import { getRoomListByVendor, createRoomListExistingAccommodation,createRoom, getAccommodation } from "../../redux/accommodationRedux";
import CreateRoomModal from "./CreateRoomModal";
import { Table, Input, Button, Space, Badge, Tag, Form } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import CustomTablePagination from "../../components/CustomTablePagination";

export default function RoomManagement() {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();
    const { accommodationId } = location.state;
    const [currentAccommodation, setCurrentAccommodation] = useState([]);
    const [getRoomsData, setGetRoomsData] = useState(true);
    const [roomList, setRoomList] = useState(true);

    const viewRoomBreadCrumb = [
        {
            title: 'Accommodation',
        },
        {
            title: 'Rooms',
        },
    ];


    // form inputs for room creation
    const [createRoomForm] = Form.useForm();
    const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false); // boolean to open modal

    // create new room modal open button
    function onClickOpenCreateRoomModal() {
        setIsCreateRoomModalOpen(true);
    }

    // create new room modal cancel button
    function onClickCancelCreateRoomModal() {
        setIsCreateRoomModalOpen(false);
    }

    // create new room modal create button
    async function onClickSubmitRoomCreate(values) {

        const numOfRoomsToCreate = values.num_of_rooms;


        const roomObj = {
            amenities_description: values.amenities_description,
            num_of_pax: values.num_of_pax,
            price: values.price,
            room_type: values.room_type,
            quantity: values.num_of_rooms
        };


        let response = await createRoom(currentAccommodation.accommodation_id, roomObj);
        if (response.status) {
            createRoomForm.resetFields();
            setGetRoomsData(true);
            setIsCreateRoomModalOpen(false);
            console.log("createRoomListExistingAccommodation response", response.status)
            toast.success('Rooms successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            console.log(response.data)
            retrieveAccommodation(accommodationId);

        } else {
            console.log("Room creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function retrieveAccommodation(accommodationId) {
        try {
            let response = await getAccommodation(accommodationId);
            console.log("response.data", response.data);
            setCurrentAccommodation(response.data);
            console.log("currentAccommodation", currentAccommodation);
            setRoomList(response.data.room_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve accommodation!');
        }
    }

    const roomColumns = [

        {
            title: 'Type',
            dataIndex: 'room_type',
            key: 'room_type',
            render: (type) => {
                let tagColor = 'default';
                switch (type) {
                    case 'STANDARD':
                        tagColor = 'purple';
                        break;
                    case 'DOUBLE':
                        tagColor = 'volcano';
                        break;
                    case 'SUITE':
                        tagColor = 'magenta';
                        break;
                    case 'JUNIOR_SUITE':
                        tagColor = 'orange';
                        break;
                    case 'DELUXE_SUITE':
                        tagColor = 'gold';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{type}</Tag>
                );
            },
            width: '15%',
        },
        {
            title: 'No. of Pax',
            dataIndex: 'num_of_pax',
            key: 'num_of_pax',
            width:'10%'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '10%',
        },
        {
            title: 'Description',
            dataIndex: 'amenities_description',
            key: 'amenities_description',

            width: '40%',
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="horizontal">
 
                            <CustomButton
                                text="Edit"
                                //onClick={() => onClickOpenEditAccommodationModal(record.accommodation_id)}
                            />
                        </Space>
                    </div>
                </div>


            },
            width: '15%',
        },
        // total rooms
       
      
    ];

    function formatRoomData(roomList) {
        if (roomList.length > 0) {
            return roomList.map(item => {
                // const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
                // const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                // const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
                //const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;
    
                return {
                    amenities_description: item.amenities_description,
                    num_of_pax: item.num_of_pax,
                    price: item.price,
                    room_type: item.room_type,
                    // contact_num: formattedContactNum,
                    quantity: item.quantity,
                   
                };
            });
        }
        
    }

    useEffect(() => {
        console.log("accommodationId", accommodationId);
        retrieveAccommodation(accommodationId);
    }, []);

    useEffect(() => {
        console.log("currentAccommodation", currentAccommodation);

    }, [currentAccommodation]);

    // useEffect(() => {
    //     if (isEditAccommodationModalOpen) {
    //         getAccommodation(user, selectedAccommodationId);
    //     }
    // }, [isEditAccommodationModalOpen]);

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={viewRoomBreadCrumb} />
            <Content style={styles.content}>
                <div>
                    <CustomButton
                        text="Create Room"
                        style={{ marginLeft: '3px', marginBottom: '20px' }}
                        icon={<PlusOutlined />}
                        onClick={onClickOpenCreateRoomModal}
                    />

                    <CustomTablePagination
                            title="Rooms"
                            column={roomColumns}
                            data={formatRoomData(roomList)}
                            tableLayout="fixed"

                        />

                    <CreateRoomModal
                        form={createRoomForm}
                        isCreateRoomModalOpen={isCreateRoomModalOpen}
                        onClickCancelCreateRoomModal={onClickCancelCreateRoomModal}
                        onClickSubmitRoomCreate={onClickSubmitRoomCreate}
                    />
                </div>
                <ToastContainer />
            </Content>
        </Layout>
    ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
}