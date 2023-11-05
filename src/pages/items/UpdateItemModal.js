import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, InputNumber, Switch } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdateItemModal(props) {
    const { TextArea } = Input;
    const [itemId, setItemId] = useState(null);
    const [form] = Form.useForm();
    const [imageFiles, setImageFiles] = useState([]);
    const [uploadedImage, setUploadedImage] = useState([]);

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    function handleRemove(file) {
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        console.log('at handle remove')
        console.log(updatedFiles)
        setImageFiles(updatedFiles);
    }

    // upload file
    const S3BUCKET = 'tt02/item';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const fileList = e.fileList;
        setImageFiles(fileList);
    }

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
            const itemImageName = 'Item_' + itemId + '_' + file.name;
            const blob = new Blob([file.originFileObj]);

            if (blob) {
                const S3_BUCKET = S3BUCKET;
                const REGION = TT02REGION;

                AWS.config.update({
                    accessKeyId: ACCESS_KEY,
                    secretAccessKey: SECRET_ACCESS_KEY,
                });
                const s3 = new AWS.S3({
                    params: { Bucket: S3_BUCKET },
                    region: REGION,
                });

                const params = {
                    Bucket: S3_BUCKET,
                    Key: itemImageName,
                    Body: blob,
                };

                return new Promise((resolve, reject) => {
                    s3.putObject(params)
                        .on("httpUploadProgress", (evt) => {
                            console.log(
                                "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                            );
                        })
                        .send((err, data) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/item/${itemImageName}`;
                                console.log("imageUrl", imageUrl);
                                resolve(imageUrl);
                            }
                        });
                });
            }
        });

        try {
            const uploadedImage = await Promise.all(uploadPromises);
            console.log("Image uploaded:", uploadedImage);

            setUploadedImage(uploadedImage);

            const newItemId = itemId + 1;
            setItemId(newItemId);
            console.log("nextItemId", itemId);

            props.onClickSubmitItemUpdate({ ...form.getFieldsValue(), image: uploadedImage });
            form.resetFields();
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        if (props.isUpdateItemModalOpen) {
            form.setFieldsValue({
                item_id: props.item.item_id,
                name: props.item.name,
                price: props.item.price,
                quantity: props.item.quantity,
                description: props.item.description,
                is_published: props.item.is_published,
                is_limited_edition: props.item.is_limited_edition
            });
        }

    }, [props.isUpdateItemModalOpen]);

    return (
        <div>
            <Modal
                title="Update Item"
                centered
                open={props.isUpdateItemModalOpen}
                onCancel={props.onClickCancelUpdateItemModal}
                footer={[]}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}

                >
                    <Form.Item
                        label="Name"
                        name="name"
                        placeholder="Item Name"
                        rules={[{ required: true, message: 'Please enter name of item!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description!' },
                        { max: 400, message: 'Description should not exceed 400 characters!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please enter quantity!' }]}>
                        <InputNumber style={{ width: '110px' }} min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price!' }]}>
                        <InputNumber style={{ width: '110px' }} prefix="$" min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            beforeUpload={() => false} // To prevent auto-upload on file selection
                            maxCount={1}
                            fileList={imageFiles}
                            onRemove={handleRemove}
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Published"
                        name="is_published"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Limited Edition"
                        name="is_limited_edition"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#FFA53F', fontWeight: "bold", width: 100 }}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}