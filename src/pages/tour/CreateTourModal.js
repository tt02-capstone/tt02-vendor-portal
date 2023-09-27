import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, DatePicker, TimePicker } from "antd";

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateTourModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [tourId, setTourId] = useState(null);

    const onFinish = async (values) => {
        props.onClickSubmitTourCreate({ ...props.form.getFieldsValue() });
    };

    return (
        <div>
            <Modal
                title="Create New Tour"
                centered
                open={props.isCreateTourModalOpen}
                onCancel={props.onClickCancelCreateTourModal}
                footer={[]}
            >
                <Form
                    name="basic"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: 'Please select a date!' }]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item
                        name="start_time"
                        label="Start Time"
                        rules={[{ required: true, message: 'Please select a start time!' }]}
                    >
                        <TimePicker format="HH:mm" />
                    </Form.Item>

                    <Form.Item
                        name="end_time"
                        label="End Time"
                        rules={[{ required: true, message: 'Please select an end time!' }]}
                    >
                        <TimePicker format="HH:mm" />
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

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customRow: {
        height: '280px',
    },
    imageContainer: {
        maxWidth: '180px',
        maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}