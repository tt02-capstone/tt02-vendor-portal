import React, { useState } from "react";
import { Table, Pagination, Input, Tag, Space } from 'antd';

export default function CustomTablePagination(props) {
    const [searchText, setSearchText] = useState('');
    const { sortField, sortOrder } = props;

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

    const handleSearch = (selectedKeys, confirm) => () => {
        confirm();
    }

    const handleReset = clearFilters => () => {
        clearFilters();
        setSearchText('');
    }

    const columns = props.column.map(col => {
        if (col.dataIndex !== 'actions') { // Exclude actions column from search and sort
            return {
                ...col,
                onFilter: (value, record) =>
                    record[col.dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                sorter: (a, b) => {
                    if (typeof a[col.dataIndex] === 'string') {
                        return a[col.dataIndex].localeCompare(b[col.dataIndex]);
                    } else {
                        return a[col.dataIndex] - b[col.dataIndex];
                    }
                },
                sortOrder: sortField === col.dataIndex && sortOrder,
                filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                    <div style={{ padding: 8 }}>
                        <Input
                            placeholder={`Search ${col.title}`}
                            value={selectedKeys[0]}
                            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                            onPressEnter={handleSearch(selectedKeys, confirm)}
                            style={{ width: 188, marginBottom: 8, display: 'block' }}
                        />
                        <button onClick={handleReset(clearFilters)} style={{ width: 90, marginRight: 8 }}>
                            Reset
                        </button>
                    </div>
                ),
                filterIcon: filtered => (
                    <i className="anticon anticon-search"></i>
                ),
            };
        }
        return col;
    });

    const pagination = {
        pageSize: 10,
    }

    return (
        <div>
            <Table
                style={props.style}
                bordered={true}
                tableLayout={props.tableLayout}
                columns={columns}
                pagination={pagination}
                dataSource={props.data}
                onChange={(pagination, filters, sorter) => {
                    if (props.onTableChange) {
                        props.onTableChange(sorter.field, sorter.order, filters);
                    }
                }}
            />
        </div>
    )
}
