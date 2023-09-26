import React, { useState, useEffect, useRef } from "react";
import { Layout, Form, Input, Button, Badge, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAttractionListByVendor, getAttractionByVendor, createAttraction, updateAttraction, createSeasonalActivity } from "../../redux/attractionRedux";
import CustomHeader from "../../components/CustomHeader";
import CreateAttractionModal from "./CreateAttractionModal";
import ViewAttractionModal from "./ViewAttractionModal";
import EditAttractionModal from "./EditAttractionModal";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import SeasonalActivityModal from "./SeasonalActivityModal";

export default function AttractionManagement() {

    const navigate = useNavigate();
    const { Content } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    const [getAttractionsData, setGetAttractionsData] = useState(true);
    const [attractionsData, setAttractionsData] = useState([]); 
    const [selectedAttractionId, setSelectedAttractionId] = useState(null);
    const [selectedAttraction, setSelectedAttraction] = useState([]);
    const [priceList, setPriceList] = useState([]);
    const [attractionImages, setAttractionImages] = useState({});
    const [seasonalModal, setSeasonalModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const viewAttractionBreadCrumb = [
        {
          title: 'Attractions',
        }
    ];

    // add filter 
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const attractionsColumns = [
        {
            title: 'Cover Image',
            dataIndex: 'attraction_image_list',
            key: 'attraction_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
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
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name')
        },
        {
            title: 'Category',
            dataIndex: 'attraction_category',
            key: 'attraction_category',
            sorter: (a, b) => a.attraction_category.localeCompare(b.attraction_category),
            ...getColumnSearchProps('attraction_category'),
            render: (attractionCategory) => {
                let tagColor = 'default'; 
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
        // {
        //     title: 'Area',
        //     dataIndex: 'generic_location',
        //     key: 'generic_location',
        //     sorter: (a, b) => a.generic_location.localeCompare(b.generic_location),
        //     ...getColumnSearchProps('generic_location')
        // },
        // {
        //     title: 'Address',
        //     dataIndex: 'address',
        //     key: 'address',
        //     sorter: (a, b) => a.address.localeCompare(b.address),
        //     ...getColumnSearchProps('address')
        // },
        {
            title: 'Opening Hours',
            dataIndex: 'opening_hours',
            key: 'opening_hours',
            sorter: (a, b) => a.opening_hours.localeCompare(b.opening_hours),
            ...getColumnSearchProps('opening_hours')
        },
        {
            title: 'Contact Num',
            dataIndex: 'contact_num',
            key: 'contact_num',
            width: 120,
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num')
            
        },
        {
            title: 'Published',
            dataIndex: 'is_published',
            key: 'is_published',
            sorter: (a, b) => String(a.is_published).localeCompare(String(b.is_published)),
            render: (text) => {
                if (text === true) {
                    return <Badge status="success" text="Yes" />
                } else {
                    return <Badge status="error" text="No" />
                }
            },
            width: 150,
        },
        {
            title: 'Avg Rating',
            dataIndex: 'avg_rating_tier',
            key: 'avg_rating_tier',
            sorter: (a, b) => a.avg_rating_tier.localeCompare(b.avg_rating_tier),
            ...getColumnSearchProps('avg_rating_tier'),
            width: 100,
        },
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            sorter: (a, b) => a.estimated_price_tier.localeCompare(b.estimated_price_tier),
            ...getColumnSearchProps('estiminated_price_tier'),
            render: (priceTier) => {
                let tagColor = 'default'; 
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
            },
            width: 100,
        },
        {
            title: 'Seasonal Activity',
            dataIndex: 'seasonal_activity_list',
            key: 'seasonal_activity_list',
            sorter: (a, b) => a.seasonal_activity_list.localeCompare(b.seasonal_activity_list),
            ...getColumnSearchProps('seasonal_activity_list'),
            width: 220
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <CustomButton
                        text="View"
                        style ={{ fontSize : 13, fontWeight: "bold"}}
                        onClick={() => onClickOpenViewAttractionModal(record.attraction_id)}
                    />
                    <br/><br/>
                    <CustomButton
                        text="Edit"
                        style ={{ fontSize : 13, fontWeight: "bold"}}
                        onClick={() => onClickOpenEditAttractionModal(record.attraction_id)}
                    />
                    <br/><br/>
                    <CustomButton
                        text= " + Seasonal Activity"
                        style ={{ fontSize : 13, fontWeight: "bold"}}
                        onClick={() => createSeasonal(record.attraction_id)}
                        loading={loading}
                    />
                </div>
            },
            width: 200,
        },
    ];

    const showSeasonalModal = ()=> {
        setSeasonalModal(true);
    };

    const seasonalModalCancel = () => {
        setSeasonalModal(false);
    };

    const createSeasonal = (attractionId) => {
        setSelectedAttractionId(attractionId)
        showSeasonalModal()
    }

    const seasonalModalSubmit = async (values) => {
        let activity = {
            name: values.name,
            description: values.description,
            start_date : values.startDate.format('YYYY-MM-DD'),
            end_date : values.endDate.format('YYYY-MM-DD'),
            suggested_duration: values.suggested_duration,
        }

        const new_activity = await createSeasonalActivity(vendor.user_id, selectedAttractionId, activity);
        if (new_activity.error) {
            toast.error('Create Activity Failed! ' + new_activity.error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        } else {
            toast.success('Activity Added!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000
            });
        }

        setSeasonalModal(false); 
        setGetAttractionsData(true); // refresh the table
    };

    function formatAttractionData(attractionDataArray) {
        return attractionDataArray.map(item => {
            const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
            const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
            const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;
            const activityList = item.seasonal_activity_list;

            const validActivityList = activityList.filter(item => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0'); // format to current timezone 
    
                const todayFormatted = `${year}-${month}-${day}`;
    
                return item.start_date >= todayFormatted && item.end_date >=  todayFormatted;
            });

            let activityListString; 

            if (validActivityList.length > 0) {
                activityListString = validActivityList.map((item, index) => {
                    return `${index + 1}. ${item.name} from ${item.start_date} to ${item.end_date}`;
                }).join('\n');
            } else {
                activityListString = 'No Activities Created!';
            }

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
                seasonal_activity_list: activityListString
            };
        });
    }

    useEffect(() => {
        if (getAttractionsData) {
            const fetchData = async () => {
                const response = await getAttractionListByVendor(vendor.user_id);
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

    // CREATE ATTRACTION
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
            console.log("createAttraction response", response.status)
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

    // VIEW ATTRACTION
    const [isViewAttractionModalOpen, setIsViewAttractionModalOpen] = useState(false); 

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
    const [isEditAttractionModalOpen, setIsEditAttractionModalOpen] = useState(false); 

    //edit attraction modal open button
    function onClickOpenEditAttractionModal(attractionId) {
        setSelectedAttractionId(attractionId);
        setIsEditAttractionModalOpen(true);
    }

    // edit attraction modal cancel button
    function onClickCancelEditAttractionModal() {
        setIsEditAttractionModalOpen(false);
    }

    // edit attraction modal button
    async function onClickSubmitEditAttraction(values) {

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
    }, [selectedAttraction, selectedAttractionId, priceList, attractionsData])

    useEffect(() => {
        if (isEditAttractionModalOpen) {
            getAttraction(vendor, selectedAttractionId);
        }
    }, [isEditAttractionModalOpen]);

    const redirectToTickets = () => {
        navigate('/attraction/viewTicket');
    }

    const updateAttractionImages = (attractionId, imageFileName) => {
        setAttractionImages((prevImages) => ({
            ...prevImages,
            [attractionId]: [...(prevImages[attractionId] || []), imageFileName],
        }));
    };

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
                {/* <CustomHeader text={"Header"} /> */}
                <CustomHeader items={viewAttractionBreadCrumb}/>
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
                            style={{ marginLeft: '15px', marginBottom: '20px' }}
                            icon={ <SearchOutlined/> }
                            onClick={redirectToTickets}
                        />

                        {/* pagination */}
                        <CustomTablePagination
                            title="Attractions"
                            column={attractionsColumns}
                            data={formatAttractionData(attractionsData)}
                            tableLayout="fixed"
                            
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

                        {/* modal to create seasonal activity */}
                        <SeasonalActivityModal
                            isVisible={seasonalModal}
                            onCancel={seasonalModalCancel}
                            onSubmit={seasonalModalSubmit}
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