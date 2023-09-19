import {Layout} from 'antd';
import React, {useContext, useEffect} from "react";
import CustomHeader from "../components/CustomHeader";
import {Content} from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';
import {AuthContext} from "../redux/AuthContext";

export default function Home() {
    const user = JSON.parse(localStorage.getItem("user"));
    const context = useContext(AuthContext);
    console.log(user);

    const breadcrumbItems = [
        {
          title: 'Home',
        },
      ];

    return user ? (
            <Layout style={styles.layout}>
                <CustomHeader items={breadcrumbItems} />
                
                <Content style={styles.content}>
                    <div style={{ padding: 24, minHeight: 360 }}>content</div>
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
    },
    content: {
        margin: '24px 16px 0',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}