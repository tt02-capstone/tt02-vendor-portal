import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAttractionListByVendor, getAttractionByVendor, createAttraction, updateAttraction } from "../../redux/attractionRedux";
import CustomHeader from "../../components/CustomHeader";
import CreateAttractionModal from "./CreateAttractionModal";
import ViewAttractionModal from "./ViewAttractionModal";
import EditAttractionModal from "./EditAttractionModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';

export default function AttractionManagement() {

    const navigate = useNavigate();
    // const { Header, Content, Sider, Footer } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    // attractions table pagination
    const [getAttractionsData, setGetAttractionsData] = useState(true);
    const [attractionsData, setAttractionsData] = useState([]); // list of attractions
    const [selectedAttractionId, setSelectedAttractionId] = useState(null);
    const [selectedAttraction, setSelectedAttraction] = useState([]);
    const [priceList, setPriceList] = useState([]);

    const attractionsColumns = [
        {
            title: 'Id',
            dataIndex: 'attraction_id',
            key: 'attraction_id',
        },
        {
            title: 'Image',
            dataIndex: 'img_list[0]',
            key: 'img_list[0]',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Category',
            dataIndex: 'attraction_category',
            key: 'attraction_category',
            render: (attractionCategory) => {
                let tagColor = 'default'; // Default color
                switch (attractionCategory) {
                    case 'HISTORICAL':
                        tagColor = 'purple';
                        break;
                    case 'CULTURAL':
                        tagColor = 'volcano';
                        break;
                    case 'NATURE':
                        tagColor = 'magenta';
                        break;
                    case 'ADVENTURE':
                        tagColor = 'geekblue';
                        break;
                    case 'SHOPPING':
                        tagColor = 'gold';
                        break;
                    case 'ENTERTAINMENT':
                        tagColor = 'cyan';
                        break;
                    default:
                        break;
                }
        
                return (
                    <Tag color={tagColor}>{attractionCategory}</Tag>
                );
            }
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Opening Hours',
            dataIndex: 'opening_hours',
            key: 'opening_hours',
        },
        {
            title: 'Age Group',
            dataIndex: 'age_group',
            key: 'age_group',
        },
        {
            title: 'Contact Num',
            dataIndex: 'contact_num',
            key: 'contact_num',
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
            }
        },
        {
            title: 'Average Rating',
            dataIndex: 'avg_rating_tier',
            key: 'avg_rating_tier',
        },
        {
            title: 'Location Area',
            dataIndex: 'generic_location',
            key: 'generic_location',
        },
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            render: (priceTier) => {
                let tagColor = 'default'; // Default color
                switch (priceTier) {
                    case 'TIER 1':
                        tagColor = 'green';
                        break;
                    case 'TIER 2':
                        tagColor = 'orange';
                        break;
                    case 'TIER 3':
                        tagColor = 'red';
                        break;
                    case 'TIER 4':
                        tagColor = 'blue';
                        break;
                    case 'TIER 5':
                        tagColor = 'yellow';
                        break;
                    default:
                        break;
                }
        
                return (
                    <Tag color={tagColor}>{priceTier}</Tag>
                );
            }
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <Space>
                    <CustomButton
                        text="View"
                        onClick={() => onClickOpenViewAttractionModal(record.attraction_id)}
                    />
                    <CustomButton
                        text="Edit"
                        onClick={() => onClickOpenEditAttractionModal(record.attraction_id)}
                    />

                </Space>
            }
        },
    ];

    const formattedAttractionsData = attractionsData.map((item, index) => {
        const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
        const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
        const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;

        return {
            key: index,
            attraction_id: item.attraction_id,
            img_list: item.attraction_image_list,
            name: item.name,
            attraction_category: item.attraction_category,
            address: item.address,
            opening_hours: item.opening_hours,
            age_group: item.age_group,
            contact_num: formattedContactNum,
            is_published: item.is_published,
            avg_rating_tier: formattedAvgRatingTier,
            generic_location: formattedGenericLocation,
            estimated_price_tier: formattedPriceTier,
            suggested_duration: item.suggested_duration,
            price_list: item.price_list,

        };
    });

    useEffect(() => { 
        if (getAttractionsData) { 
            console.log("vendor vendor vendor",vendor.vendor.vendor_id)
            const fetchData = async () => {
                const response = await getAttractionListByVendor(vendor.vendor.vendor_id);
                console.log("response", response.data);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setAttractionsData(tempData);
                    setGetAttractionsData(false);
                } else {
                    console.log("List of attractions not fetched!");
                }
            }

            fetchData();
            setGetAttractionsData(false);
        }
    }, [getAttractionsData]);

    // form inputs for attraction creation
    const [createAttractionForm] = Form.useForm();
    const [isCreateAttractionModalOpen, setIsCreateAttractionModalOpen] = useState(false); // boolean to open modal

    // create new attraction modal open button
    function onClickOpenCreateAttractionModal() {
        setIsCreateAttractionModalOpen(true);
    }

    // create new attraction modal cancel button
    function onClickCancelCreateAttractionModal() {
        setIsCreateAttractionModalOpen(false);
    }

    // create new attraction modal create button
    async function onClickSubmitAttractionCreate(values) {

        let attractionObj = {
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            age_group: values.age_group,
            contact_num: values.contact_num,
            // attraction_image_list: values.attraction_image_list, 
            is_published: true,
            suggested_duration: values.suggested_duration,
            avg_rating_tier: 0,
            attraction_category: values.attraction_category,
            generic_location: values.generic_location,
            price_list: values.price_list,
        }

        let response = await createAttraction(vendor.vendor.vendor_id, attractionObj);
        if (response.status) {
            createAttractionForm.resetFields();
            setGetAttractionsData(true);
            setIsCreateAttractionModalOpen(false);
            toast.success('Attraction successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Attraction creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // View Attraction 
    const [isViewAttractionModalOpen, setIsViewAttractionModalOpen] = useState(false); // boolean to open modal

    useEffect(() => {
        //console.log('selectedAttractionId:', selectedAttractionId);
    }, [selectedAttractionId])

    //view attraction modal open button
    function onClickOpenViewAttractionModal(attractionId) {
        setSelectedAttractionId(attractionId);
        setIsViewAttractionModalOpen(true);

    }

    // view attraction modal cancel button
    function onClickCancelViewAttractionModal() {
        setIsViewAttractionModalOpen(false);
    }

    // EDIT ATTRACTION
    const [isEditAttractionModalOpen, setIsEditAttractionModalOpen] = useState(false); // boolean to open modal

    //view attraction modal open button
    function onClickOpenEditAttractionModal(attractionId) {
        setSelectedAttractionId(attractionId);
        setIsEditAttractionModalOpen(true);
    }

    // view attraction modal cancel button
    function onClickCancelEditAttractionModal() {
        setIsEditAttractionModalOpen(false);
    }

    // create new attraction modal create button
    async function onClickSubmitEditAttraction(values) {

        let attractionObj = {
            attraction_id: selectedAttraction.attraction_id,
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            age_group: values.age_group,
            contact_num: values.contact_num,
            attraction_image_list: values.attraction_image_list,
            is_published: values.is_published,
            suggested_duration: values.suggested_duration,
            avg_rating_tier: selectedAttraction.avg_rating_tier,
            attraction_category: values.attraction_category,
            generic_location: values.generic_location,
            price_list: values.price_list,
        }

        let response = await updateAttraction(vendor.vendor.vendor_id, attractionObj);
        if (response.status) {
            setIsEditAttractionModalOpen(false);
            setGetAttractionsData(true);
            toast.success('Attraction successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Attraction update failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function getAttraction(vendor, selectedAttractionId) {
        try {
            let response = await getAttractionByVendor(vendor.vendor_id, selectedAttractionId);          
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
        if (isEditAttractionModalOpen) {
            getAttraction(vendor.vendor, selectedAttractionId);
        }
    }, [isEditAttractionModalOpen]);

    const redirectToTickets = () => {
        navigate('/attraction/ViewTicket');
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomButton
                            text="Create Attraction"
                            // icon=
                            onClick={onClickOpenCreateAttractionModal}
                        />

                        <CustomButton
                            text="View Tickets"
                            onClick={redirectToTickets}
                        />  

                        {/* pagination */}
                        <CustomTablePagination
                            title="Attractions"
                            column={attractionsColumns}
                            data={formattedAttractionsData}
                        />

                        {/* Modal to create new attraction */}
                        <CreateAttractionModal
                            form={createAttractionForm}
                            isCreateAttractionModalOpen={isCreateAttractionModalOpen}
                            onClickCancelCreateAttractionModal={onClickCancelCreateAttractionModal}
                            onClickSubmitAttractionCreate={onClickSubmitAttractionCreate}
                        />

                        {/* Modal to view attraction */}
                        <ViewAttractionModal
                            isViewAttractionModalOpen={isViewAttractionModalOpen}
                            onClickCancelViewAttractionModal={onClickCancelViewAttractionModal}
                            attractionId={selectedAttractionId}
                        />

                        {/* Modal to edit attraction */}
                        <EditAttractionModal
                            isEditAttractionModalOpen={isEditAttractionModalOpen}
                            onClickCancelEditAttractionModal={onClickCancelEditAttractionModal}
                            onClickSubmitEditAttraction={onClickSubmitEditAttraction}
                            attractionId={selectedAttractionId}
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
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },   
}