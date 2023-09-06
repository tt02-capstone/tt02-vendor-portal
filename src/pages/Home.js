import {Layout} from 'antd';
import React from "react";
import CustomHeader from "../components/CustomHeader";
import {Content} from "antd/es/layout/layout";

export default function Home() {


    return (
            <Layout style={styles.layout}>
                <CustomHeader text={"Header"} />

                <Content style={styles.content}>
                    <div style={{ padding: 24, minHeight: 360 }}>content</div>
                </Content>

            </Layout>
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