import { getAllCategory } from "../../redux/forumRedux";
import  { Layout, List, Avatar } from 'antd';
import { React , useEffect, useState , useRef } from 'react';
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import { Content } from "antd/es/layout/layout";
import { Navigate, Link } from 'react-router-dom';

export default function ForumCategory() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [categoryData, setCategoryData] = useState([]); 

    const forumBreadCrumb = [
        {
          title: 'Forum',
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllCategory();
            if (response.status) {
                const sortedData = response.data.sort((a, b) => a.category_id - b.category_id);
                setCategoryData(sortedData);
            } else {
                console.log("List of forum categories not fetched!");
            }
        }
        fetchData();
    }, []);

    return user ? (
        <Layout style={styles.layout}>
             <CustomHeader items={forumBreadCrumb} />
             <Content style={styles.content}>
                <div style={{ fontWeight: "bold", fontSize: 26, marginBottom: 10}}> Connect with Our Fellow Users </div> <br/>

                <List
                    itemLayout="horizontal"
                    dataSource={categoryData}
                    renderItem={(item, index) => (
                    <Link to={`/forum/${item.category_id}/${item.name}`}>
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar size="large" src={`https://tt02.s3.ap-southeast-1.amazonaws.com/static/web/forum/${item.name}.png`} />}
                                title={item.name}
                                description= {item.name + " Discussion Thread"}
                                style={{ fontSize: 25 ,  marginTop: -10 }}
                            />
                        </List.Item>
                        <br/>
                    </Link>
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
        marginLeft: 57,
    },
    button: {
        fontSize: 13,
        fontWeight: "bold"
    }
}