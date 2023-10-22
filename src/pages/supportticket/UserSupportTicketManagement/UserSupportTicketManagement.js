import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Button, Badge, Space, Tag, List, Avatar, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../../components/CustomHeader";
import { toast, ToastContainer } from "react-toastify";
import CustomButton from "../../../components/CustomButton";
import { CalendarOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import {
    getAllIncomingSupportTicketsByVendorStaff, getUserAvatarImage
} from "../../../redux/supportticketRedux";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import moment from "moment";
import MessageBox from "../MessageBox";
import ViewAttractionModal from "../../attractions/ViewAttractionModal";

const Search = Input.Search;

export default function UserSupportTicketManagement() {
    const navigate = useNavigate();
    const { Content } = Layout;
    const vendorstaff = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm(); // create
    const [userTicketList, setUserTicketList] = useState([]);
    const [openCreateUserTickerModal, setOpenCreateUserTickerModal] = useState(false);
    const [fetchUserTicketList, setFetchUserTicketList] = useState(true);
    const [searchText, setSearchText] = useState('');

    const getNameForSupportTicket = (item) => {
        const submittedUser = item.submitted_user.charAt(0).toUpperCase() + item.submitted_user.slice(1).toLowerCase();
        const ticketType = item.ticket_type.charAt(0).toUpperCase() + item.ticket_type.slice(1).toLowerCase();

        if (item.submitted_user === 'VENDOR_STAFF') {
            return 'Enquiry from Vendor to ' + ticketType;
        } else {
            return 'Enquiry from ' + submittedUser + ' to ' + ticketType;
        }
    };

    const [viewReplySection, setViewReplySection] = useState(false);
    const [currSupportTicket, setCurrSupportTicket] = useState('');
    const handleSendMessage = (item) => {
        console.log("Curr item ", item.key)
        setViewReplySection(!viewReplySection)
        // setCurrSupportTicket(item.key)
        setCurrSupportTicket((prevTicket) => item.key);
    };


    useEffect(() => {
        if (vendorstaff && vendorstaff.user_type === 'VENDOR_STAFF' && fetchUserTicketList) {
            const fetchData = async () => {
                console.log(vendorstaff.user_id)
                const response = await getAllIncomingSupportTicketsByVendorStaff(vendorstaff.user_id);
                console.log(response)
                if (response.status) {
                    const tempData = await Promise.all(
                        response.data.map(async (val) => {
                            const response = await getUserAvatarImage(val.submitted_user_id);
                            return {
                                ...val,
                                reply_list: val.reply_list,
                                is_resolved: val.is_resolved,
                                ticket_category: val.ticket_category,
                                ticket_type: val.ticket_type,
                                start_datetime: moment(val.created_time).format('llll'),
                                description: val.description,
                                key: val.support_ticket_id,
                                title: getNameForSupportTicket(val),
                                avatar: response.data
                            };
                        })
                    );

                    tempData.sort((a, b) => {
                        const momentA = moment(a.start_datetime);
                        const momentB = moment(b.start_datetime);

                        if (momentA.isBefore(momentB)) {
                            return 1; // If momentA is earlier, put it after momentB
                        } else if (momentA.isAfter(momentB)) {
                            return -1; // If momentA is later, put it before momentB
                        } else {
                            // If the moments are the same, compare by created_time (time component)
                            return moment(b.created_time).diff(moment(a.created_time));
                        }
                    });

                    console.log(tempData)
                    setUserTicketList(tempData);
                    setFetchUserTicketList(false);
                } else {
                    console.log("User Ticket list not fetched!");
                }
            }

            fetchData();
        }
    }, [vendorstaff, fetchUserTicketList]);

    const toggleFetchUserList = () => {
        setFetchUserTicketList(true)
    }
    function onCancelCreateModal() {
        form.resetFields();
        setOpenCreateUserTickerModal(false)
    }


    const viewUserSupportBreadCrumb = [
        {
            title: 'User Support Ticket Management',
        }
    ];

    const IconText = ({ icon, text }) => (
        <Space>
            {React.createElement(icon)}
            {text}

        </Space>
    );

    const categoryColorMap = {
        REFUND: 'red',
        CANCELLATION: 'blue',
        GENERAL_ENQUIRY: 'purple',
        BOOKING: 'gold',
        DEAL: 'cyan',
        RESTAURANT: 'magenta',
        ATTRACTION: 'orange',
        TELECOM: 'volcano',
        ACCOMMODATION: 'lime',
        TOUR: 'geekblue',
    };

    const getColorForCategory = (category) => {
        const color = categoryColorMap[category] || 'gray';
        const formattedCategory = category.replace('_', ' ');
        return { color, formattedCategory };
    };

    const SupportTicket = () => (
        <List
            itemLayout="horizontal"
            size="small"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 10,
            }}
            bordered={true}
            dataSource={userTicketList}
            // footer={
            //     <div>
            //         <b>ant design</b> footer part
            //     </div>
            // }
            renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <span>
                            <Tag color={getColorForCategory(item.ticket_category).color}>
                                {getColorForCategory(item.ticket_category).formattedCategory}
                            </Tag>
                        </span>,
                        <span style={{ width: '70px', display: 'inline-block' }}> {item.is_resolved === true ? (<Tag color="red">CLOSED</Tag>) : (<Tag color="green">OPEN</Tag>)}</span>,
                        <span style={{ width: '230px', display: 'inline-block' }}>
                            <IconText icon={CalendarOutlined} text={item.start_datetime} />
                        </span>,
                        <span>
                            <Button
                                type="primary"
                                icon={<EyeOutlined />}
                                onClick={() => handleSendMessage(item)}
                                style={{ marginRight: '8px' }}
                            >
                                View
                            </Button>
                        </span>

                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{`#${item.support_ticket_id} - ${item.submitted_user_name}`}</a>}
                        description={<span>{item.title}</span>}
                    />
                    {item.description}

                </List.Item>
            )}
        />
    )

    const handleSearch = (searchText) => {
        const filteredEvents = userTicketList.filter(({ description }) => {
            description = description.toLowerCase();
            console.log(description);
            return description.includes(searchText);
        });

        setUserTicketList(filteredEvents);
    };

    const resetSearch = () => {
        setSearchText('');
        setFetchUserTicketList(true);
    };

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

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={viewUserSupportBreadCrumb} />
            <Layout style={{ padding: '0 24px 24px', backgroundColor: 'white' }}>
                <Content style={styles.content}>
                    <div>
                        <Input
                            placeholder="Search description"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                        />
                        <Button type="primary" onClick={handleSearch} style={{ marginLeft: '5px' }}> Search </Button>
                        <Button type="primary" onClick={resetSearch} style={{ marginLeft: '5px', backgroundColor: 'slategray' }}> Clear </Button>

                        <br /><br />
                        {SupportTicket()}
                        <br /><br />

                        {viewReplySection ?
                            <MessageBox
                                supportTicketId={currSupportTicket}
                                toggleFetchUserList={toggleFetchUserList}
                            /> : null
                        }
                    </div>
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
        width: "97%",
        marginTop: '-5px',
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