import React, { useState } from "react";
import { Menu, Button } from "antd";
import Sider from "antd/es/layout/Sider";

function Navbar(props) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider
            theme="light"
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
                setCollapsed(collapsed)
            }}
            collapsible collapsed={collapsed}
        >
            {/*<div className="demo-logo-vertical" />*/}
            <Menu
                theme="light"
                defaultSelectedKeys={['1']}
                mode="inline"
                selectedKeys={[props.currentTab]}
                items={props.menuItems}
                onClick={props.onClickNewTab}
                style={{display: 'flex', flexDirection: 'column', width: '100%'}}
            />
        </Sider>
    )
}

export default Navbar;