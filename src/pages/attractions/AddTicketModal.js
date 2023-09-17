import { React , useEffect} from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import moment from 'moment';

const { Option } = Select;

export default function AddTicketModal(props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.onCancel || props.onSubmit) {
            form.resetFields(); // Reset the form fields
        }
    }, [props.onCancel, form]);

    return (
        <div>
            <Modal
                title="Add Tickets"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="addTicketForm"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 600 }}
                    onFinish={props.onSubmit}
                >
                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select a start date!' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            format="YYYY-MM-DD" 
                            disabledDate={(current) => current && current < moment().startOf('day')}/>
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please select an end date!' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current < moment().startOf('day')} />
                    </Form.Item>

                    <Form.Item
                        label="Ticket Type"
                        name="ticketType"
                        rules={[{ required: true, message: 'Please select a ticket type!' }]}
                    >
                        {/* do it based on the value which is set in the modal which is a lsit of ticket type */}
                        {/* <Select style={{ width: '100%' }}>
                            {props.value.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                            ))}
                        </Select> */}

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
                            { required: true, message: 'Please enter the ticket count!' },
                            {
                                validator: (_, value) => {
                                    const intValue = parseInt(value, 10);
                                    if (!Number.isNaN(intValue) && intValue >= 0) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Ticket count must be a non-negative integer!'));
                                }
                            }
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
