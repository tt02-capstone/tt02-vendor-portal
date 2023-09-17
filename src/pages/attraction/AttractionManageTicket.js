import { Layout } from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';
import { getAttractionList, getTicketEnumByAttraction, createTickets, updateTicketPerDay } from '../../redux/attractionManageTicketRedux';
import  { Table, Input, Button, Space } from 'antd';
import AddTicketModal from './AddTicketModal';
import EditTicketModal from './EditTicketModal';
import { ToastContainer, toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

export default function AttractionManageTicket() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [ticketType, setTicketType] = useState(null);
    const [attr_id, setAttrId] = useState(null);

    const viewTicketBreadCrumb = [
        {
          title: 'Attractions',
        },
        {
          title: 'View Tickets',
        },
    ];

    const showAddModal = () => {
        setAddModal(true);
    };

    const addModalCancel = () => {
        setAddModal(false);
    };

    const addModalSubmit = async (values) => {
        values.ticketCount = Number(values.ticketCount);
        values.startDate = values.startDate.format('YYYY-MM-DD');
        values.endDate = values.endDate.format('YYYY-MM-DD');

        let createTicket = await createTickets(values.startDate,values.endDate,values.ticketType,values.ticketCount,attr_id)
        let updatedAttrList = await getAttractionList(user.user_id);

        setData(updatedAttrList);
        setAddModal(false); 

        toast.success('Added Tickets', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000
        });
    };

    const showEditModal = () => {
        setEditModal(true);
    }

    const editModalCancel = () => {
        setEditModal(false);
    }

    const editModalSubmit = async (values) => {
        const requestBody = {
            ticket_type: values.ticketType,
            ticket_count: Number(values.ticketCount),
            ticket_date: values.ticketDate.format('YYYY-MM-DD')
        }

        let updateTicket = await updateTicketPerDay(attr_id,requestBody);
        let updatedAttrList = await getAttractionList(user.user_id);

        setData(updatedAttrList);
        setEditModal(false);

        if (!updateTicket.error) {
            toast.success('Updated Ticket Information', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        } else {
            toast.error('Update Failed! ' + updateTicket.error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        } 
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

        const validTicketList = ticketList.filter(item => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0'); // format to current timezone 

            const todayFormatted = `${year}-${month}-${day}`;

            return item.ticket_date >= todayFormatted && item.ticket_count > 0;
        });

        const ticketListString = validTicketList.map(item => {
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
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address')
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
            width: 350,
            sorter: (a, b) => a.age_group.localeCompare(b.age_group),
            ...getColumnSearchProps('age_group')
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
            ...getColumnSearchProps('category')
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description', 
            width: 750,
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            ...getColumnSearchProps('status')
        },
        {
            title: 'Price List',
            dataIndex: 'price_list',
            key: 'price_list', 
            width: 220,
            sorter: (a, b) => a.price_list.localeCompare(b.price_list),
            ...getColumnSearchProps('price_list'),
        },
        {
            title: 'Ticket List',
            dataIndex: 'ticket_list',
            key: 'ticket_list',
            width: 230,
            sorter: (a, b) => a.price_list.localeCompare(b.ticket_list),
            ...getColumnSearchProps('ticket_list'),
        },
        {
            title: 'Add or Edit Tickets',
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
        setTicketType(ticketList); // get the ticket type for the the attraction selected 
        setAttrId(record.attraction_id); // get attr id 
        showAddModal()
    }

    const editTicket = async (record) => {
        let ticketList = await getTicketEnumByAttraction(record.attraction_id);
        setTicketType(ticketList);
        setAttrId(record.attraction_id); // get attr id 
        showEditModal()
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={viewTicketBreadCrumb}/>
             <Content style={styles.content}>
             <div>
                <h1>Attraction Ticket Details</h1>
                <Table dataSource={datasource} columns={columns} style={{ width : '98%' }} />
                <AddTicketModal
                    isVisible={addModal}
                    onCancel={addModalCancel}
                    onSubmit={addModalSubmit}
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
        minWidth: '90vw',   
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
    },
}