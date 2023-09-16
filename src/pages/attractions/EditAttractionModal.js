import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch, InputNumber, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getAttractionByVendor } from "../../redux/attractionRedux";

export default function EditAttractionModal(props) {

    const { Option } = Select;
    const [form] = Form.useForm();
    const [selectedAttraction, setSelectedAttraction] = useState([]);
    const [priceList, setPriceList] = useState([]);
    const vendor = JSON.parse(localStorage.getItem("user"));

    async function getAttraction(vendor, props) {
        try {
            let response = await getAttractionByVendor(vendor.vendor_id, props.attractionId);
            setSelectedAttraction(response.data);
            setPriceList(response.data.price_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
        // console.log('useEffect editAttraction selectedAttraction:', selectedAttraction);
        // console.log('useEffect editAttraction priceList:', priceList);
    }, [selectedAttraction, priceList])

    useEffect(() => {
        if (props.isEditAttractionModalOpen) {
            getAttraction(vendor.vendor, props);
        }
    }, [props.isEditAttractionModalOpen]);

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
            // img list, est price tier
        });

    }, [selectedAttraction, form]);



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
                    onFinish={props.onClickSubmitEditAttraction} 
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of attraction!' }, 
                        { max: 128, message: 'Name should not exceed 128 characters!' },]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please enter description of attraction!' },
                        { max: 800, message: 'Description should not exceed 800 characters!' }]}
                    >
                        <Input placeholder="Description" />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please enter address of attraction!' },
                        { max: 100, message: 'Address should not exceed 100 characters!' },]}
                    >
                        <Input placeholder="Address" />
                    </Form.Item>

                    <Form.Item
                        label="Opening Hours"
                        name="opening_hours"
                        rules={[{ required: true, message: 'Please enter opening hours of attraction!' },
                        { max: 100, message: 'Opening Hours should not exceed 100 characters!' },]}
                    >
                        <Input placeholder="Opening Hours" />
                    </Form.Item>

                    <Form.Item
                        label="Age Group"
                        name="age_group"
                        rules={[{ required: true, message: 'Please enter target age group of attraction!' },
                        { max: 50, message: 'Age Group should not exceed 50 characters!' },]}
                    >
                        <Input placeholder="Address" />
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
                        <Input placeholder="Contact Number" />
                    </Form.Item>

                    {/* img list */}

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
                        <InputNumber placeholder="Suggested Duration" />
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
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}