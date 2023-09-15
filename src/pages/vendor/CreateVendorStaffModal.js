import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

export default function CreateVendorStaffModal(props) {

    const { Option } = Select;

    return(
        <div>
            <Modal
                title="Create New Vendor Staff"
                centered
                open={props.isCreateVendorStaffModalOpen}
                onCancel={props.onClickCancelVendorStaffModal}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitVendorStaffCreate}
                >
                    <Form.Item
                    label="Staff Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter new staff name!' }]}
                    >
                    <Input placeholder="Name"/>
                    </Form.Item>

                    <Form.Item
                    label="Staff Email"
                    name="email"
                    placeholder="Staff Email"
                    rules={[{ required: true, message: 'Please enter new staff email!' }]}
                    >
                    <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Current Login Access"
                        name="is_blocked"
                        rules={[{ required: true, message: 'Please select a login access right!' }]}
                    >
                        <Select
                            placeholder="Please select a login access right"
                            allowClear
                        >
                            <Option value="false">Allow Login</Option>
                            <Option value="true">Deny Login</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                    label="Position"
                    name="position"
                    placeholder="Position"
                    rules={[{ required: true, message: 'Please enter staff position!' }]}
                    >
                    <Input placeholder="Position"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}