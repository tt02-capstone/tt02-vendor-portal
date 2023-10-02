import { React , useEffect} from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import {disabledDateChecker} from "../../helper/dateFormat";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;

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
                title="Set Tickets Count"
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
                    <p style={{fontWeight: '500'}}>Please set the new ticket count for the selected dates!</p>
                    <Form.Item
                        name="dateRange"
                        label="Date Range:"
                        labelAlign='left'
                        rules={[{ required: true, message: 'Date range is required!'}]}
                    >
                        <RangePicker
                            format="YYYY-MM-DD"
                            disabledDate={disabledDateChecker}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ticket Type"
                        name="ticketType"
                        labelAlign='left'
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
                        labelAlign='left'
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
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
