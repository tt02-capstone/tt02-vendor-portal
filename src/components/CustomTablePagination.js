import React, { useState } from "react";
import { Radio, Space, Table, Tag } from 'antd';

export default function CustomTablePagination(props) {

    const pagination = {
    }

    return(
        <div>
            <Table
                title={() => props.title}
                bordered={true}
                columns={props.column}
                pagination={pagination} 
                dataSource={props.data} />
        </div>
    )
}