import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import {
  Button,
  Form,
  Input,
  Spin
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

function PasswordReset() {
  const [form] = Form.useForm();
  const baseURL = "http://localhost:8080/vendor";
  const navigate = useNavigate(); // route navigation 
  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    setLoading(true);
    axios.post(`${baseURL}/passwordResetStageTwo/${new URLSearchParams(document.location.search)
      .get('token')}/${values.password}`).then((response) => {
        console.log(response);
        if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
          toast.error(response.data.errorMessage, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
          setLoading(false);
        } else {
          toast.success('Password changed successfully.', {
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
      <CustomHeader text={"Password Reset"} />

      <Spin tip="Processing Request" size="large" spinning={loading}>
        <Content style={styles.content}>
          <h2>Reset WithinSG account password</h2>
          <p>Key in the new password that you would like to change to.</p>
          <br />
          <Form
            {...formItemLayout}
            form={form}
            name="passwordReset"
            onFinish={onFinish}
            style={{
              maxWidth: 600,
            }}
            scrollToFirstError
          >
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

            <Form.Item {...tailFormItemLayout}>
              <div style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Reset Password
                </Button>
              </div>
            </Form.Item>
            <ToastContainer />
          </Form>
        </Content>
      </Spin>
    </Layout>

  );
}

export default PasswordReset;