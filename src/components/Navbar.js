import React, { useEffect, useState } from "react";
import { Menu, Button } from "antd";
import Sider from "antd/es/layout/Sider";

function Navbar(props) {
    
    const user = JSON.parse(localStorage.getItem("user"));
    const [menuItems, setMenuItems] = useState();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        if (user && user.user_type === 'VENDOR_STAFF') {
            setMenuItems(props.vendorStaffMenuItems);
        } else if (user && user.user_type === 'LOCAL') {
            setMenuItems(props.localMenuItems);
        }
    },[])

    return user ? (
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
                style={{fontSize: '100%'}}
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                selectedKeys={[props.currentTab]}
                items={menuItems}
                onClick={props.onClickNewTab}
            />
        </Sider>
    ) :
    (
        <></>
    )
}

export default Navbar;