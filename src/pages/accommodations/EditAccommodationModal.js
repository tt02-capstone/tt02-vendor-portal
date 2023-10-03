import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch, InputNumber, Space, Upload, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getAccommodationByVendor } from "../../redux/accommodationRedux";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditAccommodationModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedAccommodation, setSelectedAccommodation] = useState([]);
    const [editedAccommodationName, setEditedAccommodationName] = useState('');
    const [priceList, setPriceList] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getAccommodation(vendor, props) {
        try {
            let response = await getAccommodationByVendor(vendor.user_id, props.accommodationId);
            console.log("getAccommodation response data", response.data);
            setSelectedAccommodation(response.data);
            setPriceList(response.data.price_list);

            // console.log("getAccommodation response data", response.data);
            const newExistingImageUrls = response.data.accommodation_image_list || [];
            // console.log("editAccommodationModal getAccommodation newExistingImageUrls", newExistingImageUrls);

            setExistingImageUrls(newExistingImageUrls);

            console.log("editAccommodationModal getAccommodation existingImageUrls", existingImageUrls);
        } catch (error) {
            alert('An error occurred! Failed to retrieve accommodation!');
        }
    }

    useEffect(() => {
        if (props.isEditAccommodationModalOpen) {
            getAccommodation(vendor, props);

        }
    }, [props.isEditAccommodationModalOpen]);

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

        const checkInTime = new Date(selectedAccommodation.check_in_time);
        const checkOutTime = new Date(selectedAccommodation.check_out_time);

        const formattedCheckInTime = moment(checkInTime).format("HH:mm");
        const formattedCheckOutTime = moment(checkOutTime).format("HH:mm");

        const momentCheckInTime = moment(formattedCheckInTime.toString(), 'HH:mm');
        const momentCheckOutTime = moment(formattedCheckOutTime.toString(), 'HH:mm');

        form.setFieldsValue({
            accommodation_id: selectedAccommodation.accommodation_id,
            name: selectedAccommodation.name,
            description: selectedAccommodation.description,
            address: selectedAccommodation.address,
            contact_num: selectedAccommodation.contact_num,
            accommodation_image_list: existingImageUrls,
            is_published: selectedAccommodation.is_published,
            check_in_time: momentCheckInTime,
            check_out_time: momentCheckOutTime,
            type: selectedAccommodation.type,
            generic_location: selectedAccommodation.generic_location,
            room_list: selectedAccommodation.room_list,
        });

    }, [selectedAccommodation, form]);

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
    const S3BUCKET = 'tt02/accommodation';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {

            const accommodationImageName = 'Accommodation_' + selectedAccommodation.accommodation_id + '_' + file.name;

            console.log("existingImageUrls", existingImageUrls);

            // this currentFileUrl http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/Accommodation_3_Accommodation_3_art science.jpeg
            const currentFileUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/Accommodation_${selectedAccommodation.accommodation_id}_${file.name}`;

            console.log("currentFileUrl", currentFileUrl);

            console.log(file.name, " is a new image? ", !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/Accommodation_${selectedAccommodation.accommodation_id}`));

            // Check if the file is a new image (not an existing one)
            if (!existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/Accommodation_${selectedAccommodation.accommodation_id}_${file.name}`)
                && !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/${file.name}`)) {

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
                        Key: accommodationImageName,
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
                                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/Accommodation_${selectedAccommodation.accommodation_id}_${file.name}`;
                                    resolve(imageUrl);
                                }
                            });
                    });
                }
            } else {
                // If it's an existing image, return its URL directly
                return `http://tt02.s3-ap-southeast-1.amazonaws.com/accommodation/${file.name}`;
            }
        });

        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            // Now all image URLs are collected, including both new and existing ones

            setUploadedImageUrls(uploadedImageUrls);

            props.onClickSubmitEditAccommodation({
                ...form.getFieldsValue(),
                accommodation_image_list: uploadedImageUrls, // Combined list of new and existing URLs
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
            str = str + '/' + 'accommodation';
            str = str + '/' + file.name;
            // console.log("useEffect", str);
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Edit Accommodation"
                centered
                open={props.isEditAccommodationModalOpen}
                onCancel={props.onClickCancelEditAccommodationModal}
                footer={[]} // hide default buttons of modal
            >
                <Form
                    name="editAccommodation"
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
                        rules={[{ required: true, message: 'Please enter name of accommodation!' },
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="accommodation_image_list"
                        //valuePropName="fileList"
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
                        rules={[{ required: true, message: 'Please enter description of accommodation!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter address of accommodation!' },
                        { max: 100, message: 'Address should not exceed 100 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contact_num"
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
                        label="Publish?"
                        name="is_published"
                        valuePropName="checked"
                    >
                        <Switch />
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
                        label="Type"
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