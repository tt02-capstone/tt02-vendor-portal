import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/CustomHeader";
import {
    Row
} from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import { verifyEmail } from '../redux/vendorStaffRedux';

const styles = {
    layout: {
        minHeight: '100vh',
    },
    content: {
        margin: '24px 16px 0',
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
}

function EmailVerification() {
    const [successful, setSuccessful] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await verifyEmail(new URLSearchParams(document.location.search)
                    .get('token'));
                if (response.status) {
                    setSuccessful(true);
                } else {
                    setSuccessful(false);
                }
            } catch (error) {
                alert('An error occurred! Failed to retrieve pending applications!');
            }
        };
        fetchData();
    }, []);

    return successful ? (
        <Layout style={styles.layout}>
            <CustomHeader text={"Email Verification"} />
            <Row align='middle' justify='center'>
                <p>Your email has been verified successfully.</p>
            </Row>
        </Layout>
    ) : (
        <Layout style={styles.layout}>
            <CustomHeader text={"Email Verification"} />
            <Row align='middle' justify='center'>
                <p>There was an issue verifying your email, either the token is invalid or your email has already been verified.</p>
            </Row>
        </Layout>
    );
}

export default EmailVerification;