import  { Layout, Card, Button } from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { getAllByCategoryItems } from '../../redux/forumRedux';
import { DeleteOutlined, EditOutlined , PlusOutlined, EyeOutlined} from "@ant-design/icons";

export default function ForumCategoryItems() {
    let { category_id } = useParams();
    let { category_name } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const [categoryItems, setCategoryItems] = useState([]); 

    const { Meta } = Card;

    const forumBreadCrumb = [
        {
            title: 'Forum',
            to:'/forum'
        }, 
        {
            title: category_name,
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllByCategoryItems(category_id);
            if (response.status) {
                setCategoryItems(response.data);
            } else {
                console.log("List of categories items not fetched!");
            }
        }
        fetchData();
    }, []);

    const handleUpdate = (item_id) => {
        console.log('update');
        console.log(item_id);
    }

    const handleDelete = (item_id) => {
        console.log('delete');
        console.log(item_id);
    }

    const handleCreate = () => {
        console.log('create');
    }

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={forumBreadCrumb} />
             <Content style={styles.content}>
                <div style={{ display: 'flex'}}>
                    <div style={{ fontWeight: "bold", fontSize: 26}}> 
                        {category_name} Category Items 
                    </div> 

                    <CustomButton
                            text="Add Category Item"
                            style={{ marginLeft:'auto', fontWeight: "bold", marginRight: '60px'}}
                            icon={<PlusOutlined />}
                            onClick={() => handleCreate()}
                    />
                </div>
                
                <br/><br/>

                <div style={{ display: 'flex', flexWrap: 'wrap', width: 1200}}>
                    {categoryItems.map((item, index) => (
                        <Card
                            style={{
                                width: 400,
                                height: 530,
                                marginLeft: '-5px',
                                marginRight: '50px'
                            }}
                            cover={<img alt={item.name} src={item.image} style={{width:400, height:400}}/>}
                            bordered={false}
                            key={index}
                        >
                            <Meta
                                title={item.name}
                                description= {"Explore Posts Related to " + item.name}/>

                            
                            <div style={{ marginTop:'15px', }}>
                                <Link type="text" onClick={() => handleUpdate(item.category_item_id)}><EditOutlined /></Link>
                                <Link type="text" style={{ marginLeft:'20px'}} onClick={() => handleDelete(item.category_item_id)}><DeleteOutlined /></Link>
                                <Link style={{ marginLeft:'20px'}} to={`/forum/post/${category_id}/${category_name}/${item.category_item_id}/${item.name}`}>< EyeOutlined /></Link>
                            </div>
                        </Card>
                    ))}
                </div>
                
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