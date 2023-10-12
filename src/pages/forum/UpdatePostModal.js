import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdatePostModal(props) {

    const { TextArea } = Input;
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        props.onClickSubmitPostUpdate({ ...form.getFieldsValue() });
    };

    useEffect(() => {
        if (props.isUpdatePostModalOpen) {
            form.setFieldsValue({
                title: props.post.title,
                content: props.post.content,
            });
        }


    }, [props.isUpdatePostModalOpen]);

    return (
        <div>
            <Modal
                title="Update Post"
                centered
                open={props.isUpdatePostModalOpen}
                onCancel={props.onClickCancelUpdatePostModal}
                footer={[]}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}

                >
                    <Form.Item
                        label="Title"
                        name="title"
                        placeholder="Title of Post"
                        rules={[{ required: true, message: 'Please enter title of post!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Content"
                        name="content"
                        placeholder="Content of Post"
                        rules={[{ required: true, message: 'Please enter content of post!' },
                        { max: 1000, message: 'Content should not exceed 1000 characters!' }]}
                    >
                        <TextArea rows={5} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
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