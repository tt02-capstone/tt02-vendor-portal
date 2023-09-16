import React, { useState } from "react";
import { Table, Pagination } from 'antd';

export default function CustomTablePagination(props) {

    // data --> actual data to be put in table. Must be in [{}, {}] format
    // style --> css
    // title --> table header
    // column --> header for each column
    // e.g.
    // const column = [
    //     {
    //         title: 'Allowed Portal Access',
    //         dataIndex: 'is_blocked',
    //         key: 'is_blocked',
    //         rowKey: 'user_id',
    //         render: (text, record) => { // text is the attribute under dataIndex, record is the entire object. e.g. record.user_id for the user id
    //             if (text === "true") {
    //                 return <CustomButton onClick(() => funcName(param)) />
    //             } else {
    //                 return <p>Yes</p>
    //             }
    //         }
    //     },
    // ];

    const pagination = {
        pageSize: 10,
    }

    return(
        <div>
            <Table
                style={props.style}
                bordered={true}
                tableLayout="fixed"
                columns={props.column}
                pagination={pagination} 
                dataSource={props.data} />
        </div>
    )
}