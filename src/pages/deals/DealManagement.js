import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { createDeal, getAssociatedDealList, updateDeal } from "../../redux/dealRedux";
import { SearchOutlined, StarFilled, PlusCircleOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import ViewDealModal from "./ViewDealModal";
import EditDealModal from "./EditDealModal";
import CreateDealModal from "./CreateDealModal";
import moment from "moment/moment";

export default function DealManagement() {

    const navigate = useNavigate();
    const [form] = Form.useForm(); // create
    const [editForm] = Form.useForm(); // create
    const { Content } = Layout;
    const user = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
          title: 'Deals',
        },
    ];

    // create deal modal
    const [openCreateDealModal, setCreateDealModal] = useState(false);

    // view deal modal
    const [viewDealModal, setViewDealModal] = useState(false);
    const [viewDealId, setViewDealId] = useState();

    // edit deal modal
    const [editDealModal, setEditDealModal] = useState(false);
    const [editDealId, setEditDealId] = useState();

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
            title: 'Cover Image',
            dataIndex: 'deal_image_list',
            key: 'deal_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Attraction"
                                style={styles.image}
                            />
                        </div>
                    );
                }
                return 'No Image';
            },
        },{
            title: 'Promo Code',
            dataIndex: 'promo_code',
            key: 'promo_code',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Discount Percentage',
            dataIndex: 'discount_percent',
            key: 'discount_percent',
            sorter: (a, b) => a.discount_percent > b.discount_percent,
            ...getColumnSearchProps('discount_percent'),
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
            title: 'Government Voucher',
            dataIndex: 'is_govt_voucher',
            key: 'is_govt_voucher',
            filters: [
                {
                    text: 'Yes',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_govt_voucher === value,
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
            dataIndex: 'deal_type',
            key: 'deal_type',
            filters: [
                {
                    "text": "Chinese New Year",
                    "value": "CHINESE_NEW_YEAR"
                },
                {
                    "text": "National Day",
                    "value": "NATIONAL_DAY"
                },
                {
                    "text": "Deepavalli",
                    "value": "DEEPAVALLI"
                },
                {
                    "text": "Valentines",
                    "value": "VALENTINES"
                },
                {
                    "text": "New Year Day",
                    "value": "NEW_YEAR_DAY"
                },
                {
                    "text": "Hari Raya",
                    "value": "HARI_RAYA"
                },
                {
                    "text": "NUS Wellbeing Day",
                    "value": "NUS_WELLBEING_DAY"
                },
                {
                    "text": "Singles Day",
                    "value": "SINGLES_DAY"
                },
                {
                    "text": "Black Friday",
                    "value": "BLACK_FRIDAY"
                },
                {
                    "text": "Christmas",
                    "value": "CHRISTMAS"
                },
                {
                    "text": "Government",
                    "value": "GOVERNMENT"
                }
            ],
            onFilter: (value, record) => record.deal_type === value,
            render: (text, record) => {
                    return <Tag color="magenta">{text}</Tag>
                }
        },
        {
            title: 'Publish Date',
            dataIndex: 'publish_date',
            key: 'publish_date',
            sorter: (a, b) => a.publish_date > b.publish_date,
            ...getColumnSearchProps('publish_date'),
        },
        {
            title: 'Start Date',
            dataIndex: 'start_datetime',
            key: 'start_datetime',
            sorter: (a, b) => a.start_datetime > b.start_datetime,
            ...getColumnSearchProps('start_datetime'),
        },
        {
            title: 'End Date',
            dataIndex: 'end_datetime',
            key: 'end_datetime',
            sorter: (a, b) => a.end_datetime > b.end_datetime,
            ...getColumnSearchProps('end_datetime'),
        },
        {
            title: 'Action(s)',
            dataIndex: 'deal_id',
            key: 'deal_id',
            width: 160,
            align: 'center',
            render: (text, record) => (
                <div>
                    <CustomButton key='1' text="View" onClick={() => onOpenViewModal(record.deal_id)} style={{marginRight: '10px'}} />
                    <CustomButton key='2' text="Edit" onClick={() => onOpenEditModal(record.deal_id)}/>
                </div>
            ),
        }
    ];

    // fetch deal list
    const [dealList, setDealList] = useState([]);
    const [fetchDealList, setFetchDealList] = useState(true);

    useEffect(() => {
        if (user && user.user_type === 'VENDOR_STAFF' && fetchDealList) {
            const fetchData = async () => {
                const response = await getAssociatedDealList(user.vendor.vendor_id);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        publish_date: moment(val.publish_date).format('ll'),
                        start_datetime: moment(val.start_datetime).format('llll'),
                        end_datetime: moment(val.end_datetime).format('llll'),
                        key: val.user_id,
                    }));
                    setDealList(tempData);
                    setFetchDealList(false);
                } else {
                    console.log("Deal list not fetched!");
                }
            }

            fetchData();
        }
    },[user, fetchDealList]);

    // on submit create modal
    async function onCreateSubmit(values) {
        console.log(values);
        let obj = {
            "discount_percent": values.discount_percent,
            "start_datetime": values.promo_date_time[0].format('YYYY-MM-DD HH:mm:ss'),
            "end_datetime": values.promo_date_time[1].format('YYYY-MM-DD HH:mm:ss'),
            "promo_code": values.promo_code,
            "is_govt_voucher": values.is_govt_voucher,
            "deal_image_list": values.deal_image_list,
            "is_published": values.is_published,
            "publish_date": values.publish_date.format('YYYY-MM-DD'),
            "deal_type": values.deal_type
        };

        console.log('Obj', obj)

        let response = await createDeal(obj, user.vendor.vendor_id);
        if (response.status) {
            form.resetFields();
            setFetchDealList(true);
            setCreateDealModal(false);
            toast.success('Deal successfully created!', {
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
        setCreateDealModal(false)
    }

    // open view modal
    function onOpenViewModal(id) {
        setViewDealId(id);
        setViewDealModal(true);
    }

    // close view modal
    function onCancelViewModal() {
        setViewDealModal(false);
    }

    // open edit modal
    function onOpenEditModal(id) {
        setEditDealId(id);
        setEditDealModal(true);
    }

    // close edit modal
    function onCancelEditModal() {
        setEditDealModal(false);
        setEditDealId(undefined);
    }

    // submit edit modal
    async function onEditSubmit(values) {
        let obj = {
            "discount_percent": values.discount_percent,
            "start_datetime": values.promo_date_time[0],
            "end_datetime": values.promo_date_time[1],
            "promo_code": values.promo_code,
            "is_govt_voucher": values.is_govt_voucher,
            "deal_image_list": values.deal_image_list,
            "is_published": values.is_published,
            "publish_date": values.publish_date,
            "deal_type": values.deal_type,
            "deal_id": editDealId,
        }

        const response = await updateDeal(obj);
        if (response.status) {
            setFetchDealList(true); // update list
            setEditDealId(undefined);
            setEditDealModal(false);
            toast.success('Deal successfully updated!', {
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
                <CustomHeader items={breadcrumbItems}/>
                <Content style={styles.content}>
                    <CustomButton text="Create Deal" icon={<PlusCircleOutlined />} onClick={() => setCreateDealModal(true)}/>
                    <br /><br />
                    <CustomTablePagination column={column} data={dealList} rowKey="deal_id" tableLayout={"fixed"}/>

                    {/* Modal to create deal */}
                    <CreateDealModal
                        form={form}
                        openCreateDealModal={openCreateDealModal}
                        cancelDealModal={onCancelCreateModal}
                        onCreateSubmit={onCreateSubmit}
                    />

                    {/* Modal to view deal */}
                    <ViewDealModal
                        selectedDealId={viewDealId}
                        viewDealModal={viewDealModal}
                        onCancelViewModal={onCancelViewModal}
                    />

                    {/* Modal to edit deal */}
                    <EditDealModal
                        form={editForm}
                        selectedDealId={editDealId}
                        editDealModal={editDealModal}
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
    imageContainer: {
        // maxWidth: '180px',
        // maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}