import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import CustomFileUpload from "../../components/CustomFileUpload";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function CreateAttractionModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
    const [attractionName, setAttractionName] = useState('');

    const checkDuplicateTicketType = (_, value, allFields) => {
        if (value && value.length > 1) {
            const allTicketTypes = allFields.map((field) => field.ticket_type);
            const uniqueTicketTypes = new Set(allTicketTypes);

            if (uniqueTicketTypes.size !== allTicketTypes.length) {
                return Promise.reject('Duplicate ticket types are not allowed.');
            }
        }
        return Promise.resolve();
    };

    const handleAttractionNameChange = (e) => {
        const newName = e.target.value;
        setAttractionName(newName);
        console.log("attractionName: ", attractionName)
    };

    // upload file
    const S3BUCKET = 'tt02/attraction';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files; // Get the FileList object
        const fileList = [];
    
        // Loop through the selected files and add them to the fileList array
        for (let i = 0; i < selectedFiles.length; i++) {
            fileList.push(selectedFiles[i]);
        }
    
        setImageFiles(fileList); // Store the array of files in your state
    };    

    const onFinish = async (values) => {

        const uploadPromises = imageFiles.map(async (file) => {

        // Append the attraction name to the image name
        const attractionImageName = attractionName + '_' + file.name;

        // Upload file if it exists
        if (file) {
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
                Body: file,
            };

            var upload = s3
                .putObject(params)
                .on("httpUploadProgress", (evt) => {
                    console.log(
                        "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                    );
                })
                .promise();

                await upload.then((err, data) => {
                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/attraction/${attractionImageName}`;
                    console.log("imageUrl", imageUrl);
        
                    toast.success('Upload successful!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    });
        
                    console.log(err);
                    setFile(null);
        
                    // Update the uploadedImageUrls state
                    setUploadedImageUrls([imageUrl]);
                });
            }
        });
        await Promise.all(uploadPromises);
    };

    useEffect(() => {
        if (file) {
            let str = 'http://tt02.s3-ap-southeast-1.amazonaws.com';
            str = str + '/' + 'attraction';
            str = str + '/' + file.name;
            console.log("useEffect", str);
        }

    }, [file]);

    useEffect(() => {
        // Only call the parent component's function when uploadedImageUrls changes
        props.onClickSubmitAttractionCreate({ ...props.form.getFieldsValue(), attraction_image_list: uploadedImageUrls });
    }, [uploadedImageUrls]);
    
    return (
        <div>
            <Modal
                title="Create New Attraction"
                centered
                open={props.isCreateAttractionModalOpen}
                onCancel={props.onClickCancelCreateAttractionModal}
                footer={[]} // hide default buttons of modal
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
                        rules={[{ required: true, message: 'Please enter name of attraction!' },
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}

                    >
                        <Input onChange={handleAttractionNameChange} />
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        name="attraction_image_list"
                    >
                        <Input type="file" onChange={handleFileChange} />
                        <ToastContainer />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        placeholder="Description"
                        rules={[{ required: true, message: 'Please enter description of attraction!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        placeholder="Address"
                        rules={[{ required: true, message: 'Please enter address of attraction!' },
                        { max: 100, message: 'Address should not exceed 100 characters!' },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Opening Hours"
                        name="opening_hours"
                        placeholder="Opening Hours"
                        rules={[{ required: true, message: 'Please enter opening hours of attraction!' },
                        { max: 100, message: 'Opening Hours should not exceed 100 characters!' },]}
                    >
                        <Input placeholder="10am - 5pm" />
                    </Form.Item>

                    <Form.Item
                        label="Age Group"
                        name="age_group"
                        placeholder="Age Group"
                        rules={[{ required: true, message: 'Please enter target age group of attraction!' },
                        { max: 50, message: 'Age Group should not exceed 50 characters!' },]}
                    >
                        <Input placeholder="18 and older" />
                    </Form.Item>

                    <Form.Item
                        label="Contact Number"
                        name="contact_num"
                        placeholder="Contact Number"
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
                        label="Suggested Duration"
                        name="suggested_duration"
                        placeholder="Hours"
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
                        placeholder="Attraction Category"
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
                        rules={[{ required: true, message: 'Please enter closest area to the attraction!' }]}
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
                        <Form.List
                            name="price_list"
                            initialValue={[{ ticket_type: '', local_amount: 0, tourist_amount: 0 }]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{ display: 'flex', marginBottom: 8 }}
                                            align="baseline"
                                        >
                                            <div style={{ width: 110, margin: '0 8px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'ticket_type']}
                                                    rules={[
                                                        { required: true, message: 'Missing ticket type' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (value && value.length > 1) {
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
                                                                }
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Select>
                                                        <Option value="CHILD">Child</Option>
                                                        <Option value="TEENAGER">Teenager</Option>
                                                        <Option value="ADULT">Adult</Option>
                                                        <Option value="SENIOR">Senior</Option>
                                                        <Option value="ALL">All</Option>
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
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add field
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
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