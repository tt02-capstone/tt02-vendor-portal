import { React, useEffect, useState, useRef } from 'react';
import { Layout, Form, Input, Badge, Space, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { getAllToursByTourType, createTour } from "../../redux/tourRedux";
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

export default function TourTypes() {

    const navigate = useNavigate();
    const { Header, Content, Sider, Footer } = Layout;
    const local = JSON.parse(localStorage.getItem("user"));
    const tourTypeId = useParams().tourTypeId;
    const [getToursData, setGetToursData] = useState(true);
    const [tours, setTours] = useState([]);
    const [selectedTour, setSelectedTour] = useState([]);
    const [selectedTourId, setSelectedTourId] = useState(null);

    const viewToursBreadCrumb = [
        {
            title: 'Tour Types',
        },
        {
            title: 'Tours',
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

            fetchToursData();
            setGetToursData(false);
        }
    }, [getToursData]);

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
        },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            width: 50,
            render: (text) => moment(text).format('h.mm a'),
            sorter: (a, b) => {
                const timeA = a.start_time;
                const timeB = b.start_time;

                const timeAObj = new Date(`2022-01-01T${timeA}`);
                const timeBObj = new Date(`2022-01-01T${timeB}`);

                if (timeAObj < timeBObj) {
                    return -1;
                }
                if (timeAObj > timeBObj) {
                    return 1;
                }
                return 0;
            },
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
            width: 50,
            render: (text) => moment(text).format('h.mm a'),
            sorter: (a, b) => {
                const timeA = a.end_time;
                const timeB = b.end_time;

                const timeAObj = new Date(`2022-01-01T${timeA}`);
                const timeBObj = new Date(`2022-01-01T${timeB}`);

                if (timeAObj < timeBObj) {
                    return -1;
                }
                if (timeAObj > timeBObj) {
                    return 1;
                }
                return 0;
            },
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
                            onClick={() => onClickOpenViewTourModal(record.tour_id)}
                        />
                        <br /><br />
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
        const selectedEndTime = values.end_time.format('HH:mm');
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

    return local ? (
        <div>
            <Layout style={styles.layout}>
                {/* <CustomHeader text={"Header"} /> */}
                <CustomHeader items={viewToursBreadCrumb} />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content style={styles.content}>
                        <CustomButton
                            text="Create Tour"
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