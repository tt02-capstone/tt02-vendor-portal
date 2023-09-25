import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Button, Select, InputNumber } from "antd";
import { getTelecomById } from "../../redux/telecomRedux";

export default function CreateTelecomModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;

    const [telecom, setTelecom] = useState();

    async function getTelecom(props) {
        try {
            let response = await getTelecomById(props.selectedTelecomId);
            setTelecom(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve Telecom!');
        }
    }

    useEffect(() => {
        if (props.editTelecomModal) {
            getTelecom(props);
        }
    },[props.editTelecomModal])

    useEffect(() => {
        if (telecom) {
            props.form.setFieldsValue({
                name: telecom.name,
                description: telecom.description,
                price: telecom.price,
                is_published: telecom.is_published,
                type: telecom.type,
                estimated_price_tier: telecom.estimated_price_tier,
                num_of_days_valid: telecom.num_of_days_valid,
                plan_duration_category: telecom.plan_duration_category,
                data_limit: telecom.data_limit,
                data_limit_category: telecom.data_limit_category,
            });
        }
    }, [telecom])

    return (
        <div>
            <Modal
                title="Edit Telecom"
                centered
                open={props.editTelecomModal}
                onCancel={props.onCancelEditModal}
                style={{minWidth: 650}}
                footer={[]} 
            >
                <Form
                    name="editForm"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onEditSubmit}
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
                        label="Exact Price"
                        labelAlign="left"
                        name="price"
                        rules={[{ required: true, message: 'Please enter the price of telecom!' }]}
                    >
                        <InputNumber placeholder="50.00" prefix="$" min="0" max="1000" step="0.10" />
                    </Form.Item>

                    <Form.Item
                        label="Estimated Price Tier"
                        labelAlign="left"
                        name="estimated_price_tier"
                        rules={[{ required: true, message: 'Please enter the estimated price tier of telecom!' }]}
                    >
                        <Select placeholder="$$$">
                            <Option value='TIER_1'>$</Option>
                            <Option value='TIER_2'>$$</Option>
                            <Option value='TIER_3'>$$$</Option>
                            <Option value='TIER_4'>$$$$</Option>
                            <Option value='TIER_5'>$$$$$</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Publish"
                        labelAlign="left"
                        name="is_published"
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
                        label="Validity Duration Category"
                        labelAlign="left"
                        name="plan_duration_category"
                        rules={[{ required: true, message: 'Please enter the validity duration category of telecom!' }]}
                    >
                        <Select placeholder="Between 3 and 7 days">
                            <Option value='ONE_DAY'>1 day and less</Option>
                            <Option value='THREE_DAY'>Between 1 and 3 days</Option>
                            <Option value='SEVEN_DAY'>Between 3 and 7 days</Option>
                            <Option value='FOURTEEN_DAY'>Between 7 and 14 days</Option>
                            <Option value='MORE_THAN_FOURTEEN_DAYS'>More than 14 days</Option>
                        </Select>
                    </Form.Item>

                    
                    <Form.Item
                        label="Data Limit"
                        labelAlign="left"
                        name="data_limit"
                        rules={[{ required: true, message: 'Please enter the data limit of telecom!' }]}
                    >
                        <InputNumber placeholder="50" suffix="GB" min="0" max="10000" step="1" />
                    </Form.Item>

                    <Form.Item
                        label="Data Limit Category"
                        labelAlign="left"
                        name="data_limit_category"
                        rules={[{ required: true, message: 'Please enter the data limit category of telecom!' }]}
                    >
                        <Select placeholder="Between 30 and 50GB">
                            <Option value='VALUE_10'>10GB and less</Option>
                            <Option value='VALUE_30'>Between 10GB and 30GB</Option>
                            <Option value='VALUE_50'>Between 30GB and 50GB</Option>
                            <Option value='VALUE_100'>Between 50GB and 100GB</Option>
                            <Option value='UNLIMITED'>Unlimited</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}