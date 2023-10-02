import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { createTelecom, getAssociatedTelecomList, updateTelecom } from "../../redux/telecomRedux";
import { SearchOutlined, StarFilled, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ViewTelecomModal from "./ViewTelecomModal";
import EditTelecomModal from "./EditTelecomModal";
import CreateTelecomModal from "./CreateTelecomModal";

export default function TelecomManagement() {

    const navigate = useNavigate();
    const [form] = Form.useForm(); // create
    const [editForm] = Form.useForm(); // create
    const { Content } = Layout;
    const user = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
            title: 'Telecoms',
        },
    ];

    // create telecom modal
    const [openCreateTelecomModal, setCreateTelecomModal] = useState(false);

    // view telecom modal
    const [viewTelecomModal, setViewTelecomModal] = useState(false);
    const [viewTelecomId, setViewTelecomId] = useState();

    // edit telecom modal
    const [editTelecomModal, setEditTelecomModal] = useState(false);
    const [editTelecomId, setEditTelecomId] = useState();

    // table
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

    const column = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            filters: [
                {
                    text: 'Published',
                    value: true,
                },
                {
                    text: 'Hidden',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_published === value,
            render: (text, record) => {
                if (text === true) {
                    return <p>Yes</p>
                } else {
                    return <p>No</p>
                }
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                {
                    text: 'Physical Sim',
                    value: 'PHYSICALSIM',
                },
                {
                    text: 'E-Sim',
                    value: 'ESIM',
                },
            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
            render: (text, record) => {
                if (text === 'ESIM') {
                    return <Tag color="magenta">E-SIM</Tag>
                } else if (text === 'PHYSICALSIM') {
                    return <Tag color="cyan">PHYSICAL SIM</Tag>
                } else {
                    return <p>Bug</p>
                }
            }
        },
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            filters: [
                {
                    text: 'Tier 1',
                    value: 'TIER_1',
                },
                {
                    text: 'Tier 2',
                    value: 'TIER_2',
                },
                {
                    text: 'Tier 3',
                    value: 'TIER_3',
                },
                {
                    text: 'Tier 4',
                    value: 'TIER_4',
                },
                {
                    text: 'Tier 5',
                    value: 'TIER_5',
                },
            ],
            onFilter: (value, record) => record.estimated_price_tier.indexOf(value) === 0,
            render: (text, record) => {
                if (text === 'TIER_1') {
                    return <p>$</p>
                } else if (text === 'TIER_2') {
                    return <p>$$</p>
                } else if (text === 'TIER_3') {
                    return <p>$$$</p>
                } else if (text === 'TIER_4') {
                    return <p>$$$$</p>
                } else if (text === 'TIER_5') {
                    return <p>$$$$$</p>
                } else {
                    return <p>Bug</p>
                }
            }
        },
        {
            title: 'Validity Duration',
            dataIndex: 'plan_duration_category',
            key: 'plan_duration_category',
            filters: [
                {
                    text: '1 day',
                    value: 'ONE_DAY',
                },
                {
                    text: 'Bet 1 and 3 days',
                    value: 'THREE_DAY',
                },
                {
                    text: 'Bet 3 and 7 days',
                    value: 'SEVEN_DAY',
                },
                {
                    text: 'Bet 7 and 14 days',
                    value: 'FOURTEEN_DAY',
                },
                {
                    text: 'More than 14 days',
                    value: 'MORE_THAN_FOURTEEN_DAYS',
                },
            ],
            onFilter: (value, record) => record.plan_duration_category.indexOf(value) === 0,
            render: (text, record) => {
                if (text === 'ONE_DAY') {
                    return <Tag color="green">1 DAY</Tag>
                } else if (text === 'THREE_DAY') {
                    return <Tag color="cyan">3 DAYS</Tag>
                } else if (text === 'SEVEN_DAY') {
                    return <Tag color="blue">7 DAYS</Tag>
                } else if (text === 'FOURTEEN_DAY') {
                    return <Tag color="geekblue">14 DAYS</Tag>
                } else if (text === 'MORE_THAN_FOURTEEN_DAYS') {
                    return <Tag color="purple">MORE THAN 14 DAYS</Tag>
                } else {
                    return <p>Bug</p>
                }
            }
        },
        {
            title: 'Data Limit Category',
            dataIndex: 'data_limit_category',
            key: 'data_limit_category',
            filters: [
                {
                    text: '10GB and less',
                    value: 'VALUE_10',
                },
                {
                    text: 'Bet 10GB and 30GB',
                    value: 'VALUE_30',
                },
                {
                    text: 'Bet 30GB and 50GB',
                    value: 'VALUE_50',
                },
                {
                    text: 'Bet 50GB and 100GB',
                    value: 'VALUE_100',
                },
                {
                    text: 'Beyond 100GB',
                    value: 'UNLIMITED',
                },
            ],
            onFilter: (value, record) => record.data_limit_category.indexOf(value) === 0,
            render: (text, record) => {
                if (text === 'VALUE_10') {
                    return <Tag color="magenta">10GB</Tag>
                } else if (text === 'VALUE_30') {
                    return <Tag color="red">30GB</Tag>
                } else if (text === 'VALUE_50') {
                    return <Tag color="volcano">50GB</Tag>
                } else if (text === 'VALUE_100') {
                    return <Tag color="orange">100GB</Tag>
                } else if (text === 'UNLIMITED') {
                    return <Tag color="gold">Beyond 100GB</Tag>
                } else {
                    return <p>Bug</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'telecom_id',
            key: 'telecom_id',
            width: 160,
            align: 'center',
            render: (text, record) => (

                <div style={{ marginBottom: '10px' }}>
                    <Space direction="horizontal">
                        <CustomButton key='1' text="View" onClick={() => onOpenViewModal(record.telecom_id)} style={{ marginRight: '7px', fontWeight: "bold" }} />

                        <CustomButton key='2' text="Edit" style={{ fontWeight: "bold" }} onClick={() => onOpenEditModal(record.telecom_id)} />
                    </Space>
                </div>
            ),
        }
    ];



    // fetch telecom list
    const [telecomList, setTelecomList] = useState([]);
    const [fetchTelecomList, setFetchTelecomList] = useState(true);

    useEffect(() => {
        if (user && user.user_type === 'VENDOR_STAFF' && fetchTelecomList) {
            const fetchData = async () => {
                const response = await getAssociatedTelecomList(user.vendor.vendor_id);
                if (response.status) {
                    setTelecomList(response.data);
                    setFetchTelecomList(false);
                } else {
                    console.log("Telecom list not fetched!");
                }
            }

            fetchData();
        }
    }, [user, fetchTelecomList]);

    // on submit create modal
    async function onCreateSubmit(values) {
        console.log(values);
        let obj = {
            'name': values.name,
            'description': values.description,
            'price': values.price,
            'is_published': values.is_published,
            'type': values.type,
            'estimated_price_tier': values.estimated_price_tier,
            'num_of_days_valid': values.num_of_days_valid,
            'plan_duration_category': values.plan_duration_category,
            'data_limit': values.data_limit,
            'data_limit_category': values.data_limit_category,
        };

        let response = await createTelecom(obj, user.vendor.vendor_id);
        if (response.status) {
            form.resetFields();
            setFetchTelecomList(true);
            setCreateTelecomModal(false);
            toast.success('Telecom successfully created!', {
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

    // on cancel create modal
    function onCancelCreateModal() {
        form.resetFields();
        setCreateTelecomModal(false)
    }

    // open view modal
    function onOpenViewModal(id) {
        setViewTelecomId(id);
        setViewTelecomModal(true);
    }

    // close view modal
    function onCancelViewModal() {
        setViewTelecomModal(false);
    }

    // open edit modal
    function onOpenEditModal(id) {
        setEditTelecomId(id);
        setEditTelecomModal(true);
    }

    // close edit modal
    function onCancelEditModal() {
        setEditTelecomModal(false);
        setEditTelecomId(undefined);
    }

    // submit edit modal
    async function onEditSubmit(telecom) {
        let obj = {
            ...telecom,
            telecom_id: editTelecomId,
        }

        const response = await updateTelecom(obj);
        if (response.status) {
            setFetchTelecomList(true); // update list
            setEditTelecomId(undefined);
            setEditTelecomModal(false);
            toast.success('Telecom successfully updated!', {
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

    return user ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={breadcrumbItems} />
                <Content style={styles.content}>
                    <CustomButton text="Create Telecom" icon={<PlusOutlined />} onClick={() => setCreateTelecomModal(true)} />
                    <br /><br />
                    <CustomTablePagination column={column} data={telecomList} rowKey="telecom_id" tableLayout={"fixed"} />

                    {/* Modal to create telecom */}
                    <CreateTelecomModal
                        form={form}
                        openCreateTelecomModal={openCreateTelecomModal}
                        cancelTelecomModal={onCancelCreateModal}
                        onCreateSubmit={onCreateSubmit}
                    />

                    {/* Modal to view telecom */}
                    <ViewTelecomModal
                        selectedTelecomId={viewTelecomId}
                        viewTelecomModal={viewTelecomModal}
                        onCancelViewModal={onCancelViewModal}
                    />

                    {/* Modal to edit telecom */}
                    <EditTelecomModal
                        form={editForm}
                        selectedTelecomId={editTelecomId}
                        editTelecomModal={editTelecomModal}
                        onEditSubmit={onEditSubmit}
                        onCancelEditModal={onCancelEditModal}
                    />

                    <ToastContainer />
                </Content>
            </Layout>
        </div>
    ) : (
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