import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Button, Select, InputNumber } from "antd";

export default function CreateTelecomModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;

    return (
        <div>
            <Modal
                title="Create New Telecom"
                centered
                open={props.openCreateTelecomModal}
                onCancel={props.cancelTelecomModal}
                style={{minWidth: 650}}
                footer={[]} 
            >
                <Form
                    name="form"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onCreateSubmit}
                >
                    <Form.Item
                        label="Name"
                        labelAlign="left"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of telecom!' },
                        { max: 100, message: 'Name should not exceed 100 characters!' },]}

                    >
                        <Input placeholder="Name"/>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        labelAlign="left"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description of telecom!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <TextArea rows={4} placeholder="Description" />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        labelAlign="left"
                        name="price"
                        rules={[{ required: true, message: 'Please enter the price of telecom!' }]}
                    >
                        <InputNumber placeholder="50.00" prefix="$" min="0" max="1000" step="0.10" />
                    </Form.Item>

                    <Form.Item
                        label="Publish"
                        labelAlign="left"
                        name="is_published"
                        initialValue={true}
                        valuePropName="checked"
                        rules={[{ required: true, message: 'Please select whether to publish the telecom!' }]}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Telecom Type"
                        labelAlign="left"
                        name="type"
                        rules={[{ required: true, message: 'Please select the telecom type!' }]}
                    >
                        <Select placeholder="Physical Sim">
                            <Option value='PHYSICALSIM'>Physical Sim</Option>
                            <Option value='ESIM'>E-Sim</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Validity Duration"
                        labelAlign="left"
                        name="num_of_days_valid"
                        rules={[{ required: true, message: 'Please enter the validity duration of telecom!' }]}
                    >
                        <InputNumber placeholder="7" suffix="day(s)" min="0" max="180" step="1" />
                    </Form.Item>
                    
                    <Form.Item
                        label="Data Limit"
                        labelAlign="left"
                        name="data_limit"
                        rules={[{ required: true, message: 'Please enter the data limit of telecom!' }]}
                    >
                        <InputNumber placeholder="50" suffix="GB" min="0" max="10000" step="1" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}