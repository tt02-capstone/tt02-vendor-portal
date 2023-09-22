import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Space, Button } from 'antd';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Highlighter from 'react-highlight-words';
import { SearchOutlined }  from "@ant-design/icons";
import { createVendorStaff, getAllAssociatedVendorStaff, toggleVendorStaffBlock } from "../../redux/vendorStaffRedux";
import CustomHeader from "../../components/CustomHeader";
import { Navigate } from 'react-router-dom';
import CreateVendorStaffModal from "./CreateVendorStaffModal";
import CustomButton from '../../components/CustomButton'
import CustomTablePagination from "../../components/CustomTablePagination";
import { UserAddOutlined }  from "@ant-design/icons";

export default function VendorStaff() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    const breadcrumbItems = [
        {
          title: 'Users',
        },
    ];

    
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
                    {/* <Button
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
                    </Button> */}
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

    // vendor staff table pagination
    const [getVendorStaffData, setGetVendorStaffData] = useState(true);
    const [vendorStaffData, setVendorStaffData] = useState([]); // list of vendor staff

    const vendorStaffColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Login Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
            filters: [
                {
                  text: 'Allowed',
                  value: false,
                },
                {
                  text: 'Denied',
                  value: true,
                },
            ],
            onFilter: (value, record) => record.is_blocked === value,
            render: (text) => {
                if (text === true) {
                    return <p>No</p>
                } else {
                    return <p>Yes</p>
                }
            }
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            sorter: (a, b) => a.position.localeCompare(b.position),
            ...getColumnSearchProps('position'),
        },
        {
            title: 'Master Account',
            dataIndex: 'is_master_account',
            key: 'is_master_account',
            filters: [
                {
                  text: 'Master',
                  value: true,
                },
                {
                  text: 'Non-master',
                  value: false,
                },
            ],
            onFilter: (value, record) => record.is_master_account === value,
            render: (text) => {
                if (text === true) {
                    return <p>Yes</p>
                } else {
                    return <p>No</p>
                }
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'isb',
            key: 'is_master_account',
            render: (text, record) => {
                if (vendor.user_id === record.user_id) {
                    return <p>N/A</p>
                } else if (vendor.is_master_account) {
                    if (text === true) {
                        return <p>-</p>
                    } else if (record.is_blocked) {
                        return <CustomButton
                            text="Unblock" 
                            onClick={() => toggleBlock(record.user_id)}
                            />
                    } else {
                        return <CustomButton
                            text="Block"
                            onClick={() => toggleBlock(record.user_id)}
                            />
                    }
                } else {
                    return <p>N/A</p>
                }
            }
        },
    ];

    useEffect(() => { // fetch list of vendor staff
        if (getVendorStaffData) { // if we want to fetch the most updated data
            const fetchData = async () => {
                const response = await getAllAssociatedVendorStaff(vendor.vendor.vendor_id);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val, 
                        key: val.user_id,
                    }));
                    setVendorStaffData(tempData);
                    setGetVendorStaffData(false);
                } else {
                    console.log("List of vendor staff not fetched!");
                }
            }
    
            fetchData();
            setGetVendorStaffData(false);
        }
    },[getVendorStaffData]);

    // blocking-related properties and function
    const [blockedId, setBlockedId] = useState();

    function toggleBlock(id) {
        setBlockedId(id);
    }

    useEffect(() => {
        if (blockedId) {
            async function innerToggleBlock(blockedId) {
                let response = await toggleVendorStaffBlock(blockedId);
                // console.log(response)
                if (response.status) {
                    console.log("Vendor staff toggle block success!");
                    setGetVendorStaffData(true);
                    toast.success('Staff login status successfully updated!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                } else {
                    console.log("Vendor staff toggle block failed!");
                    toast.error(response.data.errorMessage, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
                }
            }

            innerToggleBlock(blockedId);
            setBlockedId(undefined);
        }
    },[blockedId])
    
    // form inputs for vendor staff creation
    const [createVendorStaffForm] = Form.useForm();
    const [isCreateVendorStaffModalOpen, setIsCreateVendorStaffModalOpen] = useState(false); // boolean to open modal
    const [createLoading, setCreateLoading] = useState(false);
    
    // create new vendor staff modal open button
    function onClickOpenCreateVendorStaffModal() {
        setIsCreateVendorStaffModalOpen(true);
    }
    // create new vendor staff modal cancel button
    function onClickCancelVendorStaffModal() {
        setIsCreateVendorStaffModalOpen(false);
    }

    // create new vendor staff modal create button
    async function onClickSubmitVendorStaffCreate(values) {
        setCreateLoading(true);

        let obj = {
            name: values.name,
            email: values.email,
            is_blocked: values.is_blocked === "true" ? true : false,
            position: values.position,
            is_master_account: false,
            user_type: 'VENDOR_STAFF',
            vendor: {vendor_id: vendor.vendor.vendor_id},
        }
            
        let response = await createVendorStaff(obj);
        if (response.status) {
            createVendorStaffForm.resetFields();
            setGetVendorStaffData(true);
            setIsCreateVendorStaffModalOpen(false);
            setCreateLoading(false);
            toast.success('Staff successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Vendor staff creation failed!");
            console.log(response.data);
            setCreateLoading(false);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                    <CustomHeader items={breadcrumbItems}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            <CustomButton 
                                text="Create"
                                style={{marginLeft: '3px', marginBottom: '20px'}}
                                icon={<UserAddOutlined />}
                                onClick={onClickOpenCreateVendorStaffModal}
                            />

                            {/* pagination */}
                            <CustomTablePagination
                                title="Vendor Staff"
                                style={styles.table}
                                column={vendorStaffColumns}
                                data={vendorStaffData}
                                tableLayout="fixed"
                            />

                            {/* Modal to create new vendor staff account */}
                            <CreateVendorStaffModal
                                form={createVendorStaffForm}
                                loading={createLoading}
                                isCreateVendorStaffModalOpen={isCreateVendorStaffModalOpen}
                                onClickCancelVendorStaffModal={onClickCancelVendorStaffModal}
                                onClickSubmitVendorStaffCreate={onClickSubmitVendorStaffCreate}
                            />
                        </Content>
                    </Layout>
            </Layout>

            <ToastContainer />
        </div>
    ) :
    (
        <Navigate to="/" />
    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw'
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    table: {
        
    }
}