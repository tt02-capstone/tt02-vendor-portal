import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { createRestaurant, updateRestaurant, getAllRestaurantByVendor, getRestaurant } from '../../redux/restaurantRedux';
import  { Table, Input, Button, Space , Badge, Layout, Form, Tag} from 'antd';
import { Content } from "antd/es/layout/layout";
import { Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CustomTablePagination from "../../components/CustomTablePagination";
import ViewRestaurantModal from './ViewRestaurantModal';
import CreateRestaurantModal from './CreateRestaurantModal';
import EditRestaurantModal from './EditRestaurantModal';
import { PlusOutlined } from "@ant-design/icons";


export default function RestaurantManagement(navigation) {
    const user = JSON.parse(localStorage.getItem("user"));
    const [getRestaurantData, setGetRestaurantData] = useState(true);
    const [selectedRestaurant, setSelectedRestaurant] = useState([]);
    const [data, setData] = useState([]); // list of restaurant 
    const [restaurantImages, setRestaurantImages] = useState({});
    const [selectedRestId, setSelectedRestId] = useState("");
    const navigate = useNavigate();

    const restBreadCrumb = [
        {
          title: 'Restaurants',
        }
    ];

    useEffect(() => {
        if (getRestaurantData) {
            const fetchData = async () => {
                const response = await getAllRestaurantByVendor(user.user_id);
                if (response.status) {
                    var tempData = response.data.map((val) => ({
                        ...val,
                        key: val.user_id,
                    }));
                    setData(tempData);
                    setGetRestaurantData(false);
                } else {
                    console.log("List of restaurant not fetched!");
                }
            }

            fetchData();
            setGetRestaurantData(false);
        }
    }, [getRestaurantData]);

    // table filters 
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

    const datasource = Array.isArray(data) ? data.map((item, index) => {
        const formattedContactNum = item.contact_num.replace(/(\d{4})(\d{4})/, '$1 $2');
        const formattedGenericLocation = item.generic_location.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        const formattedPriceTier = item.estimated_price_tier.split('_').join(' ');

        return {
            key: index,
            restaurant_id : item.restaurant_id,
            name: item.name,
            description: item.description,
            address: item.address,
            opening_hours: item.opening_hours,
            contact_num: formattedContactNum,
            is_published: item.is_published,
            suggested_duration: item.suggested_duration,
            restaurant_type: item.restaurant_type,
            generic_location: formattedGenericLocation,
            estimated_price_tier: formattedPriceTier
        };
    }) : [];

    const columns = [
        {
            title: 'Restaurant Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('name'),
            width: 150
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            ...getColumnSearchProps('description'),
            width: 150,
        },
        {
            title: 'Type',
            dataIndex: 'restaurant_type',
            key: 'restaurant_type',
            sorter: (a, b) => a.restaurant_type.localeCompare(b.restaurant_type),
            ...getColumnSearchProps('restaurant_type'),
            render: (type) => {
                let tagColor = 'default'; 
                switch (type) {
                    case 'FAST_FOOD':
                        tagColor = 'purple';
                        break;
                    case 'CHINESE':
                        tagColor = 'volcano';
                        break;
                    case 'MEIXCAN':
                        tagColor = 'magenta';
                        break;
                    case 'KOREAN':
                        tagColor = 'geekblue';
                        break;
                    case 'WESTERN':
                        tagColor = 'gold';
                        break;
                    case 'JAPANESE':
                        tagColor = 'cyan';
                        break;
                    default:
                        break;
                }

                return (
                    <Tag color={tagColor}>{type}</Tag>
                );
            },
            width: 150
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a, b) => a.address.localeCompare(b.address),
            ...getColumnSearchProps('address'),
            width: 150,
        },
        {
            title: 'Opening Hours',
            dataIndex: 'opening_hours',
            key: 'opening_hours',
            sorter: (a, b) => a.opening_hours.localeCompare(b.opening_hours),
            ...getColumnSearchProps('opening_hours'),
            width: 150,
        },
        {
            title: 'Contact No.',
            dataIndex: 'contact_num',
            key: 'contact_num',
            width: 120,
            sorter: (a, b) => a.contact_num.localeCompare(b.contact_num),
            ...getColumnSearchProps('contact_num'),
            width: 150,
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
            title: 'Price Tier',
            dataIndex: 'estimated_price_tier',
            key: 'estimated_price_tier',
            sorter: (a, b) => a.estimated_price_tier.localeCompare(b.estimated_price_tier),
            ...getColumnSearchProps('estiminated_price_tier'),
            render: (priceTier) => {
                let tagColor = 'default'; 
                switch (priceTier) {
                    case 'TIER 0':
                        tagColor = 'grey';
                        break;
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
            title: 'Action(s)',
            dataIndex: 'operation',
            key: 'operation',
            align: 'center',
            render: (text, record) => {
                return <div>
                    <CustomButton
                        text="View Restaurant"
                        style ={{ fontSize : 11, fontWeight: "bold"}}
                        onClick={() => onClickOpenViewRestaurantModal(record.restaurant_id)}
                    />
                    <br/><br/>

                    <CustomButton
                        text="Edit Restaurant"
                        style ={{ fontSize : 11, fontWeight: "bold"}}
                        onClick={() => onClickOpenEditRestaurantModal(record.restaurant_id)}
                    />
                    <br/><br/>

                    <CustomButton
                        text="Manage Dish(es)"
                        style ={{ fontSize : 11, fontWeight: "bold"}}
                        onClick={() => goToDish(record.restaurant_id)}
                    />
                    <br/><br/>
                </div>
            },
            width: 200,
        },
    ];

    // 
    const goToDish = (restId) => {
        navigate('/dish', { state : {restId}})
    }

    // view restaurant details  
    const [isViewRestaurantModalOpen, setIsViewRestaurantModalOpen] = useState(false);

    function onClickOpenViewRestaurantModal(restId) {
        setSelectedRestId(restId);
        setIsViewRestaurantModalOpen(true);
    }

    function onClickCancelViewRestaurantModal() {
        setIsViewRestaurantModalOpen(false);
    }

    // create restaurant 
    const [createRestaurantForm] = Form.useForm();
    const [isCreateRestaurantModalOpen, setIsCreateRestaurantModalOpen] = useState(false);

    function onClickOpenCreateRestaurantModal() {
        setIsCreateRestaurantModalOpen(true);
    }

    function onClickCancelCreateRestaurantModal() {
        setIsCreateRestaurantModalOpen(false);
    }

    async function onClickSubmitRestaurantCreate(values) {
        console.log(values);
        let restObj = {
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            contact_num: values.contact_num,
            is_published: true,
            suggested_duration: values.suggested_duration,
            restaurant_type : values.restaurant_type,
            generic_location: values.generic_location,
            restaurant_image_list: values.restaurant_image_list
        }

        let response = await createRestaurant(user.user_id, restObj)
        if (response.status) {
            createRestaurantForm.resetFields();
            setGetRestaurantData(true); // refresh w useeffect
            setIsCreateRestaurantModalOpen(false);
            toast.success('Restaurant successfully created!', {
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

    const updateRestaurantImages = (restId, imageFileName) => {
        setRestaurantImages((prevImages) => ({
            ...prevImages,
            [restId]: [...(prevImages[restId] || []), imageFileName],
        }));
    };

    const removeRestaurantImage = (restId, imageFileName) => {
        setRestaurantImages((prevImages) => ({
            ...prevImages,
            [restId]: prevImages[restId].filter(
                (fileName) => fileName !== imageFileName
            ),
        }));
    };

    // edit restaurant 
    const [isEditRestaurantModalOpen, setIsEditRestaurantModalOpen] = useState(false);

    function onClickOpenEditRestaurantModal(restId) {
        setSelectedRestId(restId);
        setIsEditRestaurantModalOpen(true);
    }

    function onClickCancelEditRestaurantModal() {
        setIsEditRestaurantModalOpen(false);
    }

    async function onClickSubmitEditRestaurant(values) {

        let restObj = {
            restaurant_id : selectedRestId,
            name: values.name,
            description: values.description,
            address: values.address,
            opening_hours: values.opening_hours,
            contact_num: values.contact_num,
            is_published: values.is_published,
            suggested_duration: values.suggested_duration,
            restaurant_type : values.restaurant_type,
            generic_location: values.generic_location,
            restaurant_image_list: values.restaurant_image_list
        }

        let response = await updateRestaurant(restObj);
        if (response.status) {
            const updatedRest = data.map((data) => {
                if (data.restaurant_id === selectedRestId) {
                    return { ...data, ...restObj };
                }
                return data;
            });

            
            setData(updatedRest);

            setIsEditRestaurantModalOpen(false);
            setGetRestaurantData(true); // refresh again

            toast.success('Restaurant successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            const imageList = values.restaurant_image_list;
            if (Array.isArray(imageList) && imageList.length > 0) {
                const firstImageUrl = imageList[0];
                setSelectedRestaurant({
                    ...setSelectedRestaurant,
                    restaurant_image_list: [firstImageUrl],
                });
            } else {
                setSelectedRestaurant({
                    ...setSelectedRestaurant,
                    restaurant_image_list: [],
                });
            }

        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    async function getRest(selectedRestId) {
        try {
            let response = await getRestaurant(selectedRestId);
            setSelectedRestaurant(response.data);
        } catch (error) {
            alert('An error occurred! Failed to retrieve restaurant!');
        }
    }

    useEffect(() => {
        if (isEditRestaurantModalOpen) {
            getRest(selectedRestId);
        }
    }, [isEditRestaurantModalOpen]);


    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={restBreadCrumb}/>
             <Content style={styles.content}>
                <CustomButton
                    text="Add Restaurant"
                    style={{ marginLeft: '3px', marginBottom:'10px'}}
                    icon={<PlusOutlined />}
                    onClick={onClickOpenCreateRestaurantModal}
                />

                {/* <Table dataSource={datasource} columns={columns} style={{ width : '110%' }} /> */}

                <CustomTablePagination
                    title="Restaurants"
                    column={columns}
                    data={datasource}
                    tableLayout="fixed"
                />

                {/* view a restaurant */}
                <ViewRestaurantModal
                    isViewRestaurantModalOpen={isViewRestaurantModalOpen}
                    onClickCancelViewRestaurantModal={onClickCancelViewRestaurantModal}
                    restId={selectedRestId}
                />

                {/* create restaurant */}
                <CreateRestaurantModal
                    form={createRestaurantForm}
                    isCreateRestaurantModalOpen={isCreateRestaurantModalOpen}
                    onClickCancelCreateRestaurantModal={onClickCancelCreateRestaurantModal}
                    onClickSubmitRestaurantCreate={onClickSubmitRestaurantCreate}
                    onUpdateImages={updateRestaurantImages}
                    onRemoveImage={removeRestaurantImage}
                />

                {/* edit restaurant */}
                <EditRestaurantModal
                    isEditRestaurantModalOpen={isEditRestaurantModalOpen}
                    onClickCancelEditRestaurantModal={onClickCancelEditRestaurantModal}
                    onClickSubmitEditRestaurant={onClickSubmitEditRestaurant}
                    restId={selectedRestId}
                />

            <ToastContainer />
             </Content>
        </Layout>
    ):
    ( 
        <Navigate to="/" />
    )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}