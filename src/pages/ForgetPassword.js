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
import { passwordResetStageOne } from '../redux/vendorStaffRedux';

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
    const navigate = useNavigate(); // route navigation 
    const [loading, setLoading] = useState(false);
    async function onFinish(values) {
        setLoading(true);
        let response = await passwordResetStageOne(values.email);
        if (response.status) {
            toast.success('Please check your email for the instructions to reset your password.', {
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
            <CustomHeader text={"Forget Password"} />
            <Row align='middle' justify='center'>
                <Spin tip="Processing Request" size="large" spinning={loading}>
                    <Content style={styles.content}>
                        <h2>Have you forgotten your WithinSG account password?</h2>
                        <p>Enter your email below and follow the instructions sent to you to reset your password.</p>
                        <br />
                        <Form
                            {...formItemLayout}
                            form={form}
                            name="forgetPassword"
                            onFinish={onFinish}
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

                            <Form.Item {...tailFormItemLayout}>
                                <div style={{ textAlign: "right" }}>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        Submit
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

export default PasswordReset;