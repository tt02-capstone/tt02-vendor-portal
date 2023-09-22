import React, { useState, useEffect, useContext } from "react";
import { Layout, Spin, Form, Input, Button, Row, Col, DatePicker, Divider, Typography } from 'antd';
import dayjs, { Dayjs } from "dayjs";
import moment from 'moment';
import { Navigate, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { ToastContainer, toast } from 'react-toastify';
import EditPasswordModal from "./EditPasswordModal";
import { editPassword } from "../../redux/userRedux";
import { uploadNewProfilePic } from "../../redux/userRedux";
import { editVendorStaffProfile } from "../../redux/vendorStaffRedux"
import { getVendorTotalEarnings, getTourTotalEarningForLocal } from "../../redux/paymentRedux";
import { editLocalProfile } from "../../redux/localRedux";
import { UserOutlined, KeyOutlined, BankOutlined, DollarOutlined } from "@ant-design/icons";
import CustomFileUpload from "../../components/CustomFileUpload";
import { commaWith2DP } from "../../helper/numberFormat";
import AWS from 'aws-sdk';
import AddBankAccountModal from "./AddBankAccountsModal";
import { loadStripe  } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
import { vendorStaffApi,paymentApi } from "../../redux/api";
import WalletModal from "./WalletModal";
import {AuthContext, TOKEN_KEY} from "../../redux/AuthContext";
import axios from 'axios';

window.Buffer = window.Buffer || require("buffer").Buffer;

const { Text } = Typography;

export default function Profile() {

    const stripe = useStripe();

    const navigate = useNavigate();
    const dateFormat = "DD-MM-YYYY";
    const { Header, Content, Sider, Footer } = Layout;
    const authContext = useContext(AuthContext);

    const viewProfileBreadcrumbItems = [
      {
        title: 'Profile',
      },
      {
        title: 'View Profile',
      },
    ];

    const editProfileBreadcrumbItems = [
      {
        title: 'Profile',
      },
      {
        title: 'Edit Profile'
      }
    ];

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))); // vendor staff or local ONLY or error
    const [isViewProfile, setIsViewProfile] = useState(true); // view or edit profile

    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false); // change password boolean
    const [isBAModalOpen, setIsBAModalOpen] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]); // bank accounts
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);


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
                "password": values.password,
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
            "password": values.password,
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
              "password": values.password,
              "date_of_birth": dayjs(values.date_of_birth).format("YYYY-MM-DD"),
              "country_code": values.country_code,
              "mobile_num": values.mobile_num,
          }
          response = await editLocalProfile(obj);
        }
        
        if (response.status) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem(TOKEN_KEY, response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
            authContext.setAuthState({
                accessToken: response.data.token,
                authenticated: true
            });
            setUser(response.data.user);

            toast.success('User profile changed successfully!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setIsViewProfile(true);
            form.setFieldValue("password", "");

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
        form.setFieldValue("password", "");
    }

    // when the edit password button is clicked
    function onClickEditPasswordButton() {
        setIsChangePasswordModalOpen(true);
    }

    // close edit password modal
    function onClickCancelEditPasswordButton() {
        setIsChangePasswordModalOpen(false);
    }

    function onClickManageBAButton() {
      setIsBAModalOpen(true);
    }

    function onClickCancelManageBAButton() {
      setIsBAModalOpen(false);
     }


    function onClickCancelTopUpButton() {
     setIsTopUpModalOpen(false);
    }

    function onClickTopUpButton() {
      setIsTopUpModalOpen(true);
    }


    function onClickCancelWithdrawButton() {
     setIsWithdrawModalOpen(false);
    }

    function onClickWithdrawButton() {
      setIsWithdrawModalOpen(true);
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

    async function onClickSubmitNewBankAccount(bankAccountDetails) {

      const token = await stripe.createToken('bank_account',{
        
          country: 'SG',
          currency: 'sgd',
          routing_number: bankAccountDetails.routingNumber,
          account_number: bankAccountDetails.bankAccountNumber,
        
      });

      console.log(token)

      const userId = parseInt(user.user_id);

      const bank_account_token = token.token.id

      const response = await (user.user_type === 'VENDOR_STAFF' ? vendorStaffApi : paymentApi).
      post(`/addBankAccount/${userId}/${bank_account_token}`);
      if (response.status) {

        setIsBAModalOpen(false);
        window.location.reload(); //Temporary measure will directly update bankAccount state
        toast.success('Bank account created successfully!', {
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

  async function onClickSubmitTopUp(topUpDetails) {

    const userId = parseInt(user.user_id);
    const amount = topUpDetails.amount;
    const response = await (user.user_type === 'VENDOR_STAFF' ? vendorStaffApi : paymentApi).
    post(`/topUpWallet/${userId}/${amount}`);
    if (response.status) {

      setIsTopUpModalOpen(false);
      //window.location.reload(); //Temporary measure will directly update bankAccount state
      toast.success('Amount topped up successfully!', {
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

async function onClickSubmitWithdraw(withdrawalDetails) {
  const bank_account_id = withdrawalDetails.bankAccountId;
  const amount = withdrawalDetails.amount;
  const userId = parseInt(user.user_id);

  const response = await (user.user_type === 'VENDOR_STAFF' ? vendorStaffApi : paymentApi).
  post(`/withdrawWallet/${userId}/${bank_account_id}/${amount}`);
  if (response.status) {

    setIsTopUpModalOpen(false);
    //window.location.reload(); //Temporary measure will directly update bankAccount state
    toast.success('Amount topped up successfully!', {
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

  const deleteBankAccount = async (bank_account_id) => {
    try {
      const userId = parseInt(user.user_id);
      const response = await (user.user_type === 'VENDOR_STAFF' ? vendorStaffApi : paymentApi).
      put(`/deleteBankAccount/${userId}/${bank_account_id}`);
      
      if (response.status) {
        
        window.location.reload(); //Temporary measure will directly update bankAccount state

        toast.success('Bank account deleted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
      });

    } else {
        toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
        });
    }
    } catch (error) {
      console.error('An error occurred while deleting the bank account:', error);
    }
  }

    // total earnings to date for vendor and local
    const [vendorTotalEarnings, setVendorTotalEarnings] = useState();
    const [localTotalEarnings, setLocalTotalEarnings] = useState();

    useEffect(() => {

      const fetchData = async () => {
        
        if (user.user_type === 'VENDOR_STAFF') {
          let response = await getVendorTotalEarnings(user.vendor.vendor_id);
          if (response.status) {
            setVendorTotalEarnings(response.data);
          } else {
              console.log("Vendor staff total earnings not shown!");
          }
        
        } else if (user.user_type === 'LOCAL') {
          let response = await getTourTotalEarningForLocal(user.user_id);
          if (response.status) {
              setLocalTotalEarnings(response.data);
          } else {
              console.log("Tour guide total earnings not shown!");
          } 
        }
      }
      
      fetchData();
    },[user]);

    useEffect(() => {
      // bank accounts
      async function getBankAccounts() {

        const userId = parseInt(user.user_id);

        const response = await (user.user_type === 'VENDOR_STAFF' ? vendorStaffApi : paymentApi).get(`/getBankAccounts/${userId}`);

        if (response.status) {
          const bankAccounts = response.data;
          //console.log(bankAccounts);
          setBankAccounts(bankAccounts);
      
      } else {
          toast.error(response.data.errorMessage, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
          });
      }
    }

    getBankAccounts();
  }, []);
  
  // upload image
  const S3BUCKET ='tt02/user'; // if you want to save in a folder called 'attraction', your S3BUCKET will instead be 'tt02/attraction'
  const TT02REGION ='ap-southeast-1';
  const ACCESS_KEY ='AKIART7KLOHBGOHX2Y7T';
  const SECRET_ACCESS_KEY ='xsMGhdP0XsZKAzKdW3ED/Aa5uw91Ym5S9qz2HiJ0';

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.file;
    setFile(file);
    toast.success(e.file.name + ' selected!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1500
    });
  };

  const uploadFile = async () => {
      let finalURL;
      if (file) {
          finalURL = "user_" + user.user_id + "_" + file.name;
          const S3_BUCKET = S3BUCKET;
          const REGION = TT02REGION;
      
          AWS.config.update({
              accessKeyId: ACCESS_KEY,
              secretAccessKey: SECRET_ACCESS_KEY,
          });
          const s3 = new AWS.S3({
              params: { Bucket: S3_BUCKET },
              region: REGION,
          });
      
          const params = {
              Bucket: S3_BUCKET,
              Key: finalURL,
              Body: file,
          };
      
          var upload = s3
              .putObject(params)
              .on("httpUploadProgress", (evt) => {
              console.log(
                  "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
              );
              })
              .promise();
      
          await upload.then((err, data) => {
              console.log(err);
          });

          let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/' + finalURL;
          const fetchData = async (userId, str) => {
              const response = await uploadNewProfilePic({user_id: userId, profile_pic: str});
              if (response.status) {
                  console.log("image url saved in database")
                  localStorage.setItem("user", JSON.stringify(response.data));
                  setUser(response.data);
                  // change local storage
                  setFile(null);
                  toast.success('User profile image successfully uploaded!', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });

              } else {
                  console.log("User image URL in database not updated!");
              }
          }

          fetchData(user.user_id, str);
          setFile(null);
      } else {
        toast.error('Please select an image!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
        });
      }
    };

    return user ? (
        <div>
            {/* view profile data */}
            {isViewProfile && 
                <Layout style={styles.layout}>
                    <CustomHeader items={viewProfileBreadcrumbItems}/>
                    <Content style={styles.content}>
                      <Divider orientation="left" style={{fontSize: '150%' }} >User Profile</Divider>
                        {user.user_type === 'VENDOR_STAFF' && 
                          <Row>
                            <Col span={8} style={{marginLeft: '50px'}}>
                              <img 
                                  src={user.profile_pic ? user.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}
                                  style={{borderRadius: '50%', width: '200px', height: '200px'}}
                              />
                            </Col>
                            <Col span={8} >
                              <Row style={{fontSize: '150%', marginBottom: '5px'}}>Name: {user.name}</Row>
                              <Row style={{fontSize: '150%', marginBottom: '5px'}}>Email: {user.email}</Row>
                              <Row span={8} style={{fontSize: '150%', marginBottom: '5px'}}>Position in {user.vendor.business_name}: {user.position}</Row>
                              {user.is_master_account && <Row span={8} style={{fontSize: '150%', marginBottom: '5px'}}>Master Account: Yes</Row>}
                              {!user.is_master_account && <Row span={8} style={{fontSize: '150%', marginBottom: '5px'}}>Master Account: No</Row>}
                            </Col>
                            <Col>
                              <Row>
                                <CustomFileUpload handleFileChange={handleFileChange} uploadFile={uploadFile}/>
                              </Row>
                              <Row>
                                <CustomButton
                                  text="Edit Profile"
                                  style={{marginBottom: '5px', marginTop: '5px'}}
                                  icon={<UserOutlined />}
                                  onClick={onClickEditProfile}
                                />
                              </Row>
                              <Row>
                                <CustomButton
                                    text="Edit Password"
                                    style={{marginBottom: '5px'}}
                                    icon={<KeyOutlined />}
                                    onClick={onClickEditPasswordButton}
                                />
                              </Row>
                            </Col>
                          </Row>
                        }

                        
                        {/* master vendor staff specific */}
                        {user.user_type === 'VENDOR_STAFF' && user.is_master_account === true && 
                          <div>
                            <Divider orientation="left" style={{fontSize: '150%'}}>Vendor Profile</Divider>
                            <Row>
                              <Col span={8} style={{fontSize: '150%'}}>Business name: {user.vendor.business_name}</Col>
                              <Col span={8} style={{fontSize: '150%'}}>Person-in-charge name: {user.vendor.poc_name}</Col>   
                            </Row>
                            <Row>
                              <Col span={8} style={{fontSize: '150%',}}>Person-in-charge position: {user.vendor.poc_position}</Col>
                              <Col span={8} style={{fontSize: '150%'}}>Person-in-charge contact: {user.vendor.country_code + ' ' + user.vendor.poc_mobile_num}</Col>   
                            </Row>
                            <Row>
                              <Col span={8} style={{fontSize: '150%'}}>Total earnings to date: ${commaWith2DP(vendorTotalEarnings)}</Col>   
                            </Row>
                        </div>
                        }

                        {user.user_type === 'VENDOR_STAFF' &&
                          <div>
                            <Divider orientation="left" style={{fontSize: '150%' }} >Bank Account, Credit Card and Wallet</Divider>
                            <Row>
                              <Col span={3}>
                                <CustomButton text="Add Bank Account" icon={<BankOutlined />} onClick={onClickManageBAButton} />
                              </Col>
                              <Col span={2}>
                                <Button type="primary" icon={<DollarOutlined />} onClick={onClickTopUpButton}>Top Up</Button>
                              </Col>
                              <Col span={3}>
                                <Button type="primary" icon={<DollarOutlined />} onClick={onClickWithdrawButton}>Withdraw</Button>
                              </Col>
                            </Row>
                            <Row>
                              <ul>
                                {bankAccounts.map((account) => (
                                  <li key={account.id} style={{ display: 'flex', alignItems: 'center' }}>
                                    Bank Account Number: *****{account.last4}
                                    <button 
                                      onClick={() => deleteBankAccount(account.id)}
                                      style={{ marginLeft: '10px' }}
                                    >
                                      Delete
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </Row>
                          </div>
                        }

                        {/* local specific */}
                        {user.user_type === 'LOCAL' &&
                          <div>
                            <Row>
                            <Col span={8} style={{marginLeft: '50px'}}>
                              <img 
                                  src={user.profile_pic ? user.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}
                                  style={{borderRadius: '50%', width: '200px', height: '200px'}}
                              />
                            </Col>
                            <Col span={8} >
                              <Row style={{fontSize: '150%'}}>Name: {user.name}</Row>
                              <Row style={{fontSize: '150%'}}>Email: {user.email}</Row>
                              <Row span={8} style={{fontSize: '150%'}}>Mobile number: {user.country_code + " " + user.mobile_num}</Row>
                              <Row span={8} style={{fontSize: '150%'}}>Date of birth: {moment(user.date_of_birth).format('LL')}</Row>
                            </Col>
                            <Col>
                              <Row>
                                <CustomFileUpload handleFileChange={handleFileChange} uploadFile={uploadFile}/>
                              </Row>
                              <Row>
                                <CustomButton
                                  text="Edit Profile"
                                  style={{marginBottom: '5px', marginTop: '5px'}}
                                  icon={<UserOutlined />}
                                  onClick={onClickEditProfile}
                                />
                              </Row>
                              <Row>
                                <CustomButton
                                    text="Edit Password"
                                    style={{marginBottom: '5px'}}
                                    icon={<KeyOutlined />}
                                    onClick={onClickEditPasswordButton}
                                />
                              </Row>
                            </Col>
                          </Row>
                          
                          <Divider orientation="left" style={{fontSize: '150%' }} >Bank Account, Credit Card and Wallet</Divider>
                          <Row>
                            <Col span={8} style={{fontSize: '150%'}}>Wallet balance: ${commaWith2DP(user.wallet_balance)}</Col>
                            <Col span={8} style={{fontSize: '150%'}}>Total earnings to date: ${commaWith2DP(localTotalEarnings)}</Col>   
                          </Row>
                          </div>
                        }
                        
                        {/* other items to be displayed in the future */}
                    </Content>
                </Layout>
            }

            {/* edit not master vendor staff profile form */}
            {user.user_type === "VENDOR_STAFF" && user.is_master_account !== true && !isViewProfile &&
               <Layout style={styles.layout}>
                <CustomHeader items={editProfileBreadcrumbItems}/>
                <Row align='middle' justify='center'>
                 <Content style={styles.formContent}>
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
                        label="Password (Validation)"
                        name="password"
                        tooltip="Password is required for validation. This is not to change password!"
                        rules={[{ required: true, message: 'Password is required!' }]}
                        >
                        <Input.Password placeholder="Enter password" />
                      </Form.Item>

                      <Form.Item {...tailFormItemLayout}>
                        <div style={{ textAlign: "right" }}>
                          <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                          </Button>
                          <CustomButton text="Cancel" onClick={onCancelVendorStaffProfileButton} style={{marginLeft: '10px'}}/>
                        </div>
                      </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Row>
              </Layout>
            }

            {/* edit vendor staff master profile form */}
            {user.user_type === "VENDOR_STAFF" && user.is_master_account === true && !isViewProfile &&
                <Layout style={styles.layout}>
                  <CustomHeader items={editProfileBreadcrumbItems}/>
                  <Row align='middle' justify='center'>
                    <Content style={styles.formContent}>
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

                        <Form.Item
                          label="Password (Validation)"
                          name="password"
                          tooltip="Password is required for validation. This is not to change password!"
                          rules={[{ required: true, message: 'Password is required!' }]}
                        >
                          <Input.Password placeholder="Enter password" />
                        </Form.Item>

                        <Form.Item {...tailFormItemLayout}>
                          <div style={{ textAlign: "right" }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                              Submit
                            </Button>
                            <CustomButton text="Cancel" style={{marginLeft: '20px'}}onClick={onCancelVendorStaffProfileButton} />
                          </div>
                        </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Row>
              </Layout>
            }

            {/* edit local profile form */}
            {user.user_type === "LOCAL" && !isViewProfile &&
            <Layout style={styles.layout}>
              <CustomHeader items={editProfileBreadcrumbItems}/>
              <Row align='middle' justify='center'>
                <Content style={styles.formContent}>
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
                        <DatePicker style={{width: '100%'}} format={dateFormat}
                          disabledDate={(current) => {
                            let customDate = moment().add(1, "days").format("YYYY-MM-DD");
                            return current >= moment(customDate, "YYYY-MM-DD");
                          }} 
                        />
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

                      <Form.Item
                        label="Password (Validation)"
                        name="password"
                        tooltip="Password is required for validation. This is not to change password!"
                        rules={[{ required: true, message: 'Password is required!' }]}
                        >
                        <Input.Password placeholder="Enter password" />
                      </Form.Item>

                      <Form.Item>
                        <div style={{ textAlign: "right", justifyContent: 'flex-end'}}>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                          <CustomButton text="Cancel" style={{marginLeft: '20px'}} onClick={onCancelVendorStaffProfileButton} />
                        </div>
                      </Form.Item>
                      <ToastContainer />
                    </Form>
                  </Content>
                </Row>
              </Layout>
            }

            {/* edit password pop-up */}
            {isChangePasswordModalOpen && 
                <EditPasswordModal 
                    isChangePasswordModalOpen={isChangePasswordModalOpen}
                    onClickSubmitNewPassword={onClickSubmitNewPassword}
                    onClickCancelEditPasswordButton={onClickCancelEditPasswordButton}
                />
            }


            {isBAModalOpen && 
                <AddBankAccountModal 
                    isBAModalOpen={isBAModalOpen}
                    onClickSubmitNewBankAccount={onClickSubmitNewBankAccount}
                    onClickCancelManageBAButton={onClickCancelManageBAButton}
                />
            }

{isTopUpModalOpen && 
                <WalletModal
                    title="Top Up" 
                    isModalOpen={isTopUpModalOpen}
                    onClickSubmitButton={onClickSubmitTopUp}
                    onClickCancelButton={onClickCancelTopUpButton}
                />
            }

{isWithdrawModalOpen && 
                <WalletModal
                    title="Withdraw"
                    isModalOpen={isWithdrawModalOpen}
                    onClickSubmitButton={onClickSubmitWithdraw}
                    onClickCancelButton={onClickCancelWithdrawButton}
                    bankAccounts={bankAccounts}
                />
            }

            {/* Edit profile & password toast */}
            
            <ToastContainer />
        </div>
    ) : (
        <div></div>
    )
}


const styles = {
  layout: {
    minHeight: '100vh',
    minWidth: '90vw',
  },
  content: {
    margin: '1vh 3vh 1vh 3vh',
  },
  formContent: {
    margin: '3% 40% 3% 10%',
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }
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