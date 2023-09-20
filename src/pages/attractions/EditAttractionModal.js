import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch, InputNumber, Space, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getAttractionByVendor } from "../../redux/attractionRedux";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditAttractionModal(props) {

    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedAttraction, setSelectedAttraction] = useState([]);
    const [editedAttractionName, setEditedAttractionName] = useState('');
    const [priceList, setPriceList] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getAttraction(vendor, props) {
        try {
            let response = await getAttractionByVendor(vendor.user_id, props.attractionId);
            // console.log("getAttraction response data", response.data);
            setSelectedAttraction(response.data);
            setPriceList(response.data.price_list);
            
            // console.log("getAttraction response data", response.data);
            const newExistingImageUrls = response.data.attraction_image_list || [];
            // console.log("editAttractionModal getAttraction newExistingImageUrls", newExistingImageUrls);

            setExistingImageUrls(newExistingImageUrls);
            
            // console.log("editAttractionModal getAttraction existingImageUrls", existingImageUrls);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
        if (props.isEditAttractionModalOpen) {
            getAttraction(vendor, props);

        }
    }, [props.isEditAttractionModalOpen]);

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
            attraction_id: selectedAttraction.attraction_id,
            name: selectedAttraction.name,
            description: selectedAttraction.description,
            address: selectedAttraction.address,
            opening_hours: selectedAttraction.opening_hours,
            age_group: selectedAttraction.age_group,
            contact_num: selectedAttraction.contact_num,
            is_published: selectedAttraction.is_published,
            suggested_duration: selectedAttraction.suggested_duration,
            avg_rating_tier: selectedAttraction.avg_rating_tier,
            attraction_category: selectedAttraction.attraction_category,
            generic_location: selectedAttraction.generic_location,
            price_list: selectedAttraction.price_list,
            attraction_image_list: existingImageUrls,
            // est price tier
        });

    }, [selectedAttraction, form]);

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

    const handleAttractionNameChange = (e) => {
        const newName = e.target.value;
        setEditedAttractionName(newName);
        console.log("editedAttractionName: ", editedAttractionName)
    };

    // upload file
    const S3BUCKET = 'tt02/attraction';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
    
            let currentAttractionName = editedAttractionName || selectedAttraction.name;
            let attractionImageName = file.name;
    
            // Check if attraction name is not already part of the file name
            if (!file.name.startsWith(currentAttractionName + '_')) {
                attractionImageName = currentAttractionName + '_' + file.name;
            }
    
            // Check if the file is a new image (not an existing one)
            if (!existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/attraction/${attractionImageName}`)) {
                
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
                                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/attraction/${attractionImageName}`;
                                    resolve(imageUrl);
                                }
                            });
                    });
                }
            } else {
                // If it's an existing image, return its URL directly
                return `http://tt02.s3-ap-southeast-1.amazonaws.com/attraction/${attractionImageName}`;
            }
        });
    
        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            // Now all image URLs are collected, including both new and existing ones
    
            setUploadedImageUrls(uploadedImageUrls);
    
            props.onClickSubmitEditAttraction({
                ...form.getFieldsValue(),
                attraction_image_list: uploadedImageUrls, // Combined list of new and existing URLs
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
            str = str + '/' + 'attraction';
            str = str + '/' + file.name;
            console.log("useEffect", str);
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Edit Attraction"
                centered
                open={props.isEditAttractionModalOpen}
                onCancel={props.onClickCancelEditAttractionModal}
                footer={[]} // hide default buttons of modal
            >
                <Form
                    name="editAttraction"
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
                        rules={[{ required: true, message: 'Please enter name of attraction!' },
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}
                    >
                        <Input onChange={handleAttractionNameChange} />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="attraction_image_list"
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
                        rules={[{ required: true, message: 'Please enter description of attraction!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter address of attraction!' },
                        { max: 100, message: 'Address should not exceed 100 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Opening Hours"
                        name="opening_hours"
                        rules={[{ required: true, message: 'Please enter opening hours of attraction!' },
                        { max: 100, message: 'Opening Hours should not exceed 100 characters!' },]}
                    >
                        <Input placeholder="10am - 5pm" />
                    </Form.Item>

                    <Form.Item
                        label="Age Group"
                        name="age_group"
                        rules={[{ required: true, message: 'Please enter target age group of attraction!' },
                        { max: 50, message: 'Age Group should not exceed 50 characters!' },]}
                    >
                        <Input placeholder="18 and older" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contact_num"
                        rules={[
                            { required: true, message: 'Please enter contact number of attraction!' },
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
                        label="Suggested Duration"
                        name="suggested_duration"
                        rules={[
                            { required: true, message: 'Please enter suggested duration for attraction in hours!' },
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
                        <InputNumber suffix="Hours" />
                    </Form.Item>

                    <Form.Item
                        label="Attraction Category"
                        name="attraction_category"
                        rules={[{ required: true, message: 'Please select attraction category of the attraction!' }]}
                    >
                        <Select>
                            <Option value='HISTORICAL'>Historical</Option>
                            <Option value='CULTURAL'>Cultural</Option>
                            <Option value='NATURE'>Nature</Option>
                            <Option value='ADVENTURE'>Adventure</Option>
                            <Option value='SHOPPING'>Shopping</Option>
                            <Option value='ENTERTAINMENT'>Entertainment</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Generic Location"
                        name="generic_location"
                        rules={[{ required: true, message: 'Please select closest area to the attraction!' }]}
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

                    <Form.Item
                        label="Price List"
                        name="prices"
                    >
                        <Form.List name="price_list">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <div style={{ width: 110, margin: '0 8px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'ticket_type']}
                                                    rules={[
                                                        { required: true, message: 'Missing ticket type' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                const allTicketTypes = getFieldValue('price_list').map(
                                                                    (item) => item.ticket_type
                                                                );
                                                                if (
                                                                    allTicketTypes.filter(
                                                                        (type) => type === value
                                                                    ).length === 1
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject('Duplicate ticket types are not allowed.');
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Select>
                                                        <Option value='CHILD'>Child</Option>
                                                        <Option value='TEENAGER'>Teenager</Option>
                                                        <Option value='ADULT'>Adult</Option>
                                                        <Option value='SENIOR'>Senior</Option>
                                                        <Option value='ALL'>All</Option>
                                                    </Select>
                                                </Form.Item>
                                            </div>
                                            <div style={{ width: 130, margin: '0 1px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'local_amount']}
                                                    rules={[{ required: true, message: 'Missing local price' }]}
                                                >
                                                    <InputNumber placeholder="Local Price" style={{ width: '110px' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'tourist_amount']}
                                                    rules={[{ required: true, message: 'Missing tourist price' }]}
                                                >
                                                    <InputNumber placeholder="Tourist Price" style={{ width: '110px' }} />
                                                </Form.Item>
                                            </div>
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
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