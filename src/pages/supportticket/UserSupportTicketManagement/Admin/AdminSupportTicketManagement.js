import React, { useState, useEffect, useRef } from "react";
import {Layout, Form, Input, Button, Badge, Space, Tag, List, Avatar} from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../../../components/CustomHeader";
import {toast, ToastContainer} from "react-toastify";
import CreateAdminTicketModal from "./CreateAdminTicketModal";
import CustomButton from "../../../../components/CustomButton";
import {PlusOutlined} from "@ant-design/icons";
import {createSupportTicketToAdmin, getAllSupportTicketsByVendorStaff} from "../../../../redux/supportticketRedux";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import {AdminTicketFilter} from "./AdminTicketFilter";
import {getAssociatedTelecomList} from "../../../../redux/telecomRedux";

const Search = Input.Search;

export default function AdminSupportTicketManagement() {

    const navigate = useNavigate();
    const {Content} = Layout;
    const vendorstaff = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm(); // create
    const [editForm] = Form.useForm(); // create
    const [adminTicketList, setAdminTicketList] = useState([]);
    const [openCreateAdminTickerModal, setOpenCreateAdminTickerModal] = useState(false);
    const [fetchAdminTicketList, setFetchAdminTicketList] = useState(true);


    useEffect(() => {
        if (vendorstaff && vendorstaff.user_type === 'VENDOR_STAFF' && fetchAdminTicketList) {
            const fetchData = async () => {
                console.log(vendorstaff.user_id)
                const response = await getAllSupportTicketsByVendorStaff(vendorstaff.user_id);
                console.log(response)
                if (response.status) {
                    console.log(response.data)
                    setAdminTicketList(response.data);
                    setFetchAdminTicketList(false);
                } else {
                    console.log("Admin Ticket list not fetched!");
                }
            }

            fetchData();
        }
    }, [vendorstaff, fetchAdminTicketList]);

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

    const data = Array.from({ length: 23 }).map((_, i) => ({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));


    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const SupportTicket = () => (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3,
            }}
            dataSource={data}
            footer={
                <div>
                    <b>ant design</b> footer part
                </div>
            }
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ]}
                    extra={
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href={item.href}>{item.title}</a>}
                        description={item.description}
                    />
                    {item.content}
                </List.Item>
            )}
        />
    )


    // const TitleSearch = ({ onSearch, ...props }) => (
    //     <div {...props}>
    //         <Search
    //             placeholder="Enter Title"
    //             onSearch={onSearch}
    //             style={{ width: 200 }}
    //         />
    //     </div>
    // );
    //
    // const handleFilter = (key) => {
    //     const selected = parseInt(key);
    //     if (selected === 3) {
    //         return this.setState({
    //             eventsData
    //         });
    //     }
    //
    //     const statusMap = {
    //         1: "complete",
    //         2: "inProgress"
    //     };
    //
    //     const selectedStatus = statusMap[selected];
    //
    //     const filteredEvents = eventsData.filter(
    //         ({ status }) => status === selectedStatus
    //     );
    //     this.setState({
    //         eventsData: filteredEvents
    //     });
    // };
    //
    // const handleSearch = (searchText) => {
    //     const filteredEvents = eventsData.filter(({ title }) => {
    //         title = title.toLowerCase();
    //         return title.includes(searchText);
    //     });
    //
    //     this.setState({
    //         eventsData: filteredEvents
    //     });
    // };

    return (
        <Layout style={styles.layout}>
            {/* <CustomHeader text={"Header"} /> */}
            <CustomHeader items={viewAdminSupportBreadCrumb}/>
            <Layout style={{ padding: '0 24px 24px', backgroundColor:'white' }}>
                <Content style={styles.content}>
                    <CustomButton text="Create Admin Ticket" icon={<PlusOutlined />} onClick={() => setOpenCreateAdminTickerModal(true)} />
                    <br /><br />
                    {/*<AdminTicketFilter*/}
                    {/*    filterBy={this.handleFilter}*/}
                    {/*    className={styles.action}*/}
                    {/*/>*/}
                    {/*<TitleSearch onSearch={handleSearch} className={styles.action} />*/}
                    <CreateAdminTicketModal
                        form={form}
                        openCreateAdminTickerModal={openCreateAdminTickerModal}
                        cancelAdminTicketModal={onCancelCreateModal}
                        onCreateSubmit={onCreateSubmit}
                    />
                    {SupportTicket()}
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