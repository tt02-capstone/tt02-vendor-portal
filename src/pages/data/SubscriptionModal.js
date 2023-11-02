import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, Switch, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';


export default function SubscriptionModal(props) {
    const { Option } = Select;

    return(
        <div>
            <Modal
                title="Subscribe to Data Dashboard"
                centered
                open={props.isSubModalOpen}
                onCancel={props.onClickCancelManageSubButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitSubscription}
                >
                    <Form.Item
                    label="Subscription Type"
                    labelAlign="left"
                    name="subscriptionType"
                    rules={[{ required: true, message: 'Please select the subscription type' }]}
                    >
                    
                    <Select>
                            <Option value='MONTHLY'>Monthly</Option>
                            <Option value='YEARLY'>Yearly</Option>
                    </Select>
                    </Form.Item>

                    <Form.Item
                    label="Auto Renew"
                    labelAlign="left"
                    name="autoRenew"
                    rules={[{ required: true, message: 'Please indicate whether to auto-renew or not' },]}
                    >
                    <Switch />
                    </Form.Item>

                   

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}