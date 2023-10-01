import { React , useEffect} from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, InputNumber } from "antd";
import moment from 'moment';
import {disabledDateChecker} from "../../helper/dateFormat";
const { RangePicker } = DatePicker

export default function SeasonalActivityModal(props) {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    
    useEffect(() => {
        if (props.onCancel || props.onSubmit) {
            form.resetFields(); // Reset the form fields
        }
    }, [props.onCancel, form]);

    return (
        <div>
            <Modal
                title="Create Seasonal Activity"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="seasonalForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 650 }}
                    onFinish={props.onSubmit}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of the activity!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        placeholder="Description"
                        rules={[{ required: true, message: 'Please enter description of the activity!'}]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Start and End Date:"
                        labelAlign='left'
                        rules={[{ required: true, message: 'Date range is required!'}]}
                    >
                        <RangePicker
                            format="YYYY-MM-DD"
                            disabledDate={disabledDateChecker}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Suggested Duration"
                        name="suggested_duration"
                        placeholder="Hours"
                        labelCol={{ span: 10 }}
                        rules={[
                            { required: true, message: 'Please enter suggested duration for the activity in hours!' },
                        ]}
                        style={{marginRight: 95}}
                    >
                        <InputNumber suffix="Hours"/>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit" style = {{width: '50%'}}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
