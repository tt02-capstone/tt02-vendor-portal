import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/CustomHeader";
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
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const baseURL = "http://localhost:8080/vendor";
  const navigate = useNavigate(); // route navigation 
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);
    axios.post(`${baseURL}/createVendor`, {
      name: values.poc_name,
      email: values.email,
      password: values.password,
      is_blocked: false,
      is_master_account: true,
      position: values.poc_position,
      vendor: {
        business_name: values.business_name,
        poc_name: values.poc_name,
        poc_position: values.poc_position,
        country_code: values.country_code,
        poc_mobile_num: values.poc_mobile_num,
        wallet_balance: 0,
        application_status: 'PENDING',
        vendor_type: values.vendor_type,
        service_description: values.service_description
      }
    }).then((response) => {
      console.log(response);
      if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
        toast.error(response.data.errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
        setLoading(false);
      } else {
        toast.success('Application submitted!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        });
        form.resetFields();
        setLoading(false);
        setTimeout(() => {
          navigate('/')
        }, 2000);
      }
    })
      .catch((error) => {
        console.error("Axios Error : ", error)
      });
  };

  return (
    <Layout style={styles.layout}>
      <CustomHeader text={"Vendor Registration"} />
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
                <Input.TextArea showCount maxLength={100} />
              </Form.Item>

              <Form.Item
                name="poc_name"
                label="POC Name"
                rules={[
                  {
                    required: true,
                    message: 'POC name is required',
                  },
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
                        rules={[{ required: true, message: 'Country code is required' }]}
                      >
                        <Input placeholder="+65" />
                      </Form.Item>
                    </Col>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Col span={19}>
                      <Form.Item
                        name="poc_mobile_num"
                        noStyle
                        rules={[{ required: true, message: 'Contact number is required' }]}
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
                  I have read and agree with the <a href="">terms and conditions</a>
                </Checkbox>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <div style={{ textAlign: "right" }}>
                  <Button type="primary" htmlType="submit" loading={loading}>
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