import React from "react";
import { Modal, Form, Input, Button, Select, Spin, Row } from "antd";

export default function CreateVendorStaffModal(props) {

    const { Option } = Select;

    return(
        <div>
            <Modal
                title="Create New Staff"
                centered
                open={props.isCreateVendorStaffModalOpen}
                onCancel={props.onClickCancelVendorStaffModal}
                footer={[]} // hide default buttons of modal
            >
                <Row align='middle' justify='center'>
                    <Spin tip="Creating" size="small" spinning={props.loading}></Spin>
                </Row>

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
                    labelAlign="left"
                    name="name"
                    rules={[{ required: true, message: 'Please enter new staff name!' }]}
                    >
                    <Input placeholder="Name"/>
                    </Form.Item>

                    <Form.Item
                    label="Staff Email"
                    labelAlign="left"
                    name="email"
                    placeholder="Staff Email"
                    rules={[{ required: true, message: 'Please enter new staff email!' }]}
                    >
                    <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        label="Current Login Access"
                        labelAlign="left"
                        name="is_blocked"
                        rules={[{ required: true, message: 'Please select a login access right!' }]}
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
                    rules={[{ required: true, message: 'Please enter staff position!' }]}
                    >
                    <Input placeholder="Position"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={props.loading}>
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}