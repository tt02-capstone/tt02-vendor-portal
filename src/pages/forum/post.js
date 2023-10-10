import  { Layout, Card, Button , List, Avatar} from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { DeleteOutlined, EditOutlined , PlusOutlined, EyeOutlined} from "@ant-design/icons";
import { getAllPostByCategoryItemId } from '../../redux/forumRedux';

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
            to:'/forum'
        }, 
        {
            title: category_name,
            to:'/forum/' + category_id + '/' + category_name
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
                            title : item.title,
                            content : item.content, 
                            postUser : user,
                            publish_time : item.publish_time,
                            updated_time : item.updated_time
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

    const handleCreatePost = () => {
        console.log('create post');
    }

    const handleUpdate = (post_id) => {
        console.log('update');
        console.log(post_id);
    }

    const handleDelete = (post_id) => {
        console.log('delete');
        console.log(post_id);
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={forumBreadCrumb} />
             <Content style={styles.content}>
                <div style={{ display: 'flex'}}>
                    <div style={{ fontWeight: "bold", fontSize: 26}}> 
                        {category_item_name} Posts
                    </div> 

                    <CustomButton
                            text="Create a Post"
                            style={{ marginLeft:'auto', fontWeight: "bold",  marginRight: '60px'}}
                            icon={<PlusOutlined />}
                            onClick={() => handleCreatePost()}
                    />
                </div>

                <br/>

                <List
                    itemLayout="horizontal"
                    dataSource={postList}
                    renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar size="large" src={`${item.postUser.profile_pic}`} />}
                            title={item.title}
                            description= {item.content}
                            style={{ fontSize: 25 , marginBottom: 10}}
                        />

                        {item.postUser.user_id === user.user_id && ( // only can edit and delete ur own post 
                            <div>
                                <Link type="text" onClick={() => handleUpdate(item.post_id)}><EditOutlined /></Link>
                                <Link type="text" style={{ marginLeft:'20px'}} onClick={() => handleDelete(item.post_id)}><DeleteOutlined /></Link>
                            </div>
                        )}

                        <div style={{ marginRight:100, marginLeft:20}}>
                            <Link to={`/forum/post/${category_id}/${category_name}/${category_item_id}/${category_item_name}/${item.post_id}/${item.title}`}>< EyeOutlined /></Link>
                        </div>

                    </List.Item>
                    )}
                />

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