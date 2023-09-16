import React, { useState } from "react";
import { Button } from "antd";

export default function CustomButton(props) {
    
    // properties
    // text --> button text
    // icon --> button icon
    // onClick --> onClick function

    return(
        <Button 
            type="primary"
            onClick={props.onClick}
            icon={props.icon}>
        {props.text}
        </Button>
    )
}