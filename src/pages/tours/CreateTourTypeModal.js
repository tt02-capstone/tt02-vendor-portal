import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getLastTourTypeId } from "../../redux/tourRedux";
import CustomFileUpload from "../../components/CustomFileUpload";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';
import { getPublishedAttractions } from "../../redux/attractionRedux";

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateTourTypeModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [tourTypeName, setTourTypeName] = useState('');
    const [lastTourTypeId, setLastTourTypeId] = useState(null);
    const [tourTypeId, setTourTypeId] = useState(null);
    const [publishedAttractions, setPublishedAttractions] = useState([]);

    useEffect(() => {

        async function fetchLastTourTypeId() {
            try {
                const response = await getLastTourTypeId();
                if (response.status) {
                    setLastTourTypeId(response.data);
                    const newTourTypeId = response.data + 1;
                    setTourTypeId(newTourTypeId);
                } else {
                    console.error("Error fetching last tourTypeId: ", response.data);
                }
            } catch (error) {
                console.error("Error fetching tourTypeId: ", error);
            }
        }

        const fetchPublishedAttractionsData = async () => {
            const response = await getPublishedAttractions();
            if (response.status) {
                setPublishedAttractions(response.data);
            } else {
                console.log("List of published attractions not fetched!");
            }
        }

        fetchLastTourTypeId();
        fetchPublishedAttractionsData();
    }, [tourTypeId]);



    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    function handleRemove(file) {
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        setImageFiles(updatedFiles);
    }

    const S3BUCKET = 'tt02/tour';
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
            const tourTypeImageName = 'Tour_' + tourTypeId + '_' + file.name;
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
                    Key: tourTypeImageName,
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
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/tour/${tourTypeImageName}`;
                                console.log("imageUrl", imageUrl);
                                resolve(imageUrl);
                            }
                        });
                });
            }
        });

        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            console.log("All images uploaded:", uploadedImageUrls);

            // toast.success('Upload successful!', {
            //     position: toast.POSITION.TOP_RIGHT,
            //     autoClose: 1500
            // });

            setUploadedImageUrls(uploadedImageUrls);

            const newTourTypeId = tourTypeId + 1;
            setTourTypeId(newTourTypeId);
            console.log("nextTourTypeId", tourTypeId);

            props.onClickSubmitTourTypeCreate({ ...props.form.getFieldsValue(), tour_image_list: uploadedImageUrls });

        } catch (error) {
            console.error("Error uploading images:", error);
            // toast.error('Upload failed!', {
            //     position: toast.POSITION.TOP_RIGHT,
            //     autoClose: 1500
            // });
        }
    };

    useEffect(() => {
        if (file) {
            let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com';
            str = str + '/' + 'tour';
            str = str + '/' + 'Tour' + tourTypeId + '_' + file.name;
            console.log("useEffect", str);
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Create New Tour Type"
                centered
                open={props.isCreateTourTypeModalOpen}
                onCancel={props.onClickCancelCreateTourTypeModal}
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
                        label="Attraction"
                        name="attraction"
                        rules={[{ required: true, message: 'Please select attraction!' }]}
                    >
                        <Select>
                            {publishedAttractions.map((attraction, index) => (
                                <Option key={index} value={attraction.attraction_id}>
                                    {attraction.name}
                                </Option>
                            ))}
                        </Select>

                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name!' },
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="tour_image_list"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                            { required: true, message: 'Please upload at least one image!' },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false} // To prevent auto-upload on file selection
                            multiple
                            listType="picture-card"
                            fileList={imageFiles}
                            onRemove={handleRemove}
                            onChange={handleFileChange}
                        >
                            {imageFiles.length >= 8 ? null : uploadButton}
                        </Upload>
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
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price!' }]}>
                        <InputNumber style={{ width: '110px' }} prefix="$" min={0} />
                    </Form.Item>

                    <Form.Item
                        label="No. of Pax"
                        name="recommended_pax"
                        rules={[{ required: true, message: 'Please enter no. of pax!' }]}>
                        <InputNumber style={{ width: '110px' }} min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Est. Duration"
                        name="estimated_duration"
                        rules={[
                            { required: true, message: 'Please enter estimated duration!' },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject('Duration must be greater than 0 hours');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber style={{ width: '110px' }} suffix="Hours" min={1} />
                    </Form.Item>

                    <Form.Item
                        label="Special Notes"
                        name="special_note"
                        rules={[{ max: 200, message: 'Notes should not exceed 200 characters!' }]}
                    >
                        <TextArea rows={2} />
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