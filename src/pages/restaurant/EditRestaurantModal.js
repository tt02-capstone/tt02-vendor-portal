import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch, InputNumber, Space, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getRestaurant } from "../../redux/restaurantRedux";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditRestaurantModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedRestaurant, setSelectedRestaurant] = useState([]);
    const [editedRestaurantName, setEditedRestaurantName] = useState('');
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    async function getRest(props) {
        try {
            let response = await getRestaurant(props.restId);
            setSelectedRestaurant(response.data);
            const newExistingImageUrls = response.data.restaurant_image_list || [];
            setExistingImageUrls(newExistingImageUrls);
        } catch (error) {
            alert('An error occurred! Failed to retrieve restaurant!');
        }
    }

    useEffect(() => {
        if (props.isEditRestaurantModalOpen) {
            getRest(props);
        }
    }, [props.isEditRestaurantModalOpen]);

    useEffect(() => {
        setImageFiles(existingImageUrls.map((url, index) => ({
            uid: index,
            name: url.substring(url.lastIndexOf('/') + 1),
            status: "done",
            url: url,
        })));
        console.log("imageFiles", imageFiles);
    }, [existingImageUrls]);

    useEffect(() => {
        form.setFieldsValue({
            name: selectedRestaurant.name,
            description: selectedRestaurant.description,
            address: selectedRestaurant.address,
            opening_hours: selectedRestaurant.opening_hours,
            contact_num: selectedRestaurant.contact_num,
            is_published: selectedRestaurant.is_published,
            suggested_duration: selectedRestaurant.suggested_duration,
            restaurant_type: selectedRestaurant.restaurant_type,
            generic_location: selectedRestaurant.generic_location,
            restaurant_image_list: existingImageUrls,
        });

    }, [selectedRestaurant, form]);


    const handleFileChange = (e) => {
        const fileList = e.fileList; 
        setImageFiles(fileList);
    };

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

    const S3BUCKET = 'tt02/restaurant';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
    
        const restImageName = 'Rest_' + selectedRestaurant.restaurant_id + '_' + file.name;

            if (!existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/restaurant/Rest_${selectedRestaurant.restaurant_id}_${file.name}`) 
            && !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/restaurant/${file.name}`)) {
                
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
                        Key: restImageName,
                        Body: blob,
                    };
    
                    return new Promise((resolve, reject) => {
                        s3.putObject(params)
                            .on("httpUploadProgress", (evt) => {
                            })
                            .send((err, data) => {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/restaurant/Rest_${selectedRestaurant.restaurant_id}_${file.name}`;
                                    resolve(imageUrl);
                                }
                            });
                    });
                }
            } else {
                // return `http://tt02.s3-ap-southeast-1.amazonaws.com/restaurant/Rest_${selectedRestaurant.restaurant_id}_${file.name}`;
                return `http://tt02.s3-ap-southeast-1.amazonaws.com/restaurant/${file.name}`;
            }
        });
    
        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            setUploadedImageUrls(uploadedImageUrls);
    
            props.onClickSubmitEditRestaurant({
                ...form.getFieldsValue(),
                restaurant_image_list: uploadedImageUrls, 
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error('Upload failed!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    };

    useEffect(() => {
        if (file) {
            let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com';
            str = str + '/' + 'restaurant';
            str = str + '/' + file.name;
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Edit Restaurant"
                centered
                open={props.isEditRestaurantModalOpen}
                onCancel={props.onClickCancelEditRestaurantModal}
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
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of the restaurant!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="restaurant_image_list"
                        getValueFromEvent={normFile}
                        rules={[{required: true, message: 'Please upload at least one image!' },]}>
                        <Upload
                            beforeUpload={() => false}
                            multiple
                            listType="picture-card"
                            fileList={imageFiles}
                            onRemove={handleRemove}
                            showUploadList={{
                                showPreviewIcon: true,
                                showRemoveIcon: true,
                            }}
                            onChange={handleFileChange}
                        >
                            {imageFiles.length >= 8 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        placeholder="Description"
                        rules={[{ required: true, message: 'Please enter description of your restaurant!' }]}>
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        placeholder="Address"
                        rules={[{ required: true, message: 'Please enter address of the restaurant!' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Opening Hours"
                        name="opening_hours"
                        placeholder="Opening Hours"
                        rules={[{ required: true, message: 'Please enter opening hours of the restaurant!' }]}>
                        <Input placeholder="10am - 5pm" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contact_num"
                        placeholder="Contact Number"
                        rules={[
                            { required: true, message: 'Please enter contact number of the restaurant!' },
                            {
                                pattern: /^(\+\d{2}[- ]?)?\d{8}$/,
                                message: 'Please enter a valid contact number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Suggested Duration"
                        name="suggested_duration"
                        placeholder="Hours"
                        rules={[{ required: true, message: 'Please enter suggested duration for attraction in hours!' }]}>
                        <InputNumber suffix="Hours" />
                    </Form.Item>

                    <Form.Item
                        label="Publish?"
                        name="is_published"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Restaurant Type"
                        name="restaurant_type"
                        placeholder="Restaurant Type"
                        rules={[{ required: true, message: 'Please select the restaurant type!' }]}>
                        <Select>
                            <Option value='FAST_FOOD'>FAST FOOD</Option>
                            <Option value='CHINESE'>CHINESE</Option>
                            <Option value='MEXICAN'>MEXICAN</Option>
                            <Option value='KOREAN'>KOREAN</Option>
                            <Option value='WESTERN'>WESTERN</Option>
                            <Option value='JAPANESE'>JAPANESE</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Generic Location"
                        name="generic_location"
                        rules={[{ required: true, message: 'Please enter closest area to the restaurant!' }]}>
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