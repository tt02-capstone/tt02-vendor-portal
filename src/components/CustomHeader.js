import React, { useState } from "react";
import {Header} from "antd/es/layout/layout";

const CustomHeader = (props) => {
    return(
        <Header style={{ background: 'white', textAlign: 'left', fontSize: 20, border: '1px solid #ccc' }}>
            {props.text}
        </Header>
    )
}

export default CustomHeader