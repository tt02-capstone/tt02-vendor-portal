import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Space, Button, Select, InputNumber, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadImageToImgur } from "../../redux/attractionRedux";


export default function CreateAttractionModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [uploadedImageURLs, setUploadedImageURLs] = useState([]);

    const normFile = (e) => {
        console.log('Upload event:', e);

        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // function uploadImage() {
    //     console.log("uploadImage function");
    // }

    async function uploadImage(image) {
        console.log("HERE! uploadImage function", image);

        try {
            let response = await uploadImageToImgur(image);
            console.log('Image successfully uploaded', response)

            const imageURL = response.data.data.link;
            const updatedURLs = [...uploadedImageURLs, imageURL]; // Append the new URL to the existing list
            setUploadedImageURLs(updatedURLs); // Update the state with the new list of URLs

            return uploadedImageURLs; 

        } catch (error) {
            console.error('Error uploading image:', error);
            return uploadedImageURLs; // Return the current list of URLs in case of an error
        }
    }

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
                    onFinish={props.onClickSubmitAttractionCreate}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of attraction!' }, 
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}
                        
                    >
                        <Input />
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

                    <Form.Item label="Image Upload">
                        <Form.Item name="image" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            {/* <Upload.Dragger name="image" action={uploadImage(normFile)}
                            > */}
                                <Upload.Dragger name="files" customRequest={({ file }) => {
                                    const updatedURLs = uploadImage(file); // Call uploadImage when a file is uploaded
                                    console.log('Updated URLs:', updatedURLs);
                                }}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        </Form.Item>
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
                        <InputNumber/>
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
                        <Form.List name="price_list">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <div style={{ width: 130, margin: '0 8px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'ticket_type']}
                                                    rules={[{ required: true, message: 'Missing ticket type' }]}
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
                                            <div style={{ width: 130, margin: '0 2px' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'local_amount']}
                                                    rules={[{ required: true, message: 'Missing local price' }]}
                                                >
                                                    <InputNumber placeholder="Local Price" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'tourist_amount']}
                                                    rules={[{ required: true, message: 'Missing tourist price' }]}
                                                >
                                                    <InputNumber placeholder="Tourist Price" />
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
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}