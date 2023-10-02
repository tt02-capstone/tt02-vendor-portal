import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';
import { getLastRoomId } from "../../redux/accommodationRedux";
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function UpdatedRoomModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [roomId, setRoomId] = useState(null);
    const [form] = Form.useForm();
    const [lastRoomId, setLastRoomId] = useState(null);
    const [accommodation, setAccommodation] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [uploadedImage, setUploadedImage] = useState([]);
    //const [initialValues, setInitialValues] = useState(null);


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
    const S3BUCKET = 'tt02/accommodation/room';
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
            const roomImageName = 'Room_' + roomId + '_' + file.name;
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
                    Key: roomImageName,
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
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/room/${roomImageName}`;
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

            const newRoomId = roomId + 1;
            setRoomId(newRoomId);
            console.log("nextRoomId", roomId);

            props.onClickSubmitRoomUpdate({ ...form.getFieldsValue(), room_image: uploadedImage });

        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    useEffect(() => {
        setAccommodation(props.accommodation);
        console.log("accommodation", accommodation);
    }, []);


    
    
    useEffect(() => {

        if (props.isUpdateRoomModalOpen) {
            
            form.setFieldsValue({
                room_type: props.room.room_type,
            //room_image: props.room.room_image[0],
            amenities_description: props.room.amenities_description,
            num_of_pax: props.room.num_of_pax,
            price: props.room.price,        
            num_of_rooms: props.room.quantity,
            room_id: props.room.room_id,
            });
        }
        

    }, [props.isUpdateRoomModalOpen]);

    return (
        <div>
            <Modal
                title="Update Rooms"
                centered
                open={props.isUpdateRoomModalOpen}
                onCancel={props.onClickCancelUpdateRoomModal}
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
                        label="Room Type"
                        name="room_type"
                        placeholder="Room Type"

                    >
                         <Input readOnly />
                    </Form.Item>

                    <Form.Item
                        label="Image"
                        name="room_image"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[
                            { required: true, message: 'Please upload an image!' },
                        ]}
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

                    <Form.Item
                        label="Number of Rooms"
                        name="num_of_rooms"
                        placeholder="Number of Rooms"
                        rules={[
                            { required: true, message: 'Please enter number of rooms to create for room type!' },
                            {
                                validator: (_, value) => {
                                    if (value <= 0) {
                                        return Promise.reject('Number of rooms must be greater than 0');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber suffix="Rooms" />
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