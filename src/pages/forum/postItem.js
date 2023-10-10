import  { Layout, Card, Button , List, Avatar} from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { getPost } from '../../redux/forumRedux';
import moment from 'moment';

export default function PostItems() {
    let { category_name } = useParams();
    let { category_id } = useParams();
    let { category_item_name } = useParams();
    let { category_item_id } = useParams();
    let { post_title } = useParams();
    let { post_id } = useParams();

    const user = JSON.parse(localStorage.getItem("user"));
    const [post, setPost] = useState(); 
    const { Meta } = Card;

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
            title: category_item_name,
            to:'/forum/post/' + category_id + '/' + category_name + '/' + category_item_id + '/' + category_item_name
        }, 
        {
            title: post_title
        }, 
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPost(post_id);
            if (response.status) {
                let item = response.data
                const user = item.internal_staff_user || item.local_user || item.tourist_user || item.vendor_staff_user;

                const formatItem = {
                    post_id: item.post_id,
                    title : item.title,
                    content : item.content, 
                    postUser : user,
                    publish_time : item.publish_time,
                    updated_time : item.updated_time
                }

                setPost(formatItem)

                console.log('post output')
                console.log(formatItem)
            } else {
                console.log("Post not fetched!");
            }
        }
        fetchData();
    }, []);

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={forumBreadCrumb} />
             <Content style={styles.content}>
                <Card
                    style={{
                        width: '100%',
                        height: 300,
                        marginLeft: '-5px',
                        marginRight: '50px', 
                        fontSize: 20
                    }}
                    bordered={false}
                >
                    {post && (
                        <Meta
                            avatar={<Avatar size="large" src={`${post.postUser.profile_pic}`} />}
                            title={
                                <div>
                                    {post.postUser.name}
                                    <div style={{ fontSize: '14px', color: '#666' }}>Posted on: {moment(post.publish_time).format('L')} {moment(post.publish_time).format('LT')}</div>

                                </div>
                            }
                            description= {post.content}
                        />
                    )}
                    
                </Card>

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