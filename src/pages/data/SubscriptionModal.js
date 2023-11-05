import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, Switch, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';


export default function SubscriptionModal(props) {
    const [form] = Form.useForm();
    const { Option } = Select;
    let initialValues = {};
    console.log(props)
  if (props.subscriptionPlan) {
    initialValues.subscriptionType = props.subscriptionPlan;
  }

  if (props.autoRenewal !== null) {
    
    initialValues.autoRenew = props.autoRenewal;

  }

  useEffect(() => {
    // Check the values in the console
    
    
    // Set the initial values
    if (props.subscriptionType && props.autoRenew) {
        form.setFieldsValue({
            subscriptionType: props.subscriptionType,
            autoRenew: props.autoRenew,
          });
    }
    
  }, [form, props.subscriptionType, props.autoRenew]);

    function generateTitle() {
        if (props.operation == "UPDATE") {
            return "Update Subscription";
        } else if (props.operation == "RENEW") {
            return "Renew Subscription";
        } else if (props.operation == "SUBSCRIBE") {
            return "Subscribe to Data Dashboard";
        }

    }

    return(
        <div>
            <Modal
                title={generateTitle()}
                centered
                open={props.isSubModalOpen}
                onCancel={props.onClickCancelManageSubButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitSubscription}
                    initialValues={initialValues}
                >
                    
                    {!(props.operation == "RENEW") &&
                    <div>
                        <Form.Item
                    label="Subscription Type"
                    labelAlign="left"
                    name="subscriptionType"
                    rules={[{ required: true, message: 'Please select the subscription type' }]}
                    >
                    
                    <Select>
                            <Option value='Monthly'>Monthly</Option>
                            <Option value='Yearly'>Yearly</Option>
                    </Select>
                    </Form.Item>
                    <Form.Item
                    label="Auto Renew"
                    labelAlign="left"
                    name="autoRenew"
                    rules={[{ required: true, message: 'Please indicate whether to auto-renew or not' },]}
                    valuePropName="checked"
                    >
                    <Switch />
                    </Form.Item>
                    </div>
                    }

                        { props.operation == "RENEW" &&

                        <div>
                            <p>Do you want to renew your subscription?</p>
                            <Form.Item
                    label="Subscription Type"
                    labelAlign="left"
                    name="subscriptionType"
                    rules={[{ required: true, message: 'Please select the subscription type' }]}
                    >
                    
                    <Select>
                            <Option value='Monthly'>Monthly</Option>
                            <Option value='Yearly'>Yearly</Option>
                    </Select>
                    </Form.Item>
    
                        </div>

                            

                            
                            
                        }

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        { !(props.operation == "RENEW") &&
                            <Button type="primary" htmlType="submit">
                            Submit
                            </Button>
                        }
                        
                        {
                            props.operation == "RENEW" &&
                            <Button type="primary" htmlType="submit">
                            Renew
                            </Button>
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}