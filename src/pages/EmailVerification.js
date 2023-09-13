import React, { useState } from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/CustomHeader";
import {
    Row
} from 'antd';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

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
    const baseURL = "http://localhost:8080/vendorStaff";
    const [successful, setSuccessful] = useState(true);
    axios.get(`${baseURL}/verifyEmail/${new URLSearchParams(document.location.search)
        .get('token')}`).then((response) => {
            console.log(response);
            if (response.data.httpStatusCode === 400 || response.data.httpStatusCode === 404) {
                setSuccessful(false);
            } else {
                setSuccessful(true);
            }
        })
        .catch((error) => {
            console.error("Axios Error : ", error)
        });

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