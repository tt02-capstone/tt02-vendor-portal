import { Layout } from 'antd';
import { React, useEffect, useState, useRef } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import CustomHeader from '../../components/CustomHeader';
import { Content } from "antd/es/layout/layout";
import CustomButton from "../../components/CustomButton";
import { getRoomListByVendor, createRoom, getAccommodation } from "../../redux/accommodationRedux";
import CreateRoomModal from "./CreateRoomModal";
import { Table, Input, Button, Space, Form } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';

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
       
        let roomObj = {
            room_number: values.room_number,
            amenities_description: values.amenities_description,
            address: values.address,
            num_of_pax: values.num_of_pax,
            price: values.price,
            room_type: values.room_type,
        }

        let response = await createRoom(user.user_id, roomObj);
        if (response.status) {
            createRoomForm.resetFields();
            setGetRoomsData(true);
            setIsCreateRoomModalOpen(false);
            console.log("createRoom response", response.status)
            toast.success('Room successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

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