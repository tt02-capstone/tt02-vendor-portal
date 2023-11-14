import React, {useState, useEffect} from "react";
import {Modal, Form, Input, Space, Button, Select, Switch, InputNumber, Upload, TimePicker} from "antd";
import {MinusCircleOutlined, PlusOutlined, InboxOutlined, UploadOutlined} from '@ant-design/icons';
import {ToastContainer, toast} from 'react-toastify';


export default function ExportModal(props) {
    const [form] = Form.useForm();
    const {Option} = Select;
    let initialValues = {};
    console.log(props)


    return (
        <div>
            <Modal
                title={<div style={{textAlign: 'center'}}>Export Data</div>}
                centered
                style={{maxWidth: 450, marginBottom: 20, justifyContent: 'center', alignItems: 'center'}}
                open={props.isExportModalOpen}
                onCancel={props.onClickCancelManageExportButton}
                footer={[]} // hide default buttons of modal
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    required={true}
                    requiredMark={true}
                    style={{marginTop: 30,marginRight: 50}}
                    onFinish={props.onClickSubmitExport}
                    initialValues={initialValues}
                >


                    <div>
                        <Form.Item
                            label="Export As"
                            name="fileType"
                            rules={[{required: true, message: 'Please select the file type'}]}
                        >

                            <Select>
                                <Option value='pdf'>PDF</Option>
                                <Option value='csv'>CSV</Option>
                                <Option value='png'>PNG</Option>
                                <Option value='jpeg'>JPEG</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="File Name"
                            name="fileName"
                            placeholder="File Name"
                            rules={[{required: true, message: 'Please indicate the file name'}]}
                        >
                            <Input/>
                        </Form.Item>

                    </div>

                    <Form.Item wrapperCol={{offset: 10, span: 16}}>

                        <Button type="primary" htmlType="submit">
                            Export
                        </Button>


                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}