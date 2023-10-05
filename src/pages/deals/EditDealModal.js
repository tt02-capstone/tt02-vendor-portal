import React, { useState, useEffect } from "react";
import {Modal, Form, Input, Button, Select, Switch, InputNumber, Space, Upload, DatePicker} from "antd";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {getDealById} from "../../redux/dealRedux";
import { ToastContainer, toast } from 'react-toastify';
import AWS from 'aws-sdk';
import dayjs from "dayjs";
import moment from "moment/moment";
import {disabledDateChecker, disabledTimeChecker} from "../../helper/dateFormat";

const { RangePicker } = DatePicker

window.Buffer = window.Buffer || require("buffer").Buffer;

export default function EditDealModal(props) {

    const { TextArea } = Input;
    const { Option } = Select;
    const [selectedDeal, setSelectedDeal] = useState([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [file, setFile] = useState(null);
    const [existingImageUrls, setExistingImageUrls] = useState([]);

    async function getDeal(props) {
        try {
            let response = await getDealById(props.selectedDealId);
            console.log("getDeal response data", response.data);
            setSelectedDeal(response.data);
            console.log("getDeal response data", response.data);
            const newExistingImageUrls = response.data.deal_image_list || [];
            console.log("editDealModal getDeal newExistingImageUrls", newExistingImageUrls);

            setExistingImageUrls(newExistingImageUrls);

            console.log("editDealModal getDeal existingImageUrls", existingImageUrls);
        } catch (error) {
            alert('An error occurred! Failed to retrieve deal!');
        }
    }

    useEffect(() => {
        if (props.editDealModal) {
            getDeal(props);

        }
    }, [props.editDealModal]);

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
        let promo_date_time = [
            dayjs(selectedDeal.start_datetime),
            dayjs(selectedDeal.end_datetime)
        ]
        props.form.setFieldsValue({
            deal_id: selectedDeal.deal_id,
            promo_code: selectedDeal.promo_code,
            discount_percent: selectedDeal.discount_percent,
            promo_date_time: promo_date_time,
            is_published: selectedDeal.is_published,
            is_govt_voucher: selectedDeal.is_govt_voucher,
            deal_type: selectedDeal.deal_type,
            deal_image_list: existingImageUrls,
        });

    }, [selectedDeal, props.form]);

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
        console.log(imageFiles, file)
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        setImageFiles(updatedFiles);
        console.log(imageFiles)
    }

    // upload file
    const S3BUCKET = 'tt02/deals';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {

            const dealImageName = 'Deal_' + selectedDeal.deal_id + '_' + file.name;

            console.log("existingImageUrls", existingImageUrls);

            // this currentFileUrl http://tt02.s3-ap-southeast-1.amazonaws.com/deals/Deal_3_Deal_3_art science.jpeg
            const currentFileUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/deals/Deal_${selectedDeal.deal_id}_${file.name}`;

            console.log("currentFileUrl", currentFileUrl);

            console.log(file.name, " is a new image? ", !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/deals/Deal_${selectedDeal.deal_id}`));

            // Check if the file is a new image (not an existing one)
            if (!existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/deals/Deal_${selectedDeal.deal_id}_${file.name}`)
                && !existingImageUrls.includes(`http://tt02.s3-ap-southeast-1.amazonaws.com/deals/${file.name}`)) {

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
                        Key: dealImageName,
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
                                    const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/deals/Deal_${selectedDeal.deal_id}_${file.name}`;
                                    resolve(imageUrl);
                                }
                            });
                    });
                }
            } else {
                // If it's an existing image, return its URL directly
                return `http://tt02.s3-ap-southeast-1.amazonaws.com/deals/${file.name}`;
            }
        });

        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            // Now all image URLs are collected, including both new and existing ones

            setUploadedImageUrls(uploadedImageUrls);

            props.onEditSubmit({
                ...props.form.getFieldsValue(),
                deal_image_list: uploadedImageUrls, // Combined list of new and existing URLs
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
            str = str + '/' + 'deals';
            str = str + '/' + file.name;
            // console.log("useEffect", str);
        }

    }, [file]);

    return (
        <div>
            <Modal
                title="Edit Deal"
                centered
                open={props.editDealModal}
                onCancel={props.onCancelEditModal}
                style={{minWidth: 650}}
                footer={[]} // hide default buttons of modal
            >
                <Form
                    name="editDeal"
                    form={props.form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 650 }}
                    required={true}
                    requiredMark={true}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Promo Code"
                        labelAlign="left"
                        name="promo_code"
                        rules={[{required: true, message: 'Please enter name of Promo Code!'},
                            {max: 10, message: 'Name should not exceed 10 characters!'},]}

                    >
                        <Input placeholder="Promo_code"/>
                    </Form.Item>

                    <Form.Item
                        label="Images"
                        labelAlign="left"
                        name="deal_image_list"
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
                        label="Discount Percentage"
                        labelAlign="left"
                        name="discount_percent"
                        rules={[{required: true, message: 'Please enter discount of deal!'}]}
                    >
                        <InputNumber placeholder="10.00" suffix="%" min="0" max="100" step="0.50"/>
                    </Form.Item>

                    <Form.Item
                        label="Publish"
                        labelAlign="left"
                        name="is_published"
                        initialValue={true}
                        valuePropName="checked"
                        rules={[{required: true, message: 'Please select whether to publish the deal!'}]}
                    >
                        <Switch/>
                    </Form.Item>

                    <Form.Item
                        label="Government Voucher"
                        labelAlign="left"
                        name="is_govt_voucher"
                        initialValue={true}
                        valuePropName="checked"
                        rules={[{required: true, message: 'Please select whether the deal is from the Government!'}]}
                    >
                        <Switch/>
                    </Form.Item>

                    <Form.Item
                        label="Deal Type"
                        labelAlign="left"
                        name="deal_type"
                        rules={[{required: true, message: 'Please enter the type of deal!'}]}
                    >
                        <Select placeholder="Chinese New Year">
                            <Option value='CHINESE_NEW_YEAR'>Chinese New Year</Option>
                            <Option value="NATIONAL_DAY">National Day</Option>
                            <Option value="DEEPAVALLI">Deepavalli</Option>
                            <Option value="VALENTINES">Valentines</Option>
                            <Option value="NEW_YEAR_DAY">New Year Day</Option>
                            <Option value="HARI_RAYA">Hari Raya</Option>
                            <Option value="NUS_WELLBEING_DAY">NUS Wellbeing Day</Option>
                            <Option value="SINGLES_DAY">Singles Day</Option>
                            <Option value="BLACK_FRIDAY">Black Friday</Option>
                            <Option value="CHRISTMAS">Christmas</Option>
                            <Option value="GOVERNMENT">Government</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="promo_date_time"
                        label="Start and End DateTime"
                        labelAlign="left"
                        rules={[{required: true, message: 'Please enter the validity duration of deal!'}]}
                    >
                        <RangePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDateChecker}
                            disabledTime={disabledTimeChecker}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}