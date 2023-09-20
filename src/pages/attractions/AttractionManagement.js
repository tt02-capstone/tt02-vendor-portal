import React, { useState, useEffect } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
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
import { PlusOutlined } from "@ant-design/icons";


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
    const [attractionImages, setAttractionImages] = useState({});

    const attractionsColumns = [
        {
            title: 'Id',
            dataIndex: 'attraction_id',
            key: 'attraction_id',
        },
        {
            title: 'Cover Image',
            dataIndex: 'attraction_image_list',
            key: 'attraction_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    // Assuming the first element of the imageList is the URL of the first image
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Attraction"
                                style={styles.image}
                            />
                        </div>
                    );
                }
                return 'No Image';
            },
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
            title: 'Area',
            dataIndex: 'generic_location',
            key: 'generic_location',
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
            title: 'Avg Rating',
            dataIndex: 'avg_rating_tier',
            key: 'avg_rating_tier',
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

    function formatAttractionData(attractionDataArray) {
        return attractionDataArray.map(item => {
            const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
            const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
            const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;

            return {
                attraction_id: item.attraction_id,
                attraction_image_list: item.attraction_image_list,
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
    }

    useEffect(() => {
        if (getAttractionsData) {
            const fetchData = async () => {
                const response = await getAttractionListByVendor(vendor.user_id);
                // console.log("response", response.data);
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

        console.log("onClickSubmitAttractionCreate Attraction image List", values.attraction_image_list)

        let attractionObj = {
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            age_group: values.age_group,
            contact_num: values.contact_num,
            attraction_image_list: values.attraction_image_list,
            is_published: true,
            suggested_duration: values.suggested_duration,
            avg_rating_tier: 0,
            attraction_category: values.attraction_category,
            generic_location: values.generic_location,
            price_list: values.price_list,
        }

        let response = await createAttraction(vendor.user_id, attractionObj);
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

        console.log("onClickSubmitEditAttraction Attraction image List", values.attraction_image_list);

        let attractionObj = {
            attraction_id: selectedAttraction.attraction_id,
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            age_group: values.age_group,
            contact_num: values.contact_num,
            is_published: values.is_published,
            suggested_duration: values.suggested_duration,
            avg_rating_tier: selectedAttraction.avg_rating_tier,
            attraction_category: values.attraction_category,
            generic_location: values.generic_location,
            price_list: values.price_list,
            attraction_image_list: values.attraction_image_list,
        }

        let response = await updateAttraction(vendor.user_id, attractionObj);
        if (response.status) {

            // If the update is successful, update the attraction data in the parent component's state
            const updatedAttractionsData = attractionsData.map((attraction) => {
                if (attraction.attraction_id === selectedAttraction.attraction_id) {
                    // Replace the existing attraction with the updated one
                    return { ...attraction, ...attractionObj };
                }
                return attraction; // Return other attractions unchanged
            });

            setAttractionsData(updatedAttractionsData);

            setIsEditAttractionModalOpen(false);
            setGetAttractionsData(true);
            toast.success('Attraction successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            // Refresh the cover image by forcing it to re-render
            const imageList = values.attraction_image_list;
            if (Array.isArray(imageList) && imageList.length > 0) {
                // Assuming the first element of the imageList is the URL of the first image
                const firstImageUrl = imageList[0];
                // Update the selected attraction's image URL
                setSelectedAttraction({
                    ...selectedAttraction,
                    attraction_image_list: [firstImageUrl],
                });
            } else {
                // If there's no image, set it to an empty array
                setSelectedAttraction({
                    ...selectedAttraction,
                    attraction_image_list: [],
                });
            }

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
            let response = await getAttractionByVendor(vendor.user_id, selectedAttractionId);
            setSelectedAttraction(response.data);
            setPriceList(response.data.price_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve attraction!');
        }
    }

    useEffect(() => {
        // console.log('useEffect editAttraction selectedAttraction:', selectedAttraction);
        // console.log('useEffect editAttraction priceList:', priceList);
    }, [selectedAttraction, priceList, attractionsData])

    useEffect(() => {
        if (isEditAttractionModalOpen) {
            getAttraction(vendor, selectedAttractionId);
        }
    }, [isEditAttractionModalOpen]);

    const redirectToTickets = () => {
        navigate('/attraction/viewTicket');
    }

    // Define a function to add or update image file names for a specific attraction.
    const updateAttractionImages = (attractionId, imageFileName) => {
        setAttractionImages((prevImages) => ({
            ...prevImages,
            [attractionId]: [...(prevImages[attractionId] || []), imageFileName],
        }));
    };

    // Define a function to remove an image file name for a specific attraction.
    const removeAttractionImage = (attractionId, imageFileName) => {
        setAttractionImages((prevImages) => ({
            ...prevImages,
            [attractionId]: prevImages[attractionId].filter(
                (fileName) => fileName !== imageFileName
            ),
        }));
    };

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomButton
                            text="Create Attraction"
                            style={{ marginLeft: '3px', marginBottom: '20px' }}
                            icon={<PlusOutlined />}
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
                            data={formatAttractionData(attractionsData)}
                            tableLayout="auto"
                        />

                        {/* Modal to create new attraction */}
                        <CreateAttractionModal
                            form={createAttractionForm}
                            isCreateAttractionModalOpen={isCreateAttractionModalOpen}
                            onClickCancelCreateAttractionModal={onClickCancelCreateAttractionModal}
                            onClickSubmitAttractionCreate={onClickSubmitAttractionCreate}
                            onUpdateImages={updateAttractionImages}
                            onRemoveImage={removeAttractionImage}
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