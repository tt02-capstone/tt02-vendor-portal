import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {Header} from "antd/es/layout/layout";

const CustomHeader = (props) => {
    
    // const breadCrumbItems = [
    //     {
    //         title: 'Profile',
    //     },
    //     {
    //         title: 'Application Center',
    //         href: '',
    //     },
    //     {
    //         title: 'Application List',
    //         href: '',
    //     },
    //     {
    //         title: 'An Application',
    //     },
    // ]
    
    return(
        <Header style={{ minHeight: '6vh', background: 'white', textAlign: 'center' }}>
            <Breadcrumb
                separator=">"
                items={props.items}
                style={{
                    fontSize: '160%',
                    paddingLeft: '3px',
                    paddingTop: '20px',
                    fontWeight: 'bold'
                }}
            />
        </Header>
    )
}

export default CustomHeader