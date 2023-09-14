import React, { useState, useEffect } from "react";
import { Layout, Form } from 'antd';
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createVendorStaff, getAllAssociatedVendorStaff, toggleVendorStaffBlock } from "../../redux/vendorStaffRedux";
import CustomHeader from "../../components/CustomHeader";
import { Navigate } from 'react-router-dom';
import CreateVendorStaffModal from "./CreateVendorStaffModal";
import CustomButton from '../../components/CustomButton'
import CustomTablePagination from "../../components/CustomTablePagination";

export default function VendorStaff() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    // vendor staff table pagination
    const [getVendorStaffData, setGetVendorStaffData] = useState(true);
    const [vendorStaffData, setVendorStaffData] = useState([]); // list of vendor staff

    const vendorStaffColumns = [
        {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Login Access',
            dataIndex: 'is_blocked',
            key: 'is_blocked',
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
        },
        {
            title: 'Master Account',
            dataIndex: 'is_master_account',
            key: 'is_master_account',
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

        let obj = {
            name: values.name,
            email: values.email,
            password: values.password,
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
            toast.success('Vendor staff successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Vendor staff creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            <CustomButton 
                                text="Create Vendor Staff"
                                // icon=
                                onClick={onClickOpenCreateVendorStaffModal}
                            />

                            {/* pagination */}
                            <CustomTablePagination
                                title="Vendor Staff"
                                column={vendorStaffColumns}
                                data={vendorStaffData}
                            />

                            {/* Modal to create new vendor staff account */}
                            <CreateVendorStaffModal
                                form={createVendorStaffForm}
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
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}