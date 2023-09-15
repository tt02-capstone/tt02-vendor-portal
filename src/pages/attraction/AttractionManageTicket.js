import { Layout } from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';
import { getAttractionList, getTicketEnumByAttraction, createTickets } from '../../redux/attractionManageTicketRedux';
import  { Table, Input, Button, Space } from 'antd';
import AddTicketModal from './AddTicketModal';
import EditTicketModal from './EditTicketModal';
import { ToastContainer, toast } from 'react-toastify';

export default function AttractionManageTicket() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [ticketType, setTicketType] = useState(null);
    const [attr_id, setAttrId] = useState(null);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values) => {
        values.ticketCount = Number(values.ticketCount);
        values.startDate = values.startDate.format('YYYY-MM-DD');
        values.endDate = values.endDate.format('YYYY-MM-DD');

        let ticketList = await createTickets(values.startDate,values.endDate,values.ticketType,values.ticketCount,attr_id)
        console.log(values);
        setIsModalVisible(false); 

        toast.success('Added Tickets', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });

        window.location.reload();
    };

    const showEditModal = () => {
        setEditModal(true);
    }

    const editModalSubmit = (values) => {
        values.ticketCount = Number(values.ticketCount);
        values.ticketDate = values.ticketDate.format('YYYY-MM-DD');
        console.log(values);
        setEditModal(false);
    }

    const editModalCancel = () => {
        setEditModal(false);
    }

    useEffect(() => {
        const fetchData = async() => {
            try {
                let listOfAttractions = await getAttractionList(user.user_id);
                setData(listOfAttractions);
                setLoading(false);
            } catch (error) {
                alert ('An error occur! Failed to retrieve attraction list!');
                setLoading(false);
            }    
        };
        fetchData();
    }, []);

    const datasource = data.map((item, index) => {
        const publishedStatus = item.is_published ? 'Published' : 'Not Published';
        const priceList = item.price_list;
        const ticketList = item.ticket_per_day_list;

        const formatPriceList = priceList.map(item => {
            return `${item.ticket_type}: Local $${item.local_amount}, Tourist $${item.tourist_amount}`;
        });

        const priceListString = formatPriceList.join('\n');

        const ticketListString = ticketList.map(item => {
            return `${item.ticket_date} - ${item.ticket_type} = ${item.ticket_count} Left`;
        }).join('\n');

        return {
            key: index,
            attraction_id : item.attraction_id,
            name: item.name,
            address: item.address,
            age_group: item.age_group,
            category: item.attraction_category, 
            description: item.description,
            status: publishedStatus,
            price_list: priceListString,
            ticket_list: ticketListString
        };
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
            width: 350
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            width: 750
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'Price List',
            dataIndex: 'price_list',
            key: 'price_list', 
            width: 220
        },
        {
            title: 'Ticket List',
            dataIndex: 'ticket_list',
            key: 'ticket_list',
            width: 230
        },
        {
            title: 'Add / Edit Tickets',
            key: 'add_edit',
            dataIndex: 'add_edit',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <Button type="primary" onClick={() => addTicket(record)} loading={loading} style={styles.button}>
                        Add
                    </Button>
                    <br /><br />
                    <Button type="primary" onClick={() => editTicket(record)} loading={loading} style={styles.button}>
                        Edit
                    </Button>
                </div>
            ),
        }
    ];

    const addTicket = async (record) => {
        let ticketList = await getTicketEnumByAttraction(record.attraction_id);
        setTicketType(ticketList);
        setAttrId(record.attraction_id);
        console.log(record);
        console.log(ticketList)
        showModal()
    }

    const editTicket = async (record) => {
        let ticketList = await getTicketEnumByAttraction(record.attraction_id);
        setTicketType(ticketList);
        console.log(record)
        showEditModal()
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader text={"Attractions"}/>
             <Content style={styles.content}>
             <div>
                <h1>List of Attractions</h1>
                <Table dataSource={datasource} columns={columns} style={{ width : '98%' }} />
                <AddTicketModal
                    isVisible={isModalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    value={ticketType}
                />
                <EditTicketModal
                    isVisible={editModal}
                    onCancel={editModalCancel}
                    onSubmit={editModalSubmit}
                    value={ticketType}
                />
            </div>
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
        backgroundColor: 'white'
    },
    content: {
        margin: '20px 30px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
}