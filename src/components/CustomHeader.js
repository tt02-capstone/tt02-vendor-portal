import React, { useState } from "react";
import {Header} from "antd/es/layout/layout";

const CustomHeader = (props) => {
    return(
        <Header style={{ background: 'white', textAlign: 'center' }}>
            {props.text}
        </Header>
    )
}

export default CustomHeader