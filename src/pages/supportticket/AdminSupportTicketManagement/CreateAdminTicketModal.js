import {Button, Form, Input, InputNumber, Modal, Select, Spin, Switch} from "antd";
import React from "react";
import  { FormInstance } from 'antd/es/form';

export default function CreateAdminTicketModal(props) {

    const {TextArea} = Input;
    const {Option} = Select;


    // const onTypeChange = (value) => {
    //     switch (value) {
    //         case 'male':
    //             formRef.current?.setFieldsValue({ note: 'Hi, man!' });
    //             break;
    //         case 'female':
    //             formRef.current?.setFieldsValue({ note: 'Hi, lady!' });
    //             break;
    //         case 'other':
    //             formRef.current?.setFieldsValue({ note: 'Hi there!' });
    //             break;
    //         default:
    //             break;
    //     }
    // };

    const createMasterAccount = () => {
        return (
            <>
                <Form.Item
                    label="Staff Name"
                    labelAlign="left"
                    name="name"
                    rules={[{required: true, message: 'Please enter new staff name!'}]}
                >
                    <Input placeholder="Name"/>
                </Form.Item>

                <Form.Item
                    label="Staff Email"
                    labelAlign="left"
                    name="email"
                    placeholder="Staff Email"
                    rules={[{required: true, message: 'Please enter new staff email!'}]}
                >
                    <Input placeholder="Email"/>
                </Form.Item>

                <Form.Item
                    label="Current Login Access"
                    labelAlign="left"
                    name="is_blocked"
                    rules={[{required: true, message: 'Please select a login access right!'}]}
                >
                    <Select
                        placeholder="Please select a login access right"
                        allowClear
                    >
                        <Option value="false">Allow</Option>
                        <Option value="true">Deny</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Position"
                    labelAlign="left"
                    name="position"
                    placeholder="Position"
                    rules={[{required: true, message: 'Please enter staff position!'}]}
                >
                    <Input placeholder="Position"/>
                </Form.Item>
            </>
        )
    }


    return (
        <div>
            <Modal
                title="Create an Admin Ticket"
                centered
                open={props.openCreateAdminTickerModal}
                onCancel={props.cancelAdminTicketModal}
                style={{minWidth: 650}}
                footer={[]}
            >
                <Spin spinning={props.isLoading} size={"large"} >

                <Form
                    name="form"
                    form={props.form}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onCreateSubmit}
                >

                    <Form.Item
                        label="Ticket Type"
                        labelAlign="left"
                        name="ticket_category"
                        rules={[{required: true, message: 'Please select the Ticket type!'}]}
                        // onChange={onTypeChange}
                    >
                        <Select placeholder="Finance Related">
                            <Option value='MASTER_ACCOUNT_CREATION'>Admin Account Creation</Option>
                            <Option value='WALLET'>Finance Related</Option>
                            <Option value='GENERAL_ENQUIRY'>General Inquiries</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.ticket_category !== currentValues.ticket_category}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('ticket_category') === 'MASTER_ACCOUNT_CREATION' ? (
                                createMasterAccount()
                            ) : null
                        }
                    </Form.Item>
                    {console.log(props.form.getFieldValue('ticket_category'))}
                    {/*{props.form.getFieldValue('ticket_category') === 'MASTER_ACCOUNT_CREATION' && (*/}
                    {/*   createMasterAccount()*/}
                    {/*)}*/}

                    <Form.Item
                        label="Description"
                        labelAlign="left"
                        name="description"
                        rules={[{required: true, message: 'Please enter description of telecom!'},
                            {max: 800, message: 'Description should not exceed 1000 characters!'}]}
                    >
                        <TextArea rows={4} placeholder="Description"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 11, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
                </Spin>
            </Modal>
        </div>
    )
}