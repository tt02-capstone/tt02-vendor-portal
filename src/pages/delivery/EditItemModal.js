import React, { useState, useEffect } from "react";
import {Modal, Form, Input, Switch, Button, Select, InputNumber, Timeline} from "antd";
import { getTelecomById } from "../../redux/telecomRedux";
import {getBookingById} from "../../redux/bookingRedux";
import moment from "moment/moment";
import {SmileOutlined} from "@ant-design/icons";

export default function EditItemModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;

    const [selectedBooking, setSelectedBooking] = useState();


    useEffect(() => {
        if (props.openViewModal) {
            const fetchData = async (id) => {
                const response = await getBookingById(id);
                if (response.status) {
                    console.log(response.data);
                    setSelectedBooking(response.data);
                } else {
                    console.log("Booking not fetched!");
                }
            }

            fetchData(props.id);
        }
    }, [props.openViewModal]);

    useEffect(() => {
        if (selectedBooking) {
            props.form.setFieldsValue({
                status: selectedBooking.status,
            });
        }
    }, [selectedBooking])

    const timelineItems = () => {
       const list =  [
            {
                color: 'green',
                children: 'Create a services site 2015-09-01',
            },
            {
                color: 'green',
                children: 'Create a services site 2015-09-01',
            },
            {
                color: 'red',
                children: (
                    <>
                        <p>Solve initial network problems 1</p>
                        <p>Solve initial network problems 2</p>
                        <p>Solve initial network problems 3 2015-09-01</p>
                    </>
                ),
            },
            {
                children: (
                    <>
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </>
                ),
            },
            {
                color: 'gray',
                children: (
                    <>
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </>
                ),
            },
            {
                color: 'gray',
                children: (
                    <>
                        <p>Technical testing 1</p>
                        <p>Technical testing 2</p>
                        <p>Technical testing 3 2015-09-01</p>
                    </>
                ),
            },
            {
                color: '#00CCFF',
                dot: <SmileOutlined />,
                children: <p>Custom color testing</p>,
            },
        ]
        return list
    }
    return (
        <div>
            <Modal
                title="Edit Item Status"
                centered
                open={props.openViewModal}
                onCancel={props.onClickCancelEditItemBookingModal}
                style={{minWidth: 650}}
                footer={[]} 
            >
                <Timeline
                    items={timelineItems()}
                />
                <Form
                    name="editForm"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    required={true}
                    requiredMark={true}
                    onFinish={props.onEditSubmit}
                >
                    <Form.Item
                        label="Delivery Status"
                        labelAlign="left"
                        name="status"
                        rules={[{ required: true, message: 'Please select the Delivery status!' }]}
                    >
                        <Select placeholder="Delivered">
                            <Option value="PENDING_VENDOR_DELIVERY">Pending Vendor Delivery</Option>
                            <Option value="PENDING_VENDOR_PICKUP">Pending Vendor Pickup</Option>
                            <Option value="PREPARE_FOR_SHIPMENT">Prepare for Shipment</Option>
                            <Option value="PREPARE_FOR_PICKUP">Prepare for Pickup</Option>
                            <Option value="SHIPPED_OUT">Shipped Out</Option>
                            <Option value="READY_FOR_PICKUP">Ready for Pickup</Option>
                            <Option value="DELIVERED">Delivered</Option>
                            <Option value="PICKED_UP">Picked Up</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update Delivery Status
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}