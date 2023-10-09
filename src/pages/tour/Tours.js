import { React, useEffect, useState, useRef } from 'react';
import { Layout, Form, Input, Badge, Space, Tag, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllToursByTourType, createTour, updateTour, getTourByTourId, deleteTour, getTourTypeByTourTypeId } from "../../redux/tourRedux";
import CustomHeader from "../../components/CustomHeader";
import CustomTablePagination from "../../components/CustomTablePagination";
import { ToastContainer, toast } from 'react-toastify';
import CustomButton from "../../components/CustomButton";
import { PlusOutlined } from "@ant-design/icons";
import { Table, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CreateTourModal from './CreateTourModal';
import moment from 'moment';
import ViewTourModal from './ViewTourModal';
import EditTourModal from './EditTourModal';

export default function Tours() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const local = JSON.parse(localStorage.getItem("user"));
    const tourTypeId = useParams().tourTypeId;
    const [getToursData, setGetToursData] = useState(true);
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState([]);
    const [selectedTourId, setSelectedTourId] = useState(null);
    const [selectedTourType, setSelectedTourType] = useState();

    const viewToursBreadCrumb = [
        {
            title: 'Tours',
        },
        {
            title: 'Tour Timings',
        },
    ];

    useEffect(() => {
        if (getToursData) {
            const fetchToursData = async () => {
                const response = await getAllToursByTourType(tourTypeId);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    tempData.sort((a, b) => {
                        const dateA = new Date(a.date);
                        const dateB = new Date(b.date);

                        return dateA - dateB;
                    });
                    setTours(tempData);
                    setGetToursData(false);
                } else {
                    console.log("List of tours not fetched!");
                }
            }

            const fetchTourTypeData = async () => {
                try {
                    let response = await getTourTypeByTourTypeId(tourTypeId);
                    setSelectedTourType(response.data);
                } catch (error) {
                    alert('An error occurred! Failed to retrieve tour type!');
                }
            }

            fetchToursData();
            fetchTourTypeData();
            setGetToursData(false);
        }
    }, [getToursData]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const toursColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: 50,
            render: (text) => moment(text).format('DD MMM YYYY'),
            sorter: (a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);

                if (dateA < dateB) {
                    return -1;
                }
                if (dateA > dateB) {
                    return 1;
                }
                return 0;
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        id="custom-search-input"
                        placeholder="Search Date"
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, 'date')}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, 'date')}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const date = moment(record.date);
                const dayMatch = date.format('DD') === value;
                const monthMatch = date.format('MMM').toLowerCase() === value.toLowerCase();
                const yearMatch = date.format('YYYY') === value;
                return dayMatch || monthMatch || yearMatch;
            },
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
        },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            width: 50,
            render: (text) => moment(text).format('h.mm a'),
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 50,
            render: (text) => moment(text).format('h.mm a'),
        },
        {
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            width: 80,
            render: (text, record) => {
                return <div>
                    <Space>
                        <CustomButton
                            text="View"
                            style={{fontWeight:"bold"}}
                            onClick={() => onClickOpenViewTourModal(record.tour_id)}
                        />
                        <br /><br />
                        <CustomButton
                            text="Edit"
                            style={{fontWeight:"bold"}}
                            onClick={() => onClickOpenEditTourModal(record.tour_id)}
                        />
                        <br /><br />
                        <CustomButton
                            text="Delete"
                            style={{fontWeight:"bold"}}
                            onClick={() => openDeleteConfirmation(record.tour_id)}
                        />
                    </Space>
                </div>
            },
        }
    ];

    // Create new tour
    const [createTourForm] = Form.useForm();
    const [isCreateTourModalOpen, setIsCreateTourModalOpen] = useState(false);

    function onClickOpenCreateTourModal() {
        setIsCreateTourModalOpen(true);
    }

    function onClickCancelCreateTourModal() {
        setIsCreateTourModalOpen(false);
    }

    async function onClickSubmitTourCreate(values) {
        const selectedDate = values.date.format('YYYY-MM-DD');
        const selectedStartTime = values.start_time.format('HH:mm');
        const estimatedDuration = moment.duration(selectedTourType.estimated_duration, 'hours');
        const selectedEndTime = values.start_time.add(estimatedDuration).format('HH:mm');
        const isoStartDateTime = `${selectedDate}T${selectedStartTime}:00`;
        const isoEndDateTime = `${selectedDate}T${selectedEndTime}:00`;

        let tourObj = {
            date: isoStartDateTime,
            start_time: isoStartDateTime,
            end_time: isoEndDateTime
        }
        console.log(tourObj);

        let response = await createTour(tourTypeId, tourObj);
        if (response.status) {
            createTourForm.resetFields();
            setGetToursData(true);
            setIsCreateTourModalOpen(false);
            toast.success('Tour successfully created!', {
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

    // View details of Tour
    const [isViewTourModalOpen, setIsViewTourModalOpen] = useState(false);

    function onClickOpenViewTourModal(tourId) {
        setSelectedTourId(tourId);
        setIsViewTourModalOpen(true);
    }

    function onClickCancelViewTourModal() {
        setIsViewTourModalOpen(false);
    }

    // Update tour
    const [isEditTourModalOpen, setIsEditTourModalOpen] = useState(false);

    function onClickOpenEditTourModal(tourId) {
        setSelectedTourId(tourId);
        setIsEditTourModalOpen(true);
    }

    function onClickCancelEditTourModal() {
        setIsEditTourModalOpen(false);
    }

    async function onClickSubmitEditTour(values) {
        const selectedDate = values.date.format('YYYY-MM-DD');
        const selectedStartTime = values.start_time.format('HH:mm');
        const estimatedDuration = moment.duration(selectedTourType.estimated_duration, 'hours');
        const selectedEndTime = values.start_time.add(estimatedDuration).format('HH:mm');
        const isoStartDateTime = `${selectedDate}T${selectedStartTime}:00`;
        const isoEndDateTime = `${selectedDate}T${selectedEndTime}:00`;

        let tourObj = {
            tour_id: selectedTourId,
            date: isoStartDateTime,
            start_time: isoStartDateTime,
            end_time: isoEndDateTime
        }

        let response = await updateTour(tourObj);
        if (response.status) {
            const updatedToursData = tours.map((tour) => {
                if (tour.tour_id === selectedTourId) {
                    return { ...tour, ...tourObj };
                }
                return tour;
            });

            setTours(updatedToursData);

            setIsEditTourModalOpen(false);
            setGetToursData(true);
            toast.success('Tour successfully updated!', {
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

    async function getTour(selectedTourId) {
        try {
            let response = await getTourByTourId(selectedTourId);
            setSelectedTour(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve tour!');
        }
    }

    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [tourIdToDelete, setTourIdToDelete] = useState('');

    const openDeleteConfirmation = (tourId) => {
        setTourIdToDelete(tourId);
        setDeleteConfirmationVisible(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
    };

    const onDeleteConfirmed = async () => {
        let response = await deleteTour(tourIdToDelete);
        if (response.status) {
            toast.success('Tour successfully deleted!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            setGetToursData(true);
            setTourIdToDelete('');
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }

        closeDeleteConfirmation();
    };

    useEffect(() => {
        if (isEditTourModalOpen) {
            getTour(selectedTourId);
        }
    }, [isEditTourModalOpen]);

    return local ? (
        <div>
            <Layout style={styles.layout}>
                {/* <CustomHeader text={"Header"} /> */}
                <CustomHeader items={viewToursBreadCrumb} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>
                        <CustomButton
                            text="Create Tour Timing"
                            style={{ marginLeft: '3px', marginBottom: '20px' }}
                            icon={<PlusOutlined />}
                            onClick={onClickOpenCreateTourModal}
                        />

                        {/* pagination */}
                        <CustomTablePagination
                            title="Tour Types"
                            column={toursColumns}
                            data={tours}
                            tableLayout="fixed"
                        />

                        {/* Modal to create new tour */}
                        <CreateTourModal
                            form={createTourForm}
                            isCreateTourModalOpen={isCreateTourModalOpen}
                            onClickCancelCreateTourModal={onClickCancelCreateTourModal}
                            onClickSubmitTourCreate={onClickSubmitTourCreate}
                        />

                        {/* Modal to view tour */}
                        <ViewTourModal
                            isViewTourModalOpen={isViewTourModalOpen}
                            onClickCancelViewTourModal={onClickCancelViewTourModal}
                            tourId={selectedTourId}
                        />

                        {/* Modal to edit tour */}
                        <EditTourModal
                            isEditTourModalOpen={isEditTourModalOpen}
                            onClickCancelEditTourModal={onClickCancelEditTourModal}
                            onClickSubmitEditTour={onClickSubmitEditTour}
                            tourId={selectedTourId}
                        />

                        {/* Delete Confirmation Modal */}
                        <Modal
                            title="Confirm Delete"
                            visible={isDeleteConfirmationVisible}
                            onOk={() => onDeleteConfirmed()}
                            onCancel={closeDeleteConfirmation}
                        >
                            <p>Are you sure you want to delete this tour timing?</p>
                        </Modal>
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