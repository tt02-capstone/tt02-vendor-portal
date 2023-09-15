import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { validatePassword } from "../../helper/validation";

export default function EditPasswordModal(props) {

    return(
        <div>
            <Modal
                title="Change Password"
                centered
                open={props.isChangePasswordModalOpen}
                onCancel={props.onClickCancelEditPasswordButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitNewPassword}
                >
                    <Form.Item
                    label="Old Password"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Please enter your old password!' }]}
                    >
                    <Input.Password placeholder="Old Password"/>
                    </Form.Item>

                    <Form.Item
                    label="New Password"
                    name="newPasswordOne"
                    rules={[{ required: true, message: 'Please enter your new password!' }, { validator: validatePassword },]}
                    >
                    <Input.Password placeholder="New Password" />
                    </Form.Item>

                    <Form.Item
                    label="Repeat New Password"
                    name="newPasswordTwo"
                    rules={[{ required: true, message: 'Please enter your new password again!' }, { validator: validatePassword },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('newPasswordOne') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('New password do not match!'));
                        },
                    })]}
                    >
                    <Input.Password placeholder="Repeat new Password" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}