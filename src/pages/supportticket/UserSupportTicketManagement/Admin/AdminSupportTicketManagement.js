import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Button, Badge, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../../../components/CustomHeader";
import {toast, ToastContainer} from "react-toastify";
import CreateTelecomModal from "../../../telecom/CreateTelecomModal";
import CreateAdminTicketModal from "./CreateAdminTicketModal";
import {createTelecom} from "../../../../redux/telecomRedux";
import CustomButton from "../../../../components/CustomButton";
import {PlusOutlined} from "@ant-design/icons";
import {createSupportTicketToAdmin} from "../../../../redux/supportticketRedux";


export default function AdminSupportTicketManagement() {

    const navigate = useNavigate();
    const {Content} = Layout;
    const vendorstaff = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm(); // create
    const [editForm] = Form.useForm(); // create

    const [openCreateAdminTickerModal, setOpenCreateAdminTickerModal] = useState(false);
    const [fetchAdminTicketList, setFetchAdminTicketList] = useState(true);

    function onCancelCreateModal() {
        form.resetFields();
        setOpenCreateAdminTickerModal(false)
    }

    async function onCreateSubmit(values) {
        console.log(values);
        let obj = {
            'ticket_type': 'ADMIN',
            'description': values.description,
            'ticket_category': values.ticket_category,
            'attraction_id': null,
            'accommodation_id': null,
            'restaurant_id': null,
            'telecom_id': null,
            'deal_id': null,
            'tour_id': null,
            'booking_id': null
        };

        let response = await createSupportTicketToAdmin(vendorstaff.user_id, obj);
        if (response.status) {
            form.resetFields();
            setFetchAdminTicketList(true);
            setOpenCreateAdminTickerModal(false);
            toast.success('Ticket successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const viewAdminSupportBreadCrumb = [
        {
            title: 'Admin Support Ticket Management',
        }
    ];

    return (
        <Layout style={styles.layout}>
            {/* <CustomHeader text={"Header"} /> */}
            <CustomHeader items={viewAdminSupportBreadCrumb}/>
            <Layout style={{ padding: '0 24px 24px', backgroundColor:'white' }}>
                <Content style={styles.content}>
                    <CustomButton text="Create Admin Ticket" icon={<PlusOutlined />} onClick={() => setOpenCreateAdminTickerModal(true)} />
                    <br /><br />
                    <CreateAdminTicketModal
                        form={form}
                        openCreateAdminTickerModal={openCreateAdminTickerModal}
                        cancelAdminTicketModal={onCancelCreateModal}
                        onCreateSubmit={onCreateSubmit}
                    />
                </Content>
            </Layout>
            <ToastContainer />
        </Layout>

    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '91.5vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%",
        marginTop:'-5px'
    },
    customRow: {
        height: '280px',
    },
    imageContainer: {
        maxWidth: '180px',
        maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}