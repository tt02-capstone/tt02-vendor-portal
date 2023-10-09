import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getTourByTourId } from "../../redux/tourRedux";
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Form, Input, Button, Select, DatePicker, TimePicker } from "antd";
import moment from 'moment';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditTourModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedTour, setSelectedTour] = useState([]);
    const local = JSON.parse(localStorage.getItem("user"));
    const [fieldTouched, setFieldTouched] = useState(false);

    async function getTour(props) {
        try {
            let response = await getTourByTourId(props.tourId);
            setSelectedTour(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour!');
        }
    }

    useEffect(() => {
        if (props.isEditTourModalOpen) {
            getTour(props);
        }
    }, [props.isEditTourModalOpen]);

    useEffect(() => {
        form.setFieldsValue({
            date: moment(selectedTour.date),
            start_time: moment(selectedTour.start_time),
            end_time: moment(selectedTour.end_time),
        });
    }, [selectedTour, form]);

    const onFinish = async (values) => {
        setFieldTouched(false);
        props.onClickSubmitEditTour({
            ...form.getFieldsValue(),
        });
    };

    const disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };

    const validateEndTime = (_, value) => {
        const startTime = form.getFieldValue('start_time');
        const startTimeFormatted = new Date(startTime);
        const endTimeFormatted = new Date(value);
        console.log('gab1', startTimeFormatted);
        console.log('gab2', endTimeFormatted);

        if (!startTime || !value) {
            return Promise.resolve();
        }

        const timeDifferenceInSeconds = (endTimeFormatted - startTimeFormatted) / 1000;

        if (timeDifferenceInSeconds >= 3600) {
            return Promise.resolve();
        }

        return Promise.reject('Each tour must be at least 1 hour!');
    };

    const handleFieldFocus = () => {
        if (!fieldTouched) {
            form.resetFields();
            setFieldTouched(true);
        }
    };

    const handleModalCancel = () => {
        setFieldTouched(false);
    };

    return (
        <div>
            <Modal
                title="Edit Tour Timing"
                centered
                open={props.isEditTourModalOpen}
                onCancel={() => {
                    props.onClickCancelEditTourModal();
                    handleModalCancel(); 
                }}
                footer={[]}
            >

                <Form
                    name="editTour"
                    form={form}
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
                        <DatePicker disabledDate={disabledDate} onFocus={handleFieldFocus} />
                    </Form.Item>

                    <Form.Item
                        name="start_time"
                        label="Start Time"
                        rules={[{ required: true, message: 'Please select a start time!' }]}
                    >
                        <TimePicker
                            format="HH:mm"
                            disabledHours={() => Array.from({ length: 24 }, (_, i) => i < 4 ? i : false)}
                            disabledMinutes={() => Array.from({ length: 60 }, (_, i) => false)}
                            onFocus={handleFieldFocus}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}