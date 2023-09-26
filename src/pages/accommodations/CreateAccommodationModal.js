import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { getLastAccommodationId } from "../../redux/accommodationRedux";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateAccommodationModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [lastAccommodationId, setLastAccommodationId] = useState(null);
    const [accommodationId, setAccommodationId] = useState(null);

    useEffect(() => {
        async function fetchLastAccommodationId() {
            try {
                const response = await getLastAccommodationId();
                if (response.status) {
                    setLastAccommodationId(response.data);
                    const newAccommodationId = response.data + 1;
                    setAccommodationId(newAccommodationId);
                } else {
                    console.error("Error fetching last accommodation_id: ", response.data);
                }
            } catch (error) {
                console.error("Error fetching accommodationId: ", error);
            }
        }

        fetchLastAccommodationId();
    }, [accommodationId]);

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

    // upload file
    const S3BUCKET = 'tt02/accommodation';
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
            const accommodationImageName = 'Accommodation_' + accommodationId + '_' + file.name;
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
                    Key: accommodationImageName,
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
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/${accommodationImageName}`;
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

            setUploadedImageUrls(uploadedImageUrls);

            const newAccommodationId = accommodationId + 1;
            setAccommodationId(newAccommodationId);
            console.log("nextAccommodationId", accommodationId);

            props.onClickSubmitAccommodationCreate({ ...props.form.getFieldsValue(), accommodation_image_list: uploadedImageUrls });

        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    useEffect(() => {
        if (file) {
            let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com';
            str = str + '/' + 'accommodation';
            str = str + '/' + 'Accommodation_' + accommodationId + '_' + file.name;
            console.log("useEffect", str);
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Create New Accommodation"
                centered
                open={props.isCreateAccommodationModalOpen}
                onCancel={props.onClickCancelCreateAccommodationModal}
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of accommodation!' },
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="accommodation_image_list"
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
                        placeholder="Description"
                        rules={[{ required: true, message: 'Please enter description of accommodation!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        placeholder="Address"
                        rules={[{ required: true, message: 'Please enter address of accommodation!' },
                        { max: 100, message: 'Address should not exceed 100 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contact_num"
                        placeholder="Contact Number"
                        rules={[
                            { required: true, message: 'Please enter contact number of accommodation!' },
                            {
                                pattern: /^(\+\d{2}[- ]?)?\d{8}$/,
                                message: 'Please enter a valid contact number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Check In Time"
                        name="check_in_time"
                        rules={[{ required: true, message: 'Please select a check in time!' }]}
                    >
                        <TimePicker
                            style={{ width: '100%' }}
                            format="HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Check Out Time"
                        name="check_out_time"
                        rules={[{ required: true, message: 'Please select a check out time!' }]}
                    >
                        <TimePicker
                            style={{ width: '100%' }}
                            format="HH:mm"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Accommodation Type"
                        name="type"
                        placeholder="Accommodation Type"
                        rules={[{ required: true, message: 'Please select accommodation type of the accommodation!' }]}
                    >
                        <Select>
                            <Option value='HOTEL'>Hotel</Option>
                            <Option value='AIRBNB'>Airbnb</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Generic Location"
                        name="generic_location"
                        rules={[{ required: true, message: 'Please enter closest area to the accommodation!' }]}
                    >
                        <Select>
                            <Option value='MARINA_BAY'>Marina Bay</Option>
                            <Option value='RAFFLES_PLACE'>Raffles Place</Option>
                            <Option value='SHENTON_WAY'>Shenton Way</Option>
                            <Option value='TANJONG_PAGAR'>Tanjong Pagar</Option>
                            <Option value='ORCHARD'>Orchard</Option>
                            <Option value='NEWTON'>Newton</Option>
                            <Option value='DHOBY_GHAUT'>Dhoby Ghaut</Option>
                            <Option value='CHINATOWN'>Chinatown</Option>
                            <Option value='BUGIS'>Bugis</Option>
                            <Option value='CLARKE_QUAY'>Clarke Quay</Option>
                            <Option value='SENTOSA'>Sentosa</Option>
                        </Select>
                    </Form.Item>

                    {/* once they create shld direct them to create rooms */}

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