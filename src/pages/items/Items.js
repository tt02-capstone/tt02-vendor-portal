import { Layout, Card, Button, Form, Modal } from 'antd';
import { React, useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { createItem, updateItem, deleteItem, retrieveAllItemsByVendor } from '../../redux/itemRedux';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from 'react-toastify';
import CreateItemModal from './CreateItemModal';
import UpdateItemModal from './UpdateItemModal';

export default function Items() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [items, setItems] = useState([]);

    const { Meta } = Card;

    const itemBreadCrumb = [
        {
            title: 'Items'
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await retrieveAllItemsByVendor(user.vendor.vendor_id);
            if (response.status) {
                if (response.data.length > 0) {
                    const sortedItems = response.data.sort((a, b) => a.name.localeCompare(b.name));
                    setItems(sortedItems);
                } else {
                    setItems(response.data);
                }
            } else {
                console.log("List of items not fetched!");
            }
        }
        fetchData();
    }, []);

    async function retrieveItems() {
        try {
            let response = await retrieveAllItemsByVendor(user.vendor.vendor_id);
            if (response.status) {
                if (response.data.length > 0) {
                    const sortedItems = response.data.sort((a, b) => a.name.localeCompare(b.name));
                    setItems(sortedItems);
                } else {
                    setItems(response.data);
                }
            } else {
                console.log("List of items not fetched!");
            }
        } catch (error) {
            alert('An error occurred! Failed to retrieve items!');
        }
    }

    // Properties for create/update/delete item
    const [createItemForm] = Form.useForm();
    const [updateItemForm] = Form.useForm();
    const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);
    const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState('');

    // Create item
    const handleCreate = () => {
        setIsCreateItemModalOpen(true);
    }

    function onClickCancelCreateItemModal() {
        setIsCreateItemModalOpen(false);
    }

    async function onClickSubmitItemCreate(values) {
        const itemObj = {
            name: values.name,
            image: values.image[0],
            quantity: values.quantity,
            price: values.price,
            description: values.description,
            is_published: true,
            is_limited_edition: values.is_limited_edition ? values.is_limited_edition : false
        };

        let response = await createItem(user.vendor.vendor_id, itemObj);

        if (response.status) {
            createItemForm.resetFields();
            setIsCreateItemModalOpen(false);
            toast.success('Item successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            retrieveItems();
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // Update item
    const handleUpdate = (item_id) => {
        setSelectedItemId(item_id);
        setSelectedItem(items.find(item => item.item_id === item_id));
        setIsUpdateItemModalOpen(true);
    }

    function onClickCancelUpdateItemModal() {
        setIsUpdateItemModalOpen(false);
        setSelectedItem(null);
        setSelectedItemId(null);
    }

    async function onClickSubmitItemUpdate(values) {
        const itemObj = {
            item_id: selectedItemId,
            name: values.name,
            image: values.image.length == 0 ? selectedItem.image : values.image[0],
            quantity: values.quantity,
            price: values.price,
            description: values.description,
            is_published: values.is_published,
            is_limited_edition: values.is_limited_edition
        };

        let response = await updateItem(itemObj);

        if (response.status) {
            updateItemForm.resetFields();
            setIsUpdateItemModalOpen(false);
            toast.success('Item successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            setSelectedItemId(null);
            setSelectedItem(null);
            retrieveItems();
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // Delete item
    const handleDelete = (item_id) => {
        openDeleteConfirmation(item_id);
    }

    const openDeleteConfirmation = (item_id) => {
        setItemIdToDelete(item_id);
        setDeleteConfirmationVisible(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
    };

    const onDeleteConfirmed = async () => {
        let response = await deleteItem(user.vendor.vendor_id, itemIdToDelete);
        if (response.status) {
            toast.success(response.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            retrieveItems();
            setItemIdToDelete('');
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }

        closeDeleteConfirmation();
    };

    return user ? (
        <Layout style={styles.layout}>
            <CustomHeader items={itemBreadCrumb} />
            <Content style={styles.content}>
                <div style={{ display: 'flex' }}>
                    <CustomButton
                        text="Add Item"
                        style={{ marginLeft: '-5px', marginBottom: '10px', marginTop:10 }}
                        icon={<PlusOutlined />}
                        onClick={() => handleCreate()}
                    />

                    <CreateItemModal
                        form={createItemForm}
                        isCreateItemModalOpen={isCreateItemModalOpen}
                        onClickCancelCreateItemModal={onClickCancelCreateItemModal}
                        onClickSubmitItemCreate={onClickSubmitItemCreate}
                    />
                </div>

                <br /><br />

                <div style={{ display: 'flex', flexWrap: 'wrap', width: 1500 }}>
                    {items.map((item, index) => (
                        <Card
                            style={{
                                width: 400,
                                height: 550,
                                marginLeft: '15px',
                                marginRight: '50px',
                                marginBottom: '50px'
                            }}
                            cover={
                                <img alt={item.name} src={item.image} style={{ width: 400, height: 400 }} />
                            }
                            bordered={false}
                            key={index}
                        >
                            <Meta
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{item.name}</span>
                                        <div style={{ fontSize: 18 }}>
                                            <Link style={{ marginLeft: '10px' }} onClick={() => handleUpdate(item.item_id)}>
                                                <EditOutlined />
                                            </Link>
                                            <Link style={{ marginLeft: '20px' }} onClick={() => handleDelete(item.item_id)}>
                                                <DeleteOutlined />
                                            </Link>
                                        </div>
                                    </div>
                                }
                                description={
                                    <div>
                                        <p>{item.description}</p>
                                        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{`$${item.price} per unit`}</span>
                                            <span>{`${item.quantity} in stock`}</span>
                                        </p>
                                    </div>
                                }
                            />
                        </Card>
                    ))}
                </div>

                <UpdateItemModal
                    form={updateItemForm}
                    isUpdateItemModalOpen={isUpdateItemModalOpen}
                    onClickCancelUpdateItemModal={onClickCancelUpdateItemModal}
                    onClickSubmitItemUpdate={onClickSubmitItemUpdate}
                    item={selectedItem}
                />

                <Modal
                    title="Confirm Delete"
                    visible={isDeleteConfirmationVisible}
                    onOk={() => onDeleteConfirmed()}
                    onCancel={closeDeleteConfirmation}
                    okButtonProps={{ style: { fontWeight: "bold" } }}
                    cancelButtonProps={{ style: { fontWeight: "bold" } }}
                >
                    <p>Are you sure you want to delete this item?</p>
                </Modal>
                <ToastContainer />
            </Content>
        </Layout>
    ) :
        (
            <Navigate to="/" />
        )
}

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
        backgroundColor: 'white'
    },
    content: {
        margin: '1vh 3vh 1vh 3vh',
        marginTop: -20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 60,
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}