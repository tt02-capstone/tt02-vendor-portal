import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import {
  Button,
  Form,
  Input,
  Spin,
  Row
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { passwordResetStageTwo, passwordResetStageThree } from '../redux/userRedux';

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
  const [otpForm] = Form.useForm();
  const [passwordResetForm] = Form.useForm();
  const navigate = useNavigate(); // route navigation 
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  async function handleOtpVerification(values) {
    setLoading(true);
    let response = await passwordResetStageTwo(values.email, values.otp);
    if (response.status) {
      toast.success('OTP verified successfully.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      setEmail(values.email);
      setLoading(false);
      setOtpVerified(true);
    } else {
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      setLoading(false);
      setOtpVerified(false);
    }
  }

  async function handlePasswordReset(values) {
    setLoading(true);
    let response = await passwordResetStageThree(email, values.password);
    if (response.status) {
      toast.success('Password changed successfully.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      passwordResetForm.resetFields();
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
      <CustomHeader text={"Password Reset"} />
      <Row align='middle' justify='center'>
        <Spin tip="Processing Request" size="large" spinning={loading}>
          {!otpVerified ? (
            <Content style={styles.content}>
              <h2>Reset WithinSG account password</h2>
              <p>Key in the One-Time Password (OTP) sent to your email.</p>
              <br />
              <Form
                {...formItemLayout}
                form={otpForm}
                name="otpVerification"
                onFinish={handleOtpVerification}
                style={{
                  maxWidth: 600,
                }}
                scrollToFirstError
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Email is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="otp"
                  label="OTP"
                  rules={[
                    {
                      required: true,
                      message: "OTP is required",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <div style={{ textAlign: "right" }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Verify OTP
                    </Button>
                  </div>
                </Form.Item>
                <ToastContainer />
              </Form>
            </Content>
          ) : (
            <Content style={styles.content}>
              <h2>Reset WithinSG account password</h2>
              <p>Key in the new password that you would like to change to.</p>
              <br />
              <Form
                {...formItemLayout}
                form={passwordResetForm}
                name="passwordReset"
                onFinish={handlePasswordReset}
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
          )}

        </Spin>
      </Row>
    </Layout>
  );
}

export default PasswordReset;