import { React , useEffect} from 'react';
import { Modal, Form, Input, Button, Select , Switch, InputNumber} from "antd";

const { Option } = Select;

export default function AddDishModal(props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (props.onCancel || props.onSubmit) {
            form.resetFields(); // Reset the form fields
        }
    }, [props.onCancel, form]);

    return (
        <div>
            <Modal
                title="Add Dish"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="addDishForm"
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
                        <Input  placeholder="Dish Name"  />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price of the dish!' }]}
                    >
                        <InputNumber />
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
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}