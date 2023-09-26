import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';

export default function CreateAccommodationModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [accommodationId, setAccommodationId] = useState(null);

    const onFinish = async (values) => {
        props.onClickSubmitRoomCreate({ ...props.form.getFieldsValue()});
    }

    return (
        <div>
            <Modal
                title="Create New Room"
                centered
                open={props.isCreateRoomModalOpen}
                onCancel={props.onClickCancelCreateRoomModal}
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
                        label="Room Number"
                        name="room_number"
                        rules={[{ required: true, message: 'Please enter room number!' },
                        { max: 64, message: 'Room Number should not exceed 64 characters!' },]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Room Type"
                        name="room_type"
                        placeholder="Room Type"
                        rules={[{ required: true, message: 'Please select room type of the accommodation!' }]}
                    >
                        <Select>
                            <Option value='STANDARD'>Standard</Option>
                            <Option value='DOUBLE'>Double</Option>
                            <Option value='SUITE'>Suite</Option>
                            <Option value='JUNIOR_SUITE'>Junior Suite</Option>
                            <Option value='DELUXE_SUITE'>Deluxe Suite</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Amenities Description"
                        name="amenities_description"
                        placeholder="Amenities Description"
                        rules={[{ required: true, message: 'Please enter description of amenities!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="No. of Pax"
                        name="num_of_pax"
                        placeholder="No. of Pax"
                        rules={[
                            { required: true, message: 'Please enter maximum number of pax for room!' },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject('Number of Pax must be greater than 0');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber suffix="Pax" />
                    </Form.Item>

                    <Form.Item
                        label="Price Per Night"
                        name="price"
                        placeholder="Price Per Night"
                        rules={[
                            { required: true, message: 'Please enter price per night for room!' },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject('Price per night must be greater than 0');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber
                            step={0.01}
                            parser={(value) => (value ? value.replace('$', '') : '')}
                            formatter={(value) => `$${value}`}
                            min={0}
                            precision={2}
                        />
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