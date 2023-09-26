import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Badge, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTourTypesByLocal, createTourType } from "../../redux/tourRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import CustomButton from "../../components/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import CreateTourTypeModal from "./CreateTourTypeModal";

export default function TourTypes() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const local = JSON.parse(localStorage.getItem("user"));

    const [getTourTypesData, setGetTourTypesData] = useState(true);
    const [tourTypes, setTourTypes] = useState([]);
    const [tourTypeImages, setTourTypeImages] = useState({});

    const viewTourTypesBreadCrumb = [
        {
            title: 'Tour Types',
        }
    ];


    useEffect(() => {
        if (getTourTypesData) {
            const fetchTourTypesData = async () => {
                const response = await getAllTourTypesByLocal(local.user_id);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setTourTypes(tempData);
                    setGetTourTypesData(false);
                } else {
                    console.log("List of tour types not fetched!");
                }
            }

            fetchTourTypesData();
            setGetTourTypesData(false);
        }
    }, [getTourTypesData]);

    const tourTypesColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 70
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 100
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 40
        },
        {
            title: 'No. of Pax',
            dataIndex: 'recommended_pax',
            key: 'recommended_pax',
            width: 40
        },
        {
            title: 'Est. Duration',
            dataIndex: 'estimated_duration',
            key: 'estimated_duration',
            width: 40
        },
        {
            title: 'Special Notes',
            dataIndex: 'special_note',
            key: 'special_note',
            width: 100
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 100,
        }
    ];

    const [createTourTypeForm] = Form.useForm();
    const [isCreateTourTypeModalOpen, setIsCreateTourTypeModalOpen] = useState(false);

    function onClickOpenCreateTourTypeModal() {
        setIsCreateTourTypeModalOpen(true);
    }

    function onClickCancelCreateTourTypeModal() {
        setIsCreateTourTypeModalOpen(false);
    }

    async function onClickSubmitTourTypeCreate(values) {
        console.log(values);
        let tourTypeObj = {
            name: values.name,
            description: values.description,
            price: values.price,
            recommended_pax: values.recommended_pax,
            special_note: values.special_note,
            estimated_duration: values.estimated_duration,
            tour_image_list: values.tour_image_list,
            is_published: true
        }

        let response = await createTourType(local.user_id, values.attraction, tourTypeObj);
        if (response.status) {
            createTourTypeForm.resetFields();
            setGetTourTypesData(true);
            setIsCreateTourTypeModalOpen(false);
            toast.success('Tour type successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    const updateTourTypeImages = (tourTypeId, imageFileName) => {
        setTourTypeImages((prevImages) => ({
            ...prevImages,
            [tourTypeId]: [...(prevImages[tourTypeId] || []), imageFileName],
        }));
    };

    const removeTourTypeImage = (tourTypeId, imageFileName) => {
        setTourTypeImages((prevImages) => ({
            ...prevImages,
            [tourTypeId]: prevImages[tourTypeId].filter(
                (fileName) => fileName !== imageFileName
            ),
        }));
    };

    return local ? (
        <div>
            <Layout style={styles.layout}>
                {/* <CustomHeader text={"Header"} /> */}
                <CustomHeader items={viewTourTypesBreadCrumb} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>
                        <CustomButton
                            text="Create Tour Type"
                            style={{ marginLeft: '3px', marginBottom: '20px' }}
                            icon={<PlusOutlined />}
                            onClick={onClickOpenCreateTourTypeModal}
                        />

                        {/* pagination */}
                        <CustomTablePagination
                            title="Tour Types"
                            column={tourTypesColumns}
                            data={tourTypes}
                            tableLayout="fixed"
                        />

                        {/* Modal to create new tour type */}
                        <CreateTourTypeModal
                            form={createTourTypeForm}
                            isCreateTourTypeModalOpen={isCreateTourTypeModalOpen}
                            onClickCancelCreateTourTypeModal={onClickCancelCreateTourTypeModal}
                            onClickSubmitTourTypeCreate={onClickSubmitTourTypeCreate}
                            onUpdateImages={updateTourTypeImages}
                            onRemoveImage={removeTourTypeImage}
                        />
                    </Content>
                </Layout>
            </Layout>

            <ToastContainer />
        </div>
    ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '91.5vw'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "98%"
    },
    customRow: {
        height: '280px',
    },
    imageContainer: {
        maxWidth: '180px',
        maxHeight: '100px',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
}