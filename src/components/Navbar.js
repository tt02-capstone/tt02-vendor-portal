import React, { useState } from "react";
import { Menu, Button } from "antd";
import Sider from "antd/es/layout/Sider";

function Navbar(props) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Sider
            theme="dark"
            breakpoint="lg"
            collapsedWidth="80"
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
                setCollapsed(collapsed)
            }}
            collapsible collapsed={collapsed}
        >
            {/*<div className="demo-logo-vertical" />*/}
            <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                selectedKeys={[props.currentTab]}
                items={props.menuItems}
                onClick={props.onClickNewTab}
            />
        </Sider>
    )
}

export default Navbar;