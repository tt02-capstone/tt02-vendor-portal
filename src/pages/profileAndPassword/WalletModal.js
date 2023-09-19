import React from "react";
import { Modal, Form, Input, Button } from "antd";


export default function WalletModal(props) {

    return(
        <div>
            <Modal
                title="Use Props"
                centered
                open={props.isBAModalOpen}
                onCancel={props.onClickCancelManageBAButton}
                footer={[]} // hide default buttons of modal
            >
                <Form 
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onClickSubmitNewBankAccount}
                >
                    <Form.Item
                    label="Bank Account Number"
                    labelAlign="left"
                    name="bankAccountNumber"
                    rules={[{ required: true, message: 'Please enter your bank account number!' }]}
                    >
                    <Input placeholder="Bank Account Number"/>
                    </Form.Item>

                    <Form.Item
                    label="Routing Number"
                    labelAlign="left"
                    name="routingNumber"
                    rules={[{ required: true, message: 'Please enter the routing number!' },]}
                    >
                    <Input placeholder="Routing Number" />
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