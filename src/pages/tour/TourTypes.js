import { React, useEffect, useState, useRef } from 'react';
import { Layout, Form, Input, Badge, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllTourTypesByLocal, createTourType, updateTourType, getTourTypeByTourTypeId } from "../../redux/tourRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import CustomButton from "../../components/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import CreateTourTypeModal from "./CreateTourTypeModal";
import ViewTourTypeModal from "./ViewTourTypeModal";
import { Table, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import EditTourTypeModal from './EditTourTypeModal';

export default function TourTypes() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const local = JSON.parse(localStorage.getItem("user"));

    const [getTourTypesData, setGetTourTypesData] = useState(true);
    const [tourTypes, setTourTypes] = useState([]);
    const [selectedTourType, setSelectedTourType] = useState([]);
    const [tourTypeImages, setTourTypeImages] = useState({});
    const [selectedTourTypeId, setSelectedTourTypeId] = useState(null);


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

    const redirectToTours = (tourTypeId) => {
        let path = `/tours/${tourTypeId}`;
        navigate(path);
    }

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

    const tourTypesColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 50,
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 70,
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Price per Pax',
            dataIndex: 'price',
            key: 'price',
            width: 40,
            sorter: (a, b) => a.price - b.price,
            ...getColumnSearchProps('price'),
            render: (text, record) => {
                return `$${text}`;
            },
        },
        {
            title: 'No. of Pax',
            dataIndex: 'recommended_pax',
            key: 'recommended_pax',
            width: 40,
            sorter: (a, b) => a.recommended_pax - b.recommended_pax,
            ...getColumnSearchProps('recommended_pax'),
        },
        {
            title: 'Est. Duration',
            dataIndex: 'estimated_duration',
            key: 'estimated_duration',
            width: 40,
            sorter: (a, b) => a.estimated_duration - b.estimated_duration,
            ...getColumnSearchProps('estimated_duration'),
            render: (text, record) => {
                // Assuming 'text' is the price value from your data
                return `${text} Hours`;
            },
        },
        {
            title: 'Special Notes',
            dataIndex: 'special_note',
            key: 'special_note',
            width: 60,
            sorter: (a, b) => a.special_note.localeCompare(b.special_note),
            ...getColumnSearchProps('special_note'),
            render: (text) => {
                if (text === null) {
                    return "-";
                }
                return text;
            },
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
            width: 40,
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
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <Space>
                        <CustomButton
                            text="View"
                            style={{fontWeight:"bold"}}
                            onClick={() => onClickOpenViewTourTypeModal(record.tour_type_id)}
                        />
                        <br /><br />
                        <CustomButton
                            text="Edit"
                            style={{fontWeight:"bold"}}
                            onClick={() => onClickOpenEditTourTypeModal(record.tour_type_id)}
                        />
                    </Space>
                    <br /><br />
                    <Space>
                        <CustomButton
                            text="Tours"
                            style={{fontWeight:"bold"}}
                            onClick={() => redirectToTours(record.tour_type_id)}
                        />
                    </Space>
                </div>
            },
            width: 70,
        }
    ];

    // Create new tour type
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
            special_note: values.special_note ? values.special_note : '-',
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

    // View details of Tour Type
    const [isViewTourTypeModalOpen, setIsViewTourTypeModalOpen] = useState(false);

    function onClickOpenViewTourTypeModal(tourTypeId) {
        setSelectedTourTypeId(tourTypeId);
        setIsViewTourTypeModalOpen(true);
    }

    function onClickCancelViewTourTypeModal() {
        setIsViewTourTypeModalOpen(false);
    }

    // Update tour type
    const [isEditTourTypeModalOpen, setIsEditTourTypeModalOpen] = useState(false);

    function onClickOpenEditTourTypeModal(tourTypeId) {
        setSelectedTourTypeId(tourTypeId);
        setIsEditTourTypeModalOpen(true);
    }

    function onClickCancelEditTourTypeModal() {
        setIsEditTourTypeModalOpen(false);
    }

    async function onClickSubmitEditTourType(values) {

        let tourTypeObj = {
            tour_type_id: selectedTourTypeId,
            name: values.name,
            description: values.description,
            price: values.price,
            recommended_pax: values.recommended_pax,
            special_note: values.special_note,
            estimated_duration: values.estimated_duration,
            tour_image_list: values.tour_image_list,
            is_published: values.is_published
        }

        let response = await updateTourType(tourTypeObj, values.attraction);
        if (response.status) {
            const updatedTourTypesData = tourTypes.map((tourType) => {
                if (tourType.tour_type_id === selectedTourTypeId) {
                    return { ...tourType, ...tourTypeObj };
                }
                return tourType;
            });

            setTourTypes(updatedTourTypesData);

            setIsEditTourTypeModalOpen(false);
            setGetTourTypesData(true);
            toast.success('Tour type successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            const imageList = values.tour_image_list;
            if (Array.isArray(imageList) && imageList.length > 0) {
                const firstImageUrl = imageList[0];
                setSelectedTourType({
                    ...selectedTourType,
                    tour_image_list: [firstImageUrl],
                });
            } else {
                setSelectedTourType({
                    ...selectedTourType,
                    tour_image_list: [],
                });
            }

        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function getTourType(selectedTourTypeId) {
        try {
            let response = await getTourTypeByTourTypeId(selectedTourTypeId);
            setSelectedTourType(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour type!');
        }
    }

    useEffect(() => {
        if (isEditTourTypeModalOpen) {
            getTourType(selectedTourTypeId);
        }
    }, [isEditTourTypeModalOpen]);

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

                        {/* Modal to view tour type */}
                        <ViewTourTypeModal
                            isViewTourTypeModalOpen={isViewTourTypeModalOpen}
                            onClickCancelViewTourTypeModal={onClickCancelViewTourTypeModal}
                            tourTypeId={selectedTourTypeId}
                        />

                        {/* Modal to edit tour type */}
                        <EditTourTypeModal
                            isEditTourTypeModalOpen={isEditTourTypeModalOpen}
                            onClickCancelEditTourTypeModal={onClickCancelEditTourTypeModal}
                            onClickSubmitEditTourType={onClickSubmitEditTourType}
                            tourTypeId={selectedTourTypeId}
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