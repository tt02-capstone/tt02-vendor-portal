import React, { useState, useEffect, useRef } from "react";
import { Modal, Input, Space, Button  } from "antd";
import CustomTablePagination from "../../components/CustomTablePagination";
import { getVendorWalletHistory } from "../../redux/vendorRedux";
import { getLocalWalletHistory } from "../../redux/localRedux";
import { UserAddOutlined, SearchOutlined }  from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

export default function TransactionsModal(props) {
    const [getTransactionsData, setGetTransactionsData] = useState(true);
    const [transactionsData, setTransactionsData] = useState([]); 
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const transactionsColumns = [
        /* {
            title: 'Id',
            dataIndex: 'user_id',
            key: 'user_id',
            sorter: (a, b) => a.user_id > b.user_id,
            ...getColumnSearchProps('user_id'),
        }, */
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            sorter: (a, b) => a.type.localeCompare(b.type),
            ...getColumnSearchProps('type'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => a.date.localeCompare(b.date),
            ...getColumnSearchProps('date'),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            sorter: (a, b) => a.time.localeCompare(b.time),
            ...getColumnSearchProps('time'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount > b.amount,
            ...getColumnSearchProps('amount'),
            render: (text, record) => {
                return `${parseFloat(record.amount).toFixed(2)}`;
              },
        },
        
        
       
        
    ];

    useEffect(() => { 
        if (props.isTransactionsModalOpen) { 
            const fetchData = async () => {
                const response = props.type === 'LOCAL' ? await getLocalWalletHistory(props.id) : await getVendorWalletHistory(props.id);
                if (response.status) {

                    setTransactionsData(response.data);
                    setGetTransactionsData(false);
                } else {
                    console.log("List of transactions not fetched!");
                }
            }
    
            fetchData();
        }
    },[props.isTransactionsModalOpen]);

    return (
        <div>
            <Modal
                title="Wallet Transactions"
                centered
                id={props.id}
                type={props.type}
                open={props.isTransactionsModalOpen}
                onCancel={props.onCancelTransactionsModal}
                footer={[]} // hide default buttons of modal
            >

            <CustomTablePagination
                column={transactionsColumns}
                data={transactionsData}
            />
               
            </Modal>
        </div>
    ) 
}