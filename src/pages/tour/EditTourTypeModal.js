import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch, InputNumber, Space, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getTourTypeByTourTypeId, getAttractionForTourTypeId } from "../../redux/tourRedux";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';
import { getPublishedAttractions } from "../../redux/attractionRedux";

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditTourTypeModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedTourType, setSelectedTourType] = useState([]);
    const [editedTourTypeName, setEditedTourTypeName] = useState('');
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));
    const [publishedAttractions, setPublishedAttractions] = useState([]);
    const [selectedAttraction, setSelectedAttraction] = useState('');

    async function getTourType(props) {
        try {
            let response = await getTourTypeByTourTypeId(props.tourTypeId);
            setSelectedTourType(response.data);
            
            const newExistingImageUrls = response.data.tour_image_list || [];

            setExistingImageUrls(newExistingImageUrls);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour type!');
        }
    }

    async function getPublishedAttraction() {
        try {
            let response = await getPublishedAttractions();
            setPublishedAttractions(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve published attractions!');
        }
    }

    async function getAttraction(props) {
        try {
            let response = await getAttractionForTourTypeId(props.tourTypeId);
            setSelectedAttraction(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
        if (props.isEditTourTypeModalOpen) {
            getTourType(props);
            getAttraction(props);
            getPublishedAttraction();
        }
    }, [props.isEditTourTypeModalOpen]);

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
            attraction: selectedAttraction.attraction_id,
            tour_type_id: selectedTourType.tour_type_id,
            name: selectedTourType.name,
            description: selectedTourType.description,
            price: selectedTourType.price,
            recommended_pax: selectedTourType.recommended_pax,
            special_note: selectedTourType.special_note,
            estimated_duration: selectedTourType.estimated_duration,
            is_published: selectedTourType.is_published,
            tour_image_list: existingImageUrls,
        });

        form.validateFields(['attraction']);
    }, [selectedTourType, selectedAttraction, form]);

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

    // upload file
    const S3BUCKET = 'tt02/tour';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
    
        const attractionImageName = 'Tour_' + selectedTourType.tour_type_id + '_' + file.name;

        console.log("existingImageUrls", existingImageUrls);

        const currentFileUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/tour/Tour_${selectedTourType.tour_type_id}_${file.name}`;

        console.log("currentFileUrl", currentFileUrl);

        console.log(file.name, " is a new image? ", !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/tour/Tour_${selectedTourType.tour_type_id}`));

            // Check if the file is a new image (not an existing one)
            if (!existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/tour/Tour_${selectedTourType.tour_type_id}_${file.name}`) 
            && !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/tour/${file.name}`)) {
                
                const blob = new Blob([file.originFileObj]);
                console.log("blob", blob);
    
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
                        Key: attractionImageName,
                        Body: blob,
                    };
    
                    return new Promise((resolve, reject) => {
                        s3.putObject(params)
                            .on("httpUploadProgress", (evt) => {
                                // Handle upload progress here if needed
                            })
                            .send((err, data) => {
                                if (err) {
                                    console.log(err);
                                    reject(err);
                                } else {
                                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/tour/Tour_${selectedTourType.tour_type_id}_${file.name}`;
                                    resolve(imageUrl);
                                }
                            });
                    });
                }
            } else {
                // If it's an existing image, return its URL directly
                return `http://tt02.s3-ap-southeast-1.amazonaws.com/tour/${file.name}`;
            }
        });
    
        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            // Now all image URLs are collected, including both new and existing ones
    
            setUploadedImageUrls(uploadedImageUrls);
    
            props.onClickSubmitEditTourType({
                ...form.getFieldsValue(),
                tour_image_list: uploadedImageUrls, // Combined list of new and existing URLs
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
            str = str + '/' + 'tour';
            str = str + '/' + file.name;
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Edit Tour"
                centered
                open={props.isEditTourTypeModalOpen}
                onCancel={props.onClickCancelEditTourTypeModal}
                footer={[]} 
            >
                <Form
                    name="editTourType"
                    form={form}
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
                        getValueFromEvent={normFile}
                        rules={[
                            { required: true, message: 'Please upload at least one image!' },
                        ]}
                    >
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
                        rules={[{ required: true, message: 'Please enter description!' },
                        { max: 400, message: 'Description should not exceed 400 characters!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Price per Pax"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price per pax!' }]}>
                        <InputNumber style={{ width: '110px' }} prefix="$" min={0} />
                    </Form.Item>

                    <Form.Item
                        label="No. of Pax"
                        name="recommended_pax"
                        rules={[{ required: true, message: 'Please enter no. of pax!' }]}
                    >
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
                        <InputNumber style={{ width: '110px' }} suffix="Hours" min={1} step={1} parser={value => parseInt(value, 10)} />
                    </Form.Item>

                    <Form.Item
                        label="Special Notes"
                        name="special_note"
                        rules={[{ max: 200, message: 'Notes should not exceed 200 characters!' }]}
                    >
                        <TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                        label="Published"
                        name="is_published"
                        valuePropName="checked"
                    >
                        <Switch />
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