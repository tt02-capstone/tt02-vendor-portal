import  { Layout, Card } from 'antd';
import { React , useEffect, useState } from 'react';
import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link, useParams } from 'react-router-dom';
import { getAllByCategoryItems } from '../../redux/forumRedux';

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

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={forumBreadCrumb} />
             <Content style={styles.content}>
                <div style={{ display: 'flex'}}>
                    <div style={{ fontWeight: "bold", fontSize: 26 , marginTop:10}}> 
                        {category_name} Category Items 
                    </div> 
                </div>
                
                <br/><br/>

                <div style={{ display: 'flex', flexWrap: 'wrap', width: 1800}}>
                    {categoryItems.map((item, index) => (
                        <Card
                            style={{
                                width: 500,
                                height: 630,
                                marginLeft: '-5px',
                                marginRight: '50px',
                                marginBottom: '50px'
                            }}
                            cover={
                                <Link to={`/forum/post/${category_id}/${category_name}/${item.category_item_id}/${item.name}`}>
                                    <img alt={item.name} src={item.image} style={{width:500, height:500}}/>
                                </Link>
                            }
                            bordered={false}
                            key={index}
                        >
                            <Meta
                                title={item.name}
                                description= {"Explore Posts Related to " + item.name}/>
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