import { Layout, List, Avatar, Form, Modal } from 'antd';
import { React, useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllPostByCategoryItemId, createPost, deletePost, updatePost } from '../../redux/forumRedux';
import { ToastContainer, toast } from 'react-toastify';
import CreatePostModal from './CreatePostModal';
import UpdatePostModal from './UpdatePostModal';

export default function Post() {
    let { category_name } = useParams();
    let { category_id } = useParams();
    let { category_item_name } = useParams();
    let { category_item_id } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const [postList, setPostList] = useState([]);

    const forumBreadCrumb = [
        {
            title: 'Forum',
            to: '/forum'
        },
        {
            title: category_name,
            to: '/forum/' + category_id + '/' + category_name
        },
        {
            title: category_item_name
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllPostByCategoryItemId(category_item_id);
            if (response.status) {
                let data = response.data

                const processData = data.map(item => {
                    const user = item.internal_staff_user || item.local_user || item.tourist_user || item.vendor_staff_user;
                    if (user) {
                        const processItem = {
                            post_id: item.post_id,
                            title: item.title,
                            content: item.content,
                            postUser: user,
                            publish_time: item.publish_time,
                            updated_time: item.updated_time,
                            post_image: item.post_image_list, 
                            is_published: item.is_published
                        }

                        return processItem;
                    }
                });
                setPostList(processData);
            } else {
                console.log("List of posts not fetched!");
            }
        }
        fetchData();
    }, []);

    async function retrieveAllPosts() {
        try {
            const response = await getAllPostByCategoryItemId(category_item_id);
            console.log(response)

            if (response.status) {
                let data = response.data

                const processData = data.map(item => {
                    const user = item.internal_staff_user || item.local_user || item.tourist_user || item.vendor_staff_user;
                    if (user) {
                        const processItem = {
                            post_id: item.post_id,
                            title: item.title,
                            content: item.content,
                            postUser: user,
                            publish_time: item.publish_time,
                            updated_time: item.updated_time,
                            post_image : item.post_image_list,
                            is_published: item.is_published
                        }

                        return processItem;
                    }
                });
                setPostList(processData);
            } else {
                console.log("List of posts not fetched!");
            }
        } catch (error) {
            alert('An error occurred! Failed to retrieve all posts!');
        }
    }

    // Properties for create/update/delete post
    const [createPostForm] = Form.useForm();
    const [updatePostForm] = Form.useForm();
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isUpdatePostModalOpen, setIsUpdatePostModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');

    // Create a post
    const handleCreatePost = () => {
        console.log('create post');
        setIsCreatePostModalOpen(true);
    }

    function onClickCancelCreatePostModal() {
        setIsCreatePostModalOpen(false);
    }

    async function onClickSubmitPostCreate(values) {
        const postObj = {
            title: values.title,
            content: values.content,
            post_image_list: values.post_image
        };

        // console.log("postObj", postObj);

        let response = await createPost(user.user_id, category_item_id, postObj);
        // console.log("createPost response", response);
        if (response.status) {
            createPostForm.resetFields();
            setIsCreatePostModalOpen(false);
            toast.success('Post successfully created!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            console.log(response.data)
            retrieveAllPosts();
        } else {
            console.log("Post creation failed!");
            console.log(response.data);
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // Update a post
    const handleUpdate = (post_id) => {
        setSelectedPostId(post_id);
        setSelectedPost(postList.find(item => item.post_id === post_id));
        setIsUpdatePostModalOpen(true);
    }

    function onClickCancelUpdatePostModal() {
        setIsUpdatePostModalOpen(false);
        setSelectedPost(null);
        setSelectedPostId(null);
    }

    async function onClickSubmitPostUpdate(values) {
        let oldPostImage = [];
        if (selectedPost.post_image != []) {
            oldPostImage.push(selectedPost.post_image[0]);
        }
        const postObj = {
            post_id: selectedPostId,
            title: values.title,
            content: values.content,
            post_image_list: values.post_image && values.post_image.length == 0 ? oldPostImage : values.post_image,
        };


        let response = await updatePost(postObj);
        if (response.status) {
            updatePostForm.resetFields();
            setIsUpdatePostModalOpen(false);
            toast.success('Post successfully updated!', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });

            // console.log(response.data);
            setSelectedPostId(null);
            setSelectedPost(null);
            retrieveAllPosts();
        } else {
            toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
        }
    }

    // Delete a post
    const handleDelete = (post_id) => {
        openDeleteConfirmation(post_id);
    }

    const openDeleteConfirmation = (post_id) => {
        setPostIdToDelete(post_id);
        setDeleteConfirmationVisible(true);
    };

    const closeDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
    };

    const onDeleteConfirmed = async () => {
        let response = await deletePost(postIdToDelete);
        if (response.status) {
            toast.success(response.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            });
            retrieveAllPosts();
            setPostIdToDelete('');
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
            <CustomHeader items={forumBreadCrumb} />
            <Content style={styles.content}>
                <div style={{ display: 'flex' }}>
                    <div style={{ fontWeight: "bold", fontSize: 26 , marginBottom: 10, marginTop:10}}>
                        {category_item_name} Posts
                    </div>

                    <CustomButton
                        text="Create a Post"
                        style={{ marginLeft: 'auto', fontWeight: "bold", marginRight: '55px' }}
                        icon={<PlusOutlined />}
                        onClick={() => handleCreatePost()}
                    />

                    <CreatePostModal
                        form={createPostForm}
                        isCreatePostModalOpen={isCreatePostModalOpen}
                        onClickCancelCreatePostModal={onClickCancelCreatePostModal}
                        onClickSubmitPostCreate={onClickSubmitPostCreate}
                        user_id={user.user_id}
                        category_item_id={category_item_id}
                    />
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={postList.filter(item => item.is_published)}
                    renderItem={(item, index) => (
                        <>
                        <List.Item style={{ fontSize: 25, marginTop: 4, marginBottom: -25 }}>
                            <Link to={`/forum/post/${category_id}/${category_name}/${category_item_id}/${category_item_name}/${item.post_id}/${item.title}`}>
                                <List.Item.Meta
                                    avatar={<Avatar size="large" src={`${item.postUser.profile_pic ? item.postUser.profile_pic : 'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'}`} />}
                                    title={item.title}
                                    description={item.content}
                                    style={{ width:'1200px' }}
                                />
                            </Link>

                            {item.postUser.user_id === user.user_id && ( // only can edit and delete ur own post 
                                <div style={{ marginRight: 75, fontSize: 18 }}>
                                    <Link type="text" onClick={() => handleUpdate(item.post_id)}><EditOutlined /></Link>
                                    <Link type="text" style={{ marginLeft: '20px' }} onClick={() => handleDelete(item.post_id)}><DeleteOutlined /></Link>
                                </div>
                            )}
                        </List.Item>
                        <br/>
                        </>
                    )}
                />
                <UpdatePostModal
                    form={updatePostForm}
                    isUpdatePostModalOpen={isUpdatePostModalOpen}
                    onClickCancelUpdatePostModal={onClickCancelUpdatePostModal}
                    onClickSubmitPostUpdate={onClickSubmitPostUpdate}
                    post={selectedPost}
                />

                <Modal
                    title="Confirm Delete"
                    visible={isDeleteConfirmationVisible}
                    onOk={() => onDeleteConfirmed()}
                    onCancel={closeDeleteConfirmation}
                    okButtonProps={{ style: { fontWeight:"bold" } }}
                    cancelButtonProps={{ style: { fontWeight:"bold"} }}
                >
                    <p>Are you sure you want to delete this post?</p>
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
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 60,
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}