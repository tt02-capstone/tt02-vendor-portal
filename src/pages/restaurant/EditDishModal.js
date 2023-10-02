import { React , useEffect, useState} from 'react';
import { Modal, Form, Input, Button, Select , Switch, InputNumber} from "antd";
import { getDish } from '../../redux/restaurantRedux';
import { isVisible } from '@testing-library/user-event/dist/utils';

const { Option } = Select;

export default function EditDishModal(props) {
    const [form] = Form.useForm();
    const [selectedDish, setSelectedDish] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                if (props.selectedDishId) {
                    let response = await getDish(props.selectedDishId);
                    setSelectedDish(response.data);
                    console.log(response.data);
                }
            } catch (error) {
                alert ('An error occur! Failed to retrieve dish!');
            }    
        };
        fetchData();
    }, [props.isVisible]);

    useEffect(() => {
        form.setFieldsValue({
            name: selectedDish.name,
            price: selectedDish.price,
            spicy: selectedDish.spicy,
            is_signature: selectedDish.is_signature,
            dish_type: selectedDish.dish_type
        });

    }, [selectedDish, form]);

    useEffect(() => {
        if (props.onCancel || props.onSubmit) {
            form.resetFields(); // Reset the form fields
        }
    }, [props.onCancel, form]);

    return (
        <div>
            <Modal
                title="Edit Dish"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="editDishForm"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 600 }}
                    onFinish={props.onSubmit}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name of the dish!' }]}
                    >
                        <Input placeholder="Dish Name"  />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price of the dish!' }]}
                    >
                        <InputNumber  min={0} />
                    </Form.Item>

                    <Form.Item
                        label="Is Spicy?"
                        name="spicy"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Is Signature?"
                        name="is_signature"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        label="Dish Type"
                        name="dish_type"
                        placeholder="Dish Type"
                        rules={[{ required: true, message: 'Please select the dish type!' }]}>
                        <Select>
                            <Option value='BEVERAGE'>BEVERAGE</Option>
                            <Option value='MAINS'>MAINS</Option>
                            <Option value='SIDES'>SIDES</Option>
                            <Option value='DESSERT'>DESSERT</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 11, span: 10 }}>
                        <Button type="primary" htmlType="submit">
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}