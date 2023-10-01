import React, {useState, useEffect} from "react";
import {Modal, Form, Input, Switch, Button, Select, DatePicker, InputNumber, Upload} from "antd";
import moment from "moment/moment";
import {PlusOutlined} from "@ant-design/icons";
import AWS from "aws-sdk";
import {getLastDealId} from "../../redux/dealRedux";
import {toast} from "react-toastify";
import {disabledTimeChecker, disabledDateChecker} from "../../helper/dateFormat";

const {RangePicker} = DatePicker;


export default function CreateDealModal(props) {
    const [imageFiles, setImageFiles] = useState([]);
    const [lastDealId, setLastDealId] = useState(null);
    const [dealId, setDealId] = useState(null);
    const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
    const {TextArea} = Input;
    const {Option} = Select;

    useEffect(() => {

        async function fetchLastDealId() {
            try {
                const response = await getLastDealId();
                if (response.status) {
                    console.log("fetchLastdealId response", response);
                    setLastDealId(response.data);
                    const newDealId = response.data + 1;
                    setDealId(newDealId);
                    console.log("lastdealId", response.data);
                    console.log("dealId", newDealId);
                } else {
                    console.error("Error fetching last deal_id: ", response.data);
                }
            } catch (error) {
                console.error("Error fetching dealId: ", error);
            }
        }

        fetchLastDealId();
    }, [dealId]);

    function handleRemove(file) {
        const updatedFiles = imageFiles.filter((item) => item.uid !== file.uid);
        setImageFiles(updatedFiles);
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    const handleFileChange = (e) => {
        const fileList = e.fileList;
        setImageFiles(fileList);
    }

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    // upload file
    const S3BUCKET = 'tt02/deals';
    const TT02REGION = 'ap-southeast-1';
    const ACCESS_KEY = 'AKIART7KLOHBGOHX2Y7T';
    const SECRET_ACCESS_KEY = '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';

    const [file, setFile] = useState(null);

    const onFinish = async (values) => {
        const uploadPromises = imageFiles.map(async (file) => {
            const dealImageName = 'Deal_' + dealId + '_' + file.name;
            const blob = new Blob([file.originFileObj]);

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
                            console.log(
                                "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
                            );
                        })
                        .send((err, data) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                const imageUrl = `http://tt02.s3-ap-southeast-1.amazonaws.com/deals/${dealImageName}`;
                                console.log("imageUrl", imageUrl);
                                resolve(imageUrl);
                            }
                        });
                });
            }
        });

        try {
            const uploadedImageUrls = await Promise.all(uploadPromises);
            console.log("All images uploaded:", uploadedImageUrls);

            // toast.success('Upload successful!', {
            //     position: toast.POSITION.TOP_RIGHT,
            //     autoClose: 1500
            // });

            setUploadedImageUrls(uploadedImageUrls);

            const newDealId = dealId + 1;
            setDealId(newDealId);
            console.log("nextDealId", dealId);

            props.onCreateSubmit({ ...props.form.getFieldsValue(), deal_image_list: uploadedImageUrls });

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
            str = str + '/' + 'Deal_' + dealId + '_' + file.name;
            console.log("useEffect", str);
        }

    }, [file]);


    return (
        <div>
            <Modal
                title="Create New Deal"
                centered
                open={props.openCreateDealModal}
                onCancel={props.cancelDealModal}
                style={{minWidth: 650}}
                footer={[]}
            >
                <Form
                    name="form"
                    form={props.form}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    style={{maxWidth: 600}}
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
                        name="deal_image_list"
                        valuePropName="fileList"
                        labelAlign="left"
                        getValueFromEvent={normFile}
                        rules={[
                            { required: true, message: 'Please upload at least one image!' },
                        ]}
                    >
                        <Upload
                            beforeUpload={() => false} // To prevent auto-upload on file selection
                            multiple
                            listType="picture-card"
                            fileList={imageFiles}
                            onRemove={handleRemove}
                            onChange={handleFileChange}
                        >
                            {imageFiles.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Discount Percentage"
                        labelAlign="left"
                        name="discount_percent"
                        rules={[{required: true, message: 'Please enter discount of deal!'}]}
                    >
                        <InputNumber placeholder="10.00" prefix="%" min="0" max="100" step="0.10"/>
                    </Form.Item>

                    <Form.Item
                        label="Publish"
                        labelAlign="left"
                        name="is_published"
                        initialValue={true}
                        valuePropName="checked"
                        rules={[{required: true, message: 'Please select whether to publish the deal!'}]}
                    >
                        <Switch />
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


                    <Form.Item name="promo_date_time"
                               label="Start and End DateTime"
                               labelAlign="left"
                               rules={[{required: true, message: 'Please enter the validity duration of deal!'}]}
                    >
                        <RangePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate= {disabledDateChecker}
                            disabledTime={disabledTimeChecker}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Publish Date"
                        name="publish_date"
                        labelAlign="left"

                        rules={[{required: true, message: 'Please select a publish date!'}]}
                    >
                        <DatePicker
                            style={{width: '100%'}}
                            format="YYYY-MM-DD"
                            disabledDate = {disabledDateChecker}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 11, span: 16}}>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>


                </Form>
            </Modal>
        </div>
    )
}