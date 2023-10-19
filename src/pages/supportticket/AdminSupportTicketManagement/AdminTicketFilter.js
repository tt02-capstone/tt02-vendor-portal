import React from "react";
import Menu from "antd/lib/menu";
import Dropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
export const AdminTicketFilter = ({ filterBy, ...props }) => {
  const onClick = ({ key }) => {
    filterBy(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Status: Complete</Menu.Item>
      <Menu.Item key="2">Status: In Progress</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Clear Filter</Menu.Item>
    </Menu>
  );

  return (
    <div {...props}>
      <Dropdown className="filter" overlay={menu}>
        <a className="ant-dropdown-link" href="#">
          Filter By <Icon type="down" />
        </a>
      </Dropdown>
    </div>
  );
};
