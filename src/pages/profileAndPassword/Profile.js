import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal } from 'antd';
import { EditFilled } from "@ant-design/icons";
import {useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getVendorStaffProfile, editVendorStaffProfile, editVendorStaffPassword } from "../../redux/vendorStaffRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";

export default function Profile() {

    // const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;

    const [vendorStaff, setVendorStaff] = useState(); // vendor staff object
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // fetch vendor staff profile details
    useEffect(() => {
        const fetchData = async () => {
            let user_id = JSON.parse(localStorage.getItem("user"))["user_id"];
            const response = await getVendorStaffProfile(user_id);
            if (response.status) {
                setVendorStaff(response.data);
                // console.log(response.data);
            } else {
                console.log("Vendor staff profile data not fetched!");
            }
        }

        fetchData();
    }, [])

    // when the edit profile button is clicked
    function onClickEditProfile() {
        setIsViewProfile(false);
    }

    // when user submits the edit profile details form
    async function onClickSubmitProfileButton(values) {
        
        let response = await editVendorStaffProfile({...values, user_id: vendorStaff.user_id});
        if (response.status) {
            setVendorStaff(response.data);
            toast.success('Vendor staff profile changed successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setIsViewProfile(true);

        } else {
            console.log("Vendor staff profile not editted!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // when cancel edit profile details
    function onClickCancelProfileButton() {
        setIsViewProfile(true);
    }

    // when the edit password button is clicked
    function onClickEditPasswordButton() {
        setIsChangePasswordModalOpen(true);
    }

    // close edit password modal
    function onClickCancelEditPasswordButton() {
        setIsChangePasswordModalOpen(false);
    }

    // when user edits password
    async function onClickSubmitNewPassword(val) {
        if (val.oldPassword && val.newPasswordOne === val.newPasswordTwo) {
            let response = await editVendorStaffPassword(vendorStaff.user_id, val.oldPassword, val.newPasswordOne);
            if (response.status) {
                toast.success('Vendor staff password changed successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
                setIsChangePasswordModalOpen(false);
            
            } else {
                toast.error(response.data.errorMessage, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
            }

        } else {
            toast.error('New password does not match!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    return (
        <div>
            {/* view profile data fetching */}
            {!vendorStaff && <Spin />}

            {/* view profile data */}
            {vendorStaff && isViewProfile && 
                <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            {vendorStaff.email}
                            <br />
                            {vendorStaff.name}
                            <br />
                            {vendorStaff.position}
                            <br />
                            {vendorStaff.is_master_account ? "Master Account" : "Not Master Account"}
                            <br />
                            <CustomButton
                                text="Edit Profile"
                                icon={<EditFilled />}
                                onClick={onClickEditProfile}
                            />
                            <br />
                            <br />
                            <CustomButton
                                text="Edit Password"
                                icon={<EditFilled />}
                                onClick={onClickEditPasswordButton}
                            />
                            
                            {/* other items to be displayed in the future */}
                        </Content>
                    </Layout>
                </Layout>
            }

            {/* edit profile form */}
            {vendorStaff && !isViewProfile &&
                <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            required={true}
                            requiredMark={true}
                            onFinish={onClickSubmitProfileButton}
                        >
                            <Form.Item
                            label="Email"
                            name="email"
                            initialValue={vendorStaff.email}
                            rules={[{ required: true, message: 'Please enter a valid email!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Name"
                            name="name"
                            initialValue={vendorStaff.name}
                            rules={[{ required: true, message: 'Please enter a valid name!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Position"
                            name="position"
                            initialValue={vendorStaff.position}
                            rules={[{ required: true, message: 'Please enter a valid position!' }]}
                            >
                            <Input />
                            </Form.Item>

                            <Form.Item
                            label="Master Account"
                            name="is_master_account"
                            initialValue={vendorStaff.is_master_account ? "Yes" : "No"}
                            rules={[{ required: true, message: 'Please enter a valid name!' }]}
                            >
                            <Input disabled={true}/>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <CustomButton 
                                    text="Cancel"
                                    // icon
                                    onClick={onClickCancelProfileButton}
                                />
                            </Form.Item>
                        </Form>
                        </Content>
                    </Layout>
                </Layout>
            }

            {/* edit password pop-up */}
            {vendorStaff && isChangePasswordModalOpen && 
                <EditPasswordModal 
                    isChangePasswordModalOpen={isChangePasswordModalOpen}
                    onClickSubmitNewPassword={onClickSubmitNewPassword}
                    onClickCancelEditPasswordButton={onClickCancelEditPasswordButton}
                />
            }

            {/* Edit profile & password toast */}
            <ToastContainer />
        </div>
    );
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