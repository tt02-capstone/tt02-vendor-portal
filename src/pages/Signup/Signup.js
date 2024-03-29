import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Row,
  Col, Spin
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createVendor } from '../../redux/vendorRedux';
import TermsAndConditionsModal from './TermsAndConditionsModal';
import { validateContactNo, validateCountryCode, validateOnlyAlphabets, validatePassword } from '../../helper/validation';
import CustomButton from '../../components/CustomButton';

const breadCrumbItems = [
  {
      title: 'Vendor Registration',
  },
]

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

function Signup() {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // route navigation 
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const showTermsAndConditionsModal = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };

  async function onFinish(values) {
    setLoading(true);
    let response = await createVendor(values);
    console.log(response);
    if (response.status) {
      toast.success('Application submitted!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      form.resetFields();
      setLoading(false);
      setTimeout(() => {
        navigate('/')
      }, 2000);
    } else {
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      setLoading(false);
    }
  }
  
  return (
    <Layout style={styles.layout}>
      <CustomHeader items={breadCrumbItems} />
      <Row align='middle' justify='center'>
        <Spin tip="Submitting Application" size="large" spinning={loading}>
          <Content style={styles.content}>
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              style={{
                maxWidth: 600,
              }}
              scrollToFirstError
            >
              <Form.Item
                name="business_name"
                label="Company Name"
                rules={[
                  {
                    required: true,
                    message: 'Company name is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="vendor_type"
                label="Type of Service"
                rules={[
                  {
                    required: true,
                    message: 'Type of service is required',
                  },
                ]}>
                <Select>
                  <Select.Option value="ATTRACTION">Attraction</Select.Option>
                  <Select.Option value="ACCOMMODATION">Accommodation</Select.Option>
                  <Select.Option value="RESTAURANT">Restaurant</Select.Option>
                  <Select.Option value="TELECOM">Telecom</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="service_description"
                label="Service Description"
                tooltip="Tell us about the service you provide"
                rules={[
                  {
                    required: true,
                    message: 'Service description is required',
                  },
                ]}
              >
                <Input.TextArea showCount maxLength={300} />
              </Form.Item>

              <Form.Item
                name="poc_name"
                label="POC Name"
                rules={[
                  {
                    required: true,
                    message: 'POC name is required',
                  },
                  { validator: validateOnlyAlphabets },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="poc_position"
                label="POC Position"
                rules={[
                  {
                    required: true,
                    message: 'POC position is required',
                  },
                  { validator: validateOnlyAlphabets },
                ]}
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
                        rules={[
                          { required: true, message: 'Country code is required' },
                          { validator: validateCountryCode },
                        ]}
                      >
                        <Input placeholder="+65" />
                      </Form.Item>
                    </Col>
                    &nbsp;&nbsp;&nbsp;
                    <Col span={19}>
                      <Form.Item
                        name="poc_mobile_num"
                        noStyle
                        rules={[
                          { required: true, message: 'Contact number is required' },
                          { validator: validateContactNo },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: 'email',
                    message: 'Enter a valid email address',
                  },
                  {
                    required: true,
                    message: 'Email is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: 'Password is required',
                  },
                  { validator: validatePassword },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Password is required',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('This field is required')),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read and agree with the <a href="#" onClick={showTermsAndConditionsModal}>terms and conditions</a>
                  <TermsAndConditionsModal visible={modalVisible} onClose={hideModal} />
                </Checkbox>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <div style={{ textAlign: "right" }}>
                  <CustomButton text="Back" style={{width: '75px'}} onClick={() => {return navigate('/')}}/>
                  <Button type="primary" htmlType="submit" style={{marginLeft: '20px'}} loading={loading}>
                    Submit Application
                  </Button>
                </div>
              </Form.Item>
              <ToastContainer />
            </Form>
          </Content>
        </Spin>
      </Row>
    </Layout>
  );
}

export default Signup;