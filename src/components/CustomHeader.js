import React from "react";
import { Breadcrumb } from "antd";
import { Header } from "antd/es/layout/layout";
import { Link } from "react-router-dom";

const CustomHeader = (props) => {
    return (
        <Header style={{ minHeight: '8vh', background: 'white', textAlign: 'left', fontWeight: "bold" }}>
            {props.items && (
                <Breadcrumb separator=">" style={{ fontSize: '130%', paddingLeft: '10px', paddingTop: '25px'}}>
                    {props.items.map((item, index) => (
                        <span key={index} style={{ paddingRight:'10px'}}>
                            {item.to ? (
                                <Link to={item.to} style={{color:'#096dd9'}}>{item.title}</Link>
                            ) : (
                                item.title
                            )}
                            {index < props.items.length - 1 && ' > '}
                        </span>
                    ))}
                </Breadcrumb>
            )}
        </Header>
    )
}

export default CustomHeader;
