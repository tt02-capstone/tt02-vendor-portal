import React, { useState, useEffect, useRef } from "react";
import { Layout, Spin, Form, Input, Button, Modal, Badge, Space, Tag, Image } from 'antd';
import { Content } from "antd/es/layout/layout";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAccommodationListByVendor, getAccommodationByVendor, createAccommodation, updateAccommodation } from "../../redux/accommodationRedux";
import CustomHeader from "../../components/CustomHeader";
import CreateAccommodationModal from "./CreateAccommodationModal";
import ViewAccommodationModal from "./ViewAccommodationModal";
import EditAccommodationModal from "./EditAccommodationModal";
import RoomManagement from "./RoomManagement";
import CustomButton from "../../components/CustomButton";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import { PlusOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import moment from 'moment';
import Highlighter from 'react-highlight-words';

export default function AccommodationManagement() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const vendor = JSON.parse(localStorage.getItem("user"));

    const [getAccommodationsData, setGetAccommodationsData] = useState(true);
    const [accommodationsData, setAccommodationsData] = useState([]);
    const [selectedAccommodationId, setSelectedAccommodationId] = useState(null);
    const [selectedAccommodation, setSelectedAccommodation] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [accommodationImages, setAccommodationImages] = useState({});
    const searchInputRef = useRef(null);

    const viewAccommodationBreadCrumb = [
        {
            title: 'Accommodation',
        }
    ];

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

    const accommodationsColumns = [
        {
            title: 'Cover Image',
            dataIndex: 'accommodation_image_list',
            key: 'accommodation_image_list',
            render: (imageList) => {
                if (Array.isArray(imageList) && imageList.length > 0) {
                    const firstImageUrl = imageList[0];
                    return (
                        <div style={styles.imageContainer}>
                            <img
                                src={firstImageUrl}
                                alt="Accommodation"
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
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
            render: (type) => {
                let tagColor = 'default';
                switch (type) {
                    case 'HOTEL':
                        tagColor = 'purple';
                        break;
                    case 'AIRBNB':
                        tagColor = 'volcano';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{type}</Tag>
                );
            },
            filters: [
                {
                    text: 'Hotel',
                    value: 'HOTEL',
                },
                {
                    text: 'Airbnb',
                    value: 'AIRBNB',
                },
            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
        },
        {
            title: 'Area',
            dataIndex: 'generic_location',
            key: 'generic_location',
            sorter: (a, b) => a.generic_location.localeCompare(b.generic_location),
            filters: [
                { text: 'Marina Bay', value: 'Marina Bay' },
                { text: 'Raffles Place', value: 'Raffles Place' },
                { text: 'Shenton Way', value: 'Shenton Way' },
                { text: 'Tanjong Pagar', value: 'Tanjong Pagar' },
                { text: 'Orchard', value: 'Orchard' },
                { text: 'Newton', value: 'Newton' },
                { text: 'Dhoby Ghaut', value: 'Dhoby Ghaut' },
                { text: 'Chinatown', value: 'Chinatown' },
                { text: 'Bugis', value: 'Bugis' },
                { text: 'Clarke Quay', value: 'Clarke Quay' },
                { text: 'Sentosa', value: 'Sentosa' },
            ],
            onFilter: (value, record) => record.generic_location.indexOf(value) === 0,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Contact No.',
            dataIndex: 'contact_num',
            key: 'contact_num',
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num'),
            width: 120,
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
            filters: [
                {
                    text: 'Published',
                    value: true,
                },
                {
                    text: 'Hidden',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.is_published === value,
        },
        // total rooms
        {
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
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

                return <Tag color={tagColor}>{priceTier}</Tag>;
            },
            sorter: (a, b) => {
                const tierA = a.estimated_price_tier || '';
                const tierB = b.estimated_price_tier || '';

                return tierA.localeCompare(tierB);
            },
            width: 100,
            filters: [
                { text: 'Tier 1', value: 'TIER 1' },
                { text: 'Tier 2', value: 'TIER 2' },
                { text: 'Tier 3', value: 'TIER 3' },
                { text: 'Tier 4', value: 'TIER 4' },
                { text: 'Tier 5', value: 'TIER 5' },
            ],
            onFilter: (value, record) => record.estimated_price_tier.indexOf(value) === 0,
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            render: (text, record) => {
                return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Space direction="horizontal">
                            <CustomButton
                                text="View"
                                style={{ fontWeight: "bold" }}
                                onClick={() => onClickOpenViewAccommodationModal(record.accommodation_id)}
                            />
                            <CustomButton
                                text="Edit"
                                style={{ fontWeight: "bold" }}
                                onClick={() => onClickOpenEditAccommodationModal(record.accommodation_id)}
                            />
                        </Space>
                    </div>
                    <CustomButton
                        text="Rooms"
                        style={{ fontWeight: "bold" }}
                        onClick={() => onClickNavigateToRoomManagement(record.accommodation_id)}
                    />
                </div>

            },
            width: 160,
        },
    ];

    function formatAccommodationData(accommodationDataArray) {
        return accommodationDataArray.map(item => {
            const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
            const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');
            const formattedAvgRatingTier = item.avg_rating_tier === 0 ? 'N/A' : item.avg_rating_tier;

            return {
                accommodation_id: item.accommodation_id,
                name: item.name,
                description: item.description,
                address: item.address,
                contact_num: formattedContactNum,
                accommodation_image_list: item.accommodation_image_list,
                is_published: item.is_published,
                check_in_time: item.check_in_time,
                check_out_time: item.check_out_time,
                type: item.type,
                estimated_price_tier: formattedPriceTier,
                generic_location: formattedGenericLocation,
                room_list: item.room_list,
            };
        });
    }

    useEffect(() => {
        if (getAccommodationsData) {
            const fetchData = async () => {
                const response = await getAccommodationListByVendor(vendor.user_id);
                console.log('response:', response);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setAccommodationsData(tempData);
                    setGetAccommodationsData(false);
                } else {
                    console.log("List of accommodations not fetched!");
                }
            }

            fetchData();
            setGetAccommodationsData(false);
        }
    }, [getAccommodationsData]);

    // CREATE ACCOMMODATION
    // form inputs for attraction creation
    const [createAccommodationForm] = Form.useForm();
    const [isCreateAccommodationModalOpen, setIsCreateAccommodationModalOpen] = useState(false); // boolean to open modal

    // create new attraction modal open button
    function onClickOpenCreateAccommodationModal() {
        setIsCreateAccommodationModalOpen(true);
    }

    // create new attraction modal cancel button
    function onClickCancelCreateAccommodationModal() {
        setIsCreateAccommodationModalOpen(false);
    }

    // create new attraction modal create button
    async function onClickSubmitAccommodationCreate(values) {

        console.log('values.check_in_time:', values.check_in_time);
        console.log('values.check_out_time:', values.check_out_time);

        // Extract hours and minutes
        const checkInHours = values.check_in_time.$H;
        const checkInMinutes = values.check_in_time.$m;

        const checkIn = new Date();
        checkIn.setHours(checkInHours, checkInMinutes, 0);
        // Add 8 hours (8 * 60 * 60 * 1000 milliseconds) to the Date object
        checkIn.setTime(checkIn.getTime() + 8 * 60 * 60 * 1000);
        const checkInIsoString = checkIn.toISOString();

        // Extract hours and minutes
        const checkOutHours = values.check_out_time.$H;
        const checkOutMinutes = values.check_in_time.$m;

        const checkOut = new Date();
        checkOut.setHours(checkOutHours, checkOutMinutes, 0);
        // Add 8 hours (8 * 60 * 60 * 1000 milliseconds) to the Date object
        checkOut.setTime(checkOut.getTime() + 8 * 60 * 60 * 1000);
        const checkOutIsoString = checkOut.toISOString();

        console.log('checkInIsoString:', checkInIsoString);
        console.log('checkOutIsoString:', checkOutIsoString);

        let accommodationObj = {
            name: values.name,
            description: values.description,
            address: values.address,
            contact_num: values.contact_num,
            accommodation_image_list: values.accommodation_image_list,
            is_published: true,
            check_in_time: checkInIsoString,
            check_out_time: checkOutIsoString,
            type: values.type,
            generic_location: values.generic_location,
            room_list: values.room_list,
            // avg_rating_tier: 0,
        }

        let response = await createAccommodation(vendor.user_id, accommodationObj);
        if (response.status) {
            createAccommodationForm.resetFields();
            setGetAccommodationsData(true);
            setIsCreateAccommodationModalOpen(false);
            console.log("createAccommodation response", response.status)
            toast.success('Accommodation successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

        } else {
            console.log("Accommodation creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // VIEW ACCOMMMODATION
    const [isViewAccommodationModalOpen, setIsViewAccommodationModalOpen] = useState(false);

    //view accom modal open button
    function onClickOpenViewAccommodationModal(accommodationId) {
        setSelectedAccommodationId(accommodationId);
        setIsViewAccommodationModalOpen(true);

    }

    // view accom modal cancel button
    function onClickCancelViewAccommodationModal() {
        setIsViewAccommodationModalOpen(false);
    }

    // EDIT ACCOMMMODATION
    const [isEditAccommodationModalOpen, setIsEditAccommodationModalOpen] = useState(false);

    //edit accom modal open button
    function onClickOpenEditAccommodationModal(accommodationId) {
        setSelectedAccommodationId(accommodationId);
        setIsEditAccommodationModalOpen(true);
    }

    // edit accom modal cancel button
    function onClickCancelEditAccommodationModal() {
        setIsEditAccommodationModalOpen(false);
    }

    // edit accom modal button
    async function onClickSubmitEditAccommodation(values) {

        let checkInHours;
        let checkInMinutes;
        let checkOutHours;
        let checkOutMinutes;

        console.log('values.check_in_time:', values.check_in_time);
        console.log('values.check_out_time:', values.check_out_time);

        if (moment.isMoment(values.check_in_time)) {
            const checkInMomentObject = values.check_in_time;
            checkInHours = checkInMomentObject.hours();
            console.log('MomentObject checkInHours:', checkInHours);
            checkInMinutes = checkInMomentObject.minutes();
            console.log('MomentObject checkInMinutes:', checkInMinutes);
        } else {
            // Extract hours and minutes
            checkInHours = values.check_in_time.$H;
            console.log('New checkInHours:', checkInHours);
            checkInMinutes = values.check_in_time.$m;
            console.log('New checkInMinutes:', checkInMinutes);
        }

        if (moment.isMoment(values.check_out_time)) {
            const checkOutMomentObject = values.check_out_time;
            checkOutHours = checkOutMomentObject.hours();
            console.log('MomentObject checkOutHours:', checkOutHours);
            checkOutMinutes = checkOutMomentObject.minutes();
            console.log('MomentObject checkOutMinutes:', checkOutMinutes);
        } else {
            // Extract hours and minutes
            checkOutHours = values.check_out_time.$H;
            console.log('New checkOutHours:', checkOutHours);
            checkOutMinutes = values.check_out_time.$m;
            console.log('New checkOutMinutes:', checkOutMinutes);
        }

        const checkIn = new Date();
        checkIn.setHours(checkInHours, checkInMinutes, 0);
        // Add 9 hours (8 * 60 * 60 * 1000 milliseconds) to the Date object
        checkIn.setTime(checkIn.getTime() + 8 * 60 * 60 * 1000);
        const checkInIsoString = checkIn.toISOString();

        const checkOut = new Date();
        checkOut.setHours(checkOutHours, checkOutMinutes, 0);
        // Add 9 hours (8 * 60 * 60 * 1000 milliseconds) to the Date object
        checkOut.setTime(checkOut.getTime() + 8 * 60 * 60 * 1000);
        const checkOutIsoString = checkOut.toISOString();

        console.log('checkInIsoString:', checkInIsoString);
        console.log('checkOutIsoString:', checkOutIsoString);

        let accommodationObj = {
            accommodation_id: selectedAccommodation.accommodation_id,
            name: values.name,
            description: values.description,
            address: values.address,
            contact_num: values.contact_num,
            accommodation_image_list: values.accommodation_image_list,
            is_published: values.is_published,
            check_in_time: checkInIsoString,
            check_out_time: checkOutIsoString,
            type: values.type,
            generic_location: values.generic_location,
            room_list: selectedAccommodation.room_list,
            // avg_rating_tier: values.avg_rating_tier, // doesn't exist rn
        }

        let response = await updateAccommodation(vendor.user_id, accommodationObj);
        if (response.status) {

            // If the update is successful, update the accommodation data in the parent component's state
            const updatedAccommodationsData = accommodationsData.map((accommodation) => {
                if (accommodation.accommodation_id === selectedAccommodation.accommodation_id) {
                    // Replace the existing accommodation with the updated one
                    return { ...accommodation, ...accommodationObj };
                }
                return accommodation; // Return other accommodations unchanged
            });

            setAccommodationsData(updatedAccommodationsData);

            setIsEditAccommodationModalOpen(false);
            setGetAccommodationsData(true);
            toast.success('Accommodation successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            // Refresh the cover image by forcing it to re-render
            const imageList = values.accommodation_image_list;
            if (Array.isArray(imageList) && imageList.length > 0) {
                const firstImageUrl = imageList[0];
                // Update the selected accommodation's image URL
                setSelectedAccommodation({
                    ...selectedAccommodation,
                    accommodation_image_list: [firstImageUrl],
                });
            } else {
                // If there's no image, set it to an empty array
                setSelectedAccommodation({
                    ...selectedAccommodation,
                    accommodation_image_list: [],
                });
            }

        } else {
            console.log("Accommodation update failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function getAccommodation(vendor, selectedAccommodationId) {
        try {
            let response = await getAccommodationByVendor(vendor.user_id, selectedAccommodationId);
            setSelectedAccommodation(response.data);
            setRoomList(response.data.room_list);
        } catch (error) {
            alert('An error occurred! Failed to retrieve accommodation!');
        }
    }

    useEffect(() => {
    }, [selectedAccommodation, selectedAccommodationId, roomList, accommodationsData])

    useEffect(() => {
        if (isEditAccommodationModalOpen) {
            getAccommodation(vendor, selectedAccommodationId);
        }
    }, [isEditAccommodationModalOpen]);

    // ROOM MANAGEMENT
    function onClickNavigateToRoomManagement(accommodationId) {
        navigate('/accommodation/rooms', { state: { accommodationId } });
    }

    return vendor ? (
        <div>
            <Layout style={styles.layout}>
                <CustomHeader items={viewAccommodationBreadCrumb} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>

                        <CustomButton
                            text="Create Accommodation"
                            style={{ marginLeft: '3px', marginBottom: '20px' }}
                            icon={<PlusOutlined />}
                            onClick={onClickOpenCreateAccommodationModal}
                        />

                        <CustomTablePagination
                            title="Accommodations"
                            column={accommodationsColumns}
                            data={formatAccommodationData(accommodationsData)}
                            tableLayout="fixed"

                        />

                        <CreateAccommodationModal
                            form={createAccommodationForm}
                            isCreateAccommodationModalOpen={isCreateAccommodationModalOpen}
                            onClickCancelCreateAccommodationModal={onClickCancelCreateAccommodationModal}
                            onClickSubmitAccommodationCreate={onClickSubmitAccommodationCreate}
                        />

                        <ViewAccommodationModal
                            isViewAccommodationModalOpen={isViewAccommodationModalOpen}
                            onClickCancelViewAccommodationModal={onClickCancelViewAccommodationModal}
                            accommodationId={selectedAccommodationId}
                        />

                        <EditAccommodationModal
                            isEditAccommodationModalOpen={isEditAccommodationModalOpen}
                            onClickCancelEditAccommodationModal={onClickCancelEditAccommodationModal}
                            onClickSubmitEditAccommodation={onClickSubmitEditAccommodation}
                            accommodationId={selectedAccommodationId}
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