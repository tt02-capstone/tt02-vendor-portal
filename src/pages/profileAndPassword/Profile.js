import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button } from 'antd';
import { EditFilled } from "@ant-design/icons";
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getUserProfile } from "../../redux/commonRedux";
import { editUserPassword, editUserProfile } from "../../redux/commonRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";

export default function Profile() {

    // // const navigate = useNavigate();
    // const { Header, Content, Sider, Footer } = Layout;

    // const [user, setUser] = useState(); // vendor staff or local ONLY or error
    // const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    // const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // // fetch vendor staff OR local profile details
    // useEffect(() => {
    //     const fetchData = async () => {
    //         let user_id = JSON.parse(localStorage.getItem("user"))["user_id"];
    //         const response = await getUserProfile(user_id);
    //         if (response.status) {
    //             setUser(response.data);
    //             console.log(response.data);
    //         } else {
    //             console.log("User profile data not fetched!");
    //         }
    //     }

    //     fetchData();
    // }, [])

    // // when the edit profile button is clicked
    // function onClickEditProfile() {
    //     setIsViewProfile(false);
    // }

    // // when user submits the edit profile details form
    // async function onSubmitVendorStaffProfileButton(values) {
        
    //     let response = await editUserProfile({...values, user_id: user.user_id, user_type: user.user_type});
    //     console.log(response);
    //     if (response.status) {
    //         setUser(response.data);
    //         toast.success('Vendor staff profile changed successfully!', {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 1500
    //         });
    //         setIsViewProfile(true);

    //     } else {
    //         console.log("Vendor staff profile not editted!");
    //         toast.error(response.data.errorMessage, {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 1500
    //         });
    //     }
    // }

    // // when cancel edit profile details
    // function onCancelVendorStaffProfileButton() {
    //     setIsViewProfile(true);
    // }

    // // when the edit password button is clicked
    // function onClickEditPasswordButton() {
    //     setIsChangePasswordModalOpen(true);
    // }

    // // close edit password modal
    // function onClickCancelEditPasswordButton() {
    //     setIsChangePasswordModalOpen(false);
    // }

    // // when user edits password
    // async function onClickSubmitNewPassword(val) {
    //     if (val.oldPassword && val.newPasswordOne === val.newPasswordTwo) {
    //         let response = await editUserPassword(user.user_id, val.oldPassword, val.newPasswordOne);
    //         if (response.status) {
    //             toast.success('Password changed successfully!', {
    //                 position: toast.POSITION.TOP_RIGHT,
    //                 autoClose: 1500
    //             });
    //             setIsChangePasswordModalOpen(false);
            
    //         } else {
    //             toast.error(response.data.errorMessage, {
    //                 position: toast.POSITION.TOP_RIGHT,
    //                 autoClose: 1500
    //             });
    //         }

    //     } else {
    //         toast.error('New password does not match!', {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 1500
    //         });
    //     }
    // }

    // return user ? (
    //     <div>
    //         {/* view profile data */}
    //         {isViewProfile && 
    //             <Layout style={styles.layout}>
    //                 <CustomHeader text={"Header"}/>
    //                 <Layout style={{ padding: '0 24px 24px' }}>
    //                     <Content style={styles.content}>
    //                         {user.email}
    //                         <br />
    //                         {user.name}
    //                         <br />
    //                         {user.user_type === 'VENDOR_STAFF' && user.position}
    //                         {user.user_type === 'LOCAL' && user.country_code}
    //                         <br />
    //                         {user.user_type === 'VENDOR_STAFF' && user.is_master_account && <p>Master Account</p>}
    //                         {user.user_type === 'VENDOR_STAFF' && !user.is_master_account && <p>Not Master Account</p>}
    //                         {user.user_type === 'LOCAL' && user.mobile_num}
    //                         <br />
    //                         {user.user_type === 'LOCAL' && user.date_of_birth}
    //                         {user.user_type === 'LOCAL' && <br />}
    //                         {user.user_type === 'LOCAL' && user.nric_num}
    //                         {user.user_type === 'LOCAL' && <br />}
    //                         {user.user_type === 'LOCAL' && user.wallet_balance}
    //                         {user.user_type === 'LOCAL' && <br />}
    //                         <CustomButton
    //                             text="Edit Profile"
    //                             icon={<EditFilled />}
    //                             onClick={onClickEditProfile}
    //                         />
    //                         <br />
    //                         <br />
    //                         <CustomButton
    //                             text="Edit Password"
    //                             icon={<EditFilled />}
    //                             onClick={onClickEditPasswordButton}
    //                         />
                            
    //                         {/* other items to be displayed in the future */}
    //                     </Content>
    //                 </Layout>
    //             </Layout>
    //         }

    //         {/* edit vendor staff profile form */}
    //         {user.user_type === "VENDOR_STAFF" && !isViewProfile &&
    //             <Layout style={styles.layout}>
    //                 <CustomHeader text={"Header"}/>
    //                 <Layout style={{ padding: '0 24px 24px' }}>
    //                     <Content style={styles.content}>
    //                     <Form
    //                         name="basic"
    //                         labelCol={{ span: 8 }}
    //                         wrapperCol={{ span: 16 }}
    //                         style={{ maxWidth: 600 }}
    //                         required={true}
    //                         requiredMark={true}
    //                         onFinish={onSubmitVendorStaffProfileButton}
    //                     >
    //                         <Form.Item
    //                         label="Email"
    //                         name="email"
    //                         initialValue={user.email}
    //                         rules={[{ required: true, message: 'Please enter a valid email!' }]}
    //                         >
    //                         <Input />
    //                         </Form.Item>

    //                         <Form.Item
    //                         label="Name"
    //                         name="name"
    //                         initialValue={user.name}
    //                         rules={[{ required: true, message: 'Please enter a valid name!' }]}
    //                         >
    //                         <Input />
    //                         </Form.Item>

    //                         <Form.Item
    //                         label="Position"
    //                         name="position"
    //                         initialValue={user.position}
    //                         rules={[{ required: true, message: 'Please enter a valid position!' }]}
    //                         >
    //                         <Input />
    //                         </Form.Item>

    //                         <Form.Item
    //                         label="Master Account"
    //                         name="is_master_account"
    //                         initialValue={user.is_master_account ? "Yes" : "No"}
    //                         rules={[{ required: true, message: 'Please enter a valid name!' }]}
    //                         >
    //                         <Input disabled={true}/>
    //                         </Form.Item>

    //                         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    //                             <Button type="primary" htmlType="submit">
    //                                 Submit
    //                             </Button>
    //                         </Form.Item>
    //                         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
    //                             <CustomButton 
    //                                 text="Cancel"
    //                                 // icon
    //                                 onClick={onCancelVendorStaffProfileButton}
    //                             />
    //                         </Form.Item>
    //                     </Form>
    //                     </Content>
    //                 </Layout>
    //             </Layout>
    //         }

    //         {/* edit password pop-up */}
    //         {isChangePasswordModalOpen && 
    //             <EditPasswordModal 
    //                 isChangePasswordModalOpen={isChangePasswordModalOpen}
    //                 onClickSubmitNewPassword={onClickSubmitNewPassword}
    //                 onClickCancelEditPasswordButton={onClickCancelEditPasswordButton}
    //             />
    //         }

    //         {/* Edit profile & password toast */}
    //         <ToastContainer />
    //     </div>
    // ) : (
    //     <div></div>
    // )
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