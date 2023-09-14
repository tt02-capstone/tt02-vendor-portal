import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Row, Col, DatePicker } from 'antd';
import dayjs, { Dayjs } from "dayjs";
import moment from 'moment';
import { EditFilled } from "@ant-design/icons";
import { Navigate, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";
import { editPassword } from "../../redux/userRedux";
import { editVendorStaffProfile } from "../../redux/vendorStaffRedux"
import { editLocalProfile } from "../../redux/localRedux";

export default function Profile() {

    const navigate = useNavigate();
    const dateFormat = "DD-MM-YYYY";
    const { Header, Content, Sider, Footer } = Layout;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // vendor staff or local ONLY or error
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean

    // when the edit profile button is clicked
    function onClickEditProfile() {
        setIsViewProfile(false);
    }

    // when user submits the edit profile details form
    async function onSubmitEditProfileButton(values) {
        let response;
        if (user.user_type === 'VENDOR_STAFF' && user.is_master_account) {
            let obj = {
                "user_id": user.user_id,
                "name": values.name,
                "email": values.email,
                "position": values.position,
                "vendor": {
                    "vendor_id" : user.vendor.vendor_id,
                    "business_name": values.business_name,
                    "poc_name": values.poc_name,
                    "poc_position": values.poc_position,
                    "country_code": values.country_code,
                    "poc_mobile_num": values.poc_mobile_num,
                    "service_description": values.service_description,
                }
            }
            response = await editVendorStaffProfile(obj);

        } else if (user.user_type === 'VENDOR_STAFF' && !user.is_master_account) {
          let obj = {
            "user_id": user.user_id,
            "name": values.name,
            "email": values.email,
            "position": values.position,
            "vendor": {
                "vendor_id" : user.vendor.vendor_id,
            }
          }
            response = await editVendorStaffProfile(obj);

        } else if (user.user_type === 'LOCAL') {
            let obj = {
                "user_id": user.user_id,
                "name": values.name,
                "email": values.email,
                "date_of_birth": dayjs(values.date_of_birth).format("YYYY-MM-DD"),
                "country_code": values.country_code,
                "mobile_num": values.mobile_num,
            }
            response = await editLocalProfile(obj);
        }
        
        console.log(response);
        if (response.status) {
            setUser(response.data);
            toast.success('User profile changed successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setIsViewProfile(true);

        } else {
            console.log("User profile not editted!");
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // when cancel edit profile details
    function onCancelVendorStaffProfileButton() {
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
            let response = await editPassword(user.user_id, val.oldPassword, val.newPasswordOne);
            if (response.status) {
                toast.success('Password changed successfully!', {
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

    return user ? (
        <div>
            {/* view profile data */}
            {isViewProfile && 
                <Layout style={styles.layout}>
                    <CustomHeader text={"Header"}/>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content style={styles.content}>
                            {user.email}
                            <br />
                            {user.name}
                            <br />

                            {/* local specific */}
                            {user.user_type === 'LOCAL' && user.country_code + " " + user.mobile_num}
                            {user.user_type === 'LOCAL' && <br />}
                            {user.user_type === 'LOCAL' && moment(user.date_of_birth).format('LL')}
                            {user.user_type === 'LOCAL' && <br />}
                            {user.user_type === 'LOCAL' && user.wallet_balance}
                            {user.user_type === 'LOCAL' && <br />}

                            {/* vendor staff specific */}
                            {user.user_type === 'VENDOR_STAFF' && user.position}
                            {user.user_type === 'VENDOR_STAFF' && <br />}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account && <p>Master Account</p>}
                            {user.user_type === 'VENDOR_STAFF' && !user.is_master_account && <p>Not Master Account</p>}
                            {user.user_type === 'VENDOR_STAFF' && <br />}

                            {/* master vendor staff specific */}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <p>Vendor Specifics</p>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && user.vendor.business_name}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && user.vendor.poc_name}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && user.vendor.poc_position}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && user.vendor.country_code + ' ' + user.vendor.poc_mobile_num}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && user.vendor.service_description}
                            {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && <br/>}

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

            {/* edit not master vendor staff profile form */}
            {user.user_type === "VENDOR_STAFF" && user.is_master_account !== true && !isViewProfile &&
                <Row align='middle' justify='center'>
                <Spin tip="Editting Profile" size="large" spinning={loading}>
                  <Content style={styles.content}>
                    <Form
                      {...formItemLayout}
                      form={form}
                      name="masterVendorStaffEditProfile"
                      onFinish={onSubmitEditProfileButton}
                      style={{
                        maxWidth: 600,
                      }}
                      scrollToFirstError
                    >
                      <Form.Item
                        name="email"
                        label="Email"
                        initialValue={user.email}
                        rules={[{ required: true, message: 'Email is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="name"
                        label="Name"
                        initialValue={user.name}
                        rules={[{ required: true, message: 'Name is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="position"
                        label="Position"
                        initialValue={user.position}
                        rules={[{ required: true, message: 'Position is required!'}]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                            label="Master Account"
                            name="is_master_account"
                            initialValue={user.is_master_account ? "Yes" : "No"}
                            >
                        <Input disabled={true}/>
                      </Form.Item>

                      <Form.Item {...tailFormItemLayout}>
                        <div style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                          </Button>
                          <CustomButton text="Cancel" onClick={onCancelVendorStaffProfileButton} />
                        </div>
                      </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Spin>
              </Row>
            }

            {/* edit vendor staff master profile form */}
            {user.user_type === "VENDOR_STAFF" && user.is_master_account === true && !isViewProfile &&
                <Row align='middle' justify='center'>
                <Spin tip="Editting Profile" size="large" spinning={loading}>
                  <Content style={styles.content}>
                    <Form
                      {...formItemLayout}
                      form={form}
                      name="masterVendorStaffEditProfile"
                      onFinish={onSubmitEditProfileButton}
                      style={{
                        maxWidth: 600,
                      }}
                      scrollToFirstError
                    >
                      <Form.Item
                        name="email"
                        label="Email"
                        initialValue={user.email}
                        rules={[{ required: true, message: 'Email is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="name"
                        label="Name"
                        initialValue={user.name}
                        rules={[{ required: true, message: 'Name is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="position"
                        label="Position"
                        initialValue={user.position}
                        rules={[{ required: true, message: 'Position is required!'}]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                            label="Master Account"
                            name="is_master_account"
                            initialValue={user.is_master_account ? "Yes" : "No"}
                            >
                        <Input disabled={true}/>
                      </Form.Item>

                      <Form.Item
                        name="business_name"
                        label="Business Name"
                        initialValue={user.vendor.business_name}
                        rules={[{ required: true, message: 'Business name is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="poc_name"
                        label="POC Name"
                        initialValue={user.vendor.poc_name}
                        rules={[{ required: true, message: 'POC name is required!'}]}
                      >
                        <Input />
                      </Form.Item>
        
                      <Form.Item
                        name="poc_position"
                        label="POC Position"
                        initialValue={user.vendor.poc_position}
                        rules={[{ required: true, message: 'POC position is required!'}]}
                      >
                        <Input />
                      </Form.Item>
        
                      <Form.Item label="POC Contact No">
                        <Input.Group>
                          <Row>
                            <Col span={4}>
                              <Form.Item
                                name="country_code"
                                noStyle
                                initialValue={user.vendor.country_code}
                                rules={[{ required: true, message: 'Country code is required!' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            &nbsp;&nbsp;&nbsp;
                            <Col span={19}>
                              <Form.Item
                                name="poc_mobile_num"
                                noStyle
                                initialValue={user.vendor.poc_mobile_num}
                                rules={[{ required: true, message: 'Mobile number is required!' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Input.Group>
                      </Form.Item>

                      <Form.Item
                        name="service_description"
                        label="Service Description"
                        tooltip="Tell us about the service you provide"
                        initialValue={user.vendor.service_description}
                        rules={[{ required: true, message: 'Service description is required!'}]}
                      >
                        <Input.TextArea showCount maxLength={300} />
                      </Form.Item>

                      <Form.Item {...tailFormItemLayout}>
                        <div style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                          </Button>
                          <CustomButton text="Cancel" onClick={onCancelVendorStaffProfileButton} />
                        </div>
                      </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Spin>
              </Row>
            }

            {/* edit local profile form */}
            {user.user_type === "LOCAL" && !isViewProfile &&
            <Row align='middle' justify='center'>
            <Spin tip="Editting Profile" size="large" spinning={loading}>
                <Content style={styles.content}>
                    <Form
                      {...formItemLayout}
                      form={form}
                      name="localEditProfile"
                      onFinish={onSubmitEditProfileButton}
                      style={{
                        maxWidth: 600,
                      }}
                      scrollToFirstError
                    >
                      <Form.Item
                        name="email"
                        label="Email"
                        initialValue={user.email}
                        rules={[{ required: true, message: 'Email is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="name"
                        label="Name"
                        initialValue={user.name}
                        rules={[{ required: true, message: 'Name is required!'}]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        name="date_of_birth"
                        label="Date of Birth"
                        initialValue={dayjs(user.date_of_birth)}
                        rules={[{ required: true, message: 'Date of birth is required!'}]}
                      >
                        <DatePicker format={dateFormat} />
                      </Form.Item>
        
                      <Form.Item label="Contact No">
                        <Input.Group>
                          <Row>
                            <Col span={4}>
                              <Form.Item
                                name="country_code"
                                noStyle
                                initialValue={user.country_code}
                                rules={[{ required: true, message: 'Country code is required!' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                            &nbsp;&nbsp;&nbsp;
                            <Col span={19}>
                              <Form.Item
                                name="mobile_num"
                                noStyle
                                initialValue={user.mobile_num}
                                rules={[{ required: true, message: 'Mobile number is required!' }]}
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Input.Group>
                      </Form.Item>

                      <Form.Item {...tailFormItemLayout}>
                        <div style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                          </Button>
                          <CustomButton text="Cancel" onClick={onCancelVendorStaffProfileButton} />
                        </div>
                      </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Spin>
              </Row>
            }

            {/* edit password pop-up */}
            {isChangePasswordModalOpen && 
                <EditPasswordModal 
                    isChangePasswordModalOpen={isChangePasswordModalOpen}
                    onClickSubmitNewPassword={onClickSubmitNewPassword}
                    onClickCancelEditPasswordButton={onClickCancelEditPasswordButton}
                />
            }

            {/* Edit profile & password toast */}
            <ToastContainer />
        </div>
    ) : (
        <div></div>
    )
}

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
        },
        wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
  }
  