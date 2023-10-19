import React, { useState, useEffect, useRef } from "react";
import {Layout, Form, Input, Button, Badge, Space, Tag, List, Avatar, Select} from 'antd';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../../components/CustomHeader";
import {toast, ToastContainer} from "react-toastify";
import CustomButton from "../../../components/CustomButton";
import {CalendarOutlined, PlusOutlined} from "@ant-design/icons";
import {
    getAllIncomingSupportTicketsByVendorStaff,
} from "../../../redux/supportticketRedux";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import moment from "moment";
import MessageBox from "../MessageBox";
import ViewAttractionModal from "../../attractions/ViewAttractionModal";

const Search = Input.Search;

export default function UserSupportTicketManagement() {
    const navigate = useNavigate();
    const {Content} = Layout;
    const vendorstaff = JSON.parse(localStorage.getItem("user"));
    const [form] = Form.useForm(); // create
    const [userTicketList, setUserTicketList] = useState([]);
    const [openCreateUserTickerModal, setOpenCreateUserTickerModal] = useState(false);
    const [fetchUserTicketList, setFetchUserTicketList] = useState(true);

    const getNameForSupportTicket = (item) => {
            return 'Enquiry to User for ' + item.ticket_category;
    }

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
                    var tempData = response.data.map((val) => ({
                        ...val,
                        reply_list: val.reply_list,
                        is_resolved: val.is_resolved,
                        ticket_category: val.ticket_category,
                        ticket_type: val.ticket_type,
                        start_datetime: moment(val.created_time).format('llll'),
                        description: val.description,
                        key: val.support_ticket_id,
                        title: getNameForSupportTicket(val),
                        avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${val.support_ticket_id}`
                    }));

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
    const SupportTicket = () => (
        <List
            itemLayout="horizontal"
            size="small"
            pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3,
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
                        // <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={CalendarOutlined} text={item.start_datetime}/>,
                        <Button
                            type="primary"
                            icon={<MessageOutlined />}
                            onClick={() => handleSendMessage(item)}
                        />

                    ]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a>{item.title}</a>}
                    />
                    {item.description}
                    {/*/!*{}*!/ //Add toggle here for is resolved*/}

                </List.Item>
            )}
        />
    )


    const TitleSearch = ({ onSearch, ...props }) => (
        <div {...props}>
            <Search
                allowClear
                placeholder="Search Description"
                onSearch={onSearch}
                style={{ width: '100%'}}
            />
        </div>
    );

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
    const handleSearch = (searchText, event) => {
        event.preventDefault();
        const filteredEvents = userTicketList.filter(({ description }) => {
            console.log(description)
            description = description.toLowerCase();
            return description.includes(searchText);
        });

        setUserTicketList(filteredEvents)
    };

    return (
        <Layout style={styles.layout}>
            {/* <CustomHeader text={"Header"} /> */}
            <CustomHeader items={viewUserSupportBreadCrumb}/>
            <Layout style={{ padding: '0 24px 24px', backgroundColor:'white' }}>
                <Content style={styles.content}>
                    <TitleSearch onSearch={handleSearch} />

                    <br />
                    {/*<UserTicketFilter*/}
                    {/*    filterBy={this.handleFilter}*/}
                    {/*    className={styles.action}*/}
                    {/*/>*/}
                    {SupportTicket()}
                    <br /><br />

                    {viewReplySection?
                        <MessageBox
                            supportTicketId={currSupportTicket}
                            toggleFetchUserList = {toggleFetchUserList}
                        />: null
                    }
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
        marginTop:'-5px', 
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