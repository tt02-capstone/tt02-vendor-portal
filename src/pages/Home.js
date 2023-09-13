import {Layout} from 'antd';
import React from "react";
import CustomHeader from "../components/CustomHeader";
import {Content} from "antd/es/layout/layout";
import { Navigate } from 'react-router-dom';

export default function Home() {
    const user = JSON.parse(localStorage.getItem("user"));

    return user ? (
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />
                
                <Content style={styles.content}>
                    <div style={{ padding: 24, minHeight: 360 }}>content</div>
                </Content>

            </Layout>
    ) :
    (
        // <div></div>
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