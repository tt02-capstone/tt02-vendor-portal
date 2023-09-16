import React, { useState } from "react";
import { Breadcrumb } from "antd";
import {Header} from "antd/es/layout/layout";

const CustomHeader = (props) => {
    
    // items={[
    //     {
    //         title: 'Home',
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
        <Header style={{ minHeight: '8vh', background: 'white', textAlign: 'center' }}>
            <Breadcrumb
                separator=">"
                items={props.items}
                style={{
                    fontSize: '130%',
                    paddingLeft: '10px',
                    paddingTop: '25px'
                }}
            />
        </Header>
    )
}

export default CustomHeader