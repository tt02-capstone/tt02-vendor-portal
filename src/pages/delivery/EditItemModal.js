import React, {useState, useEffect} from "react";
import {Modal, Form, Input, Switch, Button, Select, InputNumber, Timeline, Typography, Alert, Space} from "antd";
import {getBookingById} from "../../redux/bookingRedux";
import {MehOutlined, SmileOutlined} from "@ant-design/icons";

const {Title} = Typography;

export default function EditItemModal(props) {

    const {TextArea} = Input;
    const {Option} = Select;

    const [selectedBooking, setSelectedBooking] = useState();
    const [deliveryStatus, setDeliveryStatus] = useState('PENDING_VENDOR_DELIVERY');
    const deliveryStatusOrder = ['PENDING_VENDOR_DELIVERY', 'PREPARE_FOR_SHIPMENT', 'SHIPPED_OUT', 'DELIVERED'];
    const pickupStatusOrder = ['PENDING_VENDOR_PICKUP', 'PREPARE_FOR_PICKUP', 'READY_FOR_PICKUP', 'PICKED_UP'];

    const statusDisplayNames = {
        PENDING_VENDOR_DELIVERY: 'Pending Vendor Delivery',
        PREPARE_FOR_SHIPMENT: 'Prepare for Shipment',
        SHIPPED_OUT: 'Shipped Out',
        DELIVERED: 'Delivered',
        PENDING_VENDOR_PICKUP: 'Pending Vendor Pickup',
        PREPARE_FOR_PICKUP: 'Prepare for Pickup',
        READY_FOR_PICKUP: 'Ready for Pickup',
        PICKED_UP: 'Picked Up',
    };


    useEffect(() => {
        if (props.openViewModal) {
            const fetchData = async (id) => {
                const response = await getBookingById(id);
                if (response.status) {
                    console.log(response.data);
                    setSelectedBooking(response.data);
                    setDeliveryStatus(response.data.status)
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

    const checkColour = (curr, rest) => {
        if (rest < curr) {
            return 'green'
        } else if (curr === 3) {
            return 'green'
        } else if (curr === rest) {
            return 'blue'
        } else {
            return 'gray'
        }
    }
    const timelineItems = () => {
        const itemPoints = deliveryStatusOrder.includes(deliveryStatus) ? deliveryStatusOrder : pickupStatusOrder
        const currIndex = itemPoints.indexOf(deliveryStatus)
        const list = [
            {
                color: checkColour(currIndex, 0),
                children: statusDisplayNames[itemPoints[0]],
            },
            {
                color: checkColour(currIndex, 1),
                children: statusDisplayNames[itemPoints[1]],
            },
            {
                color: checkColour(currIndex, 2),
                children: statusDisplayNames[itemPoints[2]],
            },
            {
                color: checkColour(currIndex, 3),
                dot: currIndex === 3 ? <SmileOutlined/> : <MehOutlined/>,
                children: statusDisplayNames[itemPoints[3]],
            },
        ];
        return list
    }
    return (
        <div>
            <Modal
                title="Edit Item Status"
                centered
                open={props.openViewModal}
                onCancel={props.onClickCancelEditItemBookingModal}
                style={{minWidth: 650, justifyContent: 'center', alignItems: 'center' }}
                footer={[]}
            >
                <Timeline
                    style={{margin: 20}}
                    mode={"alternate"}
                    items={timelineItems()}
                />
                {selectedBooking && (selectedBooking.status === 'DELIVERED' || selectedBooking.status === 'PICKED_UP') ?
                    (  <Space direction="vertical" style={{ width: '100%' }}>
                        <Alert
                            message= {`Final Status:  ${statusDisplayNames[selectedBooking.status]}`}
                            description= {`The Item was successfully ${statusDisplayNames[selectedBooking.status]} !`}
                            type="success"
                            showIcon
                        />
                    </Space>
                    )
                    :
                    (<Form
                        name="editForm"
                        form={props.form}
                        labelCol={{span: 8}}
                        wrapperCol={{span: 16}}
                        style={{maxWidth: 600}}
                        required={true}
                        requiredMark={true}
                        onFinish={props.onEditSubmit}
                    >
                        <Form.Item
                            label="Delivery Status"
                            labelAlign="left"
                            name="status"
                            rules={[{required: true, message: 'Please select the Delivery status!'}]}
                        >
                            <Select placeholder="Delivered">
                                {deliveryStatusOrder.includes(deliveryStatus) ? (
                                    <>
                                        <Option value="PENDING_VENDOR_DELIVERY">Pending Vendor Delivery</Option>
                                        <Option value="PREPARE_FOR_SHIPMENT">Prepare for Shipment</Option>
                                        <Option value="SHIPPED_OUT">Shipped Out</Option>
                                    </>
                                ) : (
                                    <>
                                        <Option value="PENDING_VENDOR_PICKUP">Pending Vendor Pickup</Option>
                                        <Option value="PREPARE_FOR_PICKUP">Prepare for Pickup</Option>
                                        <Option value="READY_FOR_PICKUP">Ready for Pickup</Option>
                                    </>
                                )}
                            </Select>
                        </Form.Item>


                        <Form.Item wrapperCol={{offset: 11, span: 16}}>
                            <Button type="primary" htmlType="submit">
                                Update Delivery Status
                            </Button>
                        </Form.Item>
                    </Form>
                    )}

            </Modal>
        </div>
    )
}