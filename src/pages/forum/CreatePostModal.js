import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreatePostModal(props) {
    const { TextArea } = Input;

    const onFinish = async () => {
        props.onClickSubmitPostCreate({ ...props.form.getFieldsValue() });
    };

    return (
        <div>
            <Modal
                title="Create New Post"
                centered
                open={props.isCreatePostModalOpen}
                onCancel={props.onClickCancelCreatePostModal}
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

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
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