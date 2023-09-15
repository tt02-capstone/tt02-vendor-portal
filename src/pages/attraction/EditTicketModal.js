import { React , useEffect} from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";

const { Option } = Select;

export default function EditTicketModal(props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.onCancel || props.onSubmit) {
            form.resetFields(); // Reset the form fields
        }
    }, [props.onCancel, form]);

    return (
        <div>
            <Modal
                title="Update Ticket Information"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="editTicketForm"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 600 }}
                    onFinish={props.onSubmit}
                >
                    <Form.Item
                        label="Ticket Date"
                        name="ticketDate"
                        rules={[{ required: true, message: 'Please select a date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                    </Form.Item>

                    <Form.Item
                        label="Ticket Type"
                        name="ticketType"
                        rules={[{ required: true, message: 'Please select a ticket type!' }]}
                    >
                        {props.value ? (
                            <Select style={{ width: '100%' }}>
                            {props.value.map((option) => (
                                <Option key={option} value={option}>
                                {option}
                                </Option>
                            ))}
                            </Select>
                        ) : (
                            <div></div>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Ticket Count"
                        name="ticketCount"
                        rules={[
                            { required: true, message: 'Please enter the ticket count!' }
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 11, span: 10 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
