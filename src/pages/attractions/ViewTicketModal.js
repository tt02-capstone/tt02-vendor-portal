import React, {useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DatePicker, Modal, Select, Form, Button, Tag, Row, Col, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import CustomTablePagination from "../../components/CustomTablePagination"
import moment from 'moment';
import { getAllTicketListedByAttractionInTimeRange } from '../../redux/attractionManageTicketRedux';
import {disabledDateChecker} from "../../helper/dateFormat";
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ViewTicketModal(props) {
    
    const [form] = Form.useForm();
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.onCancel) {
            form.resetFields(); // Reset the form fields
            setData([]); // clear table data
        }
    }, [props.onCancel, form]);

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

    const column = [
        {
            title: 'Date',
            dataIndex: 'ticket_date',
            key: 'ticket_date',
            sorter: (a, b) => new Date(a.ticket_date) > new Date(b.ticket_date),
            ...getColumnSearchProps('ticket_date'),
            render: (text, record) => {
                return text;
            }
        },
        {
            title: 'Ticket Type',
            dataIndex: 'ticket_type',
            key: 'ticket_type',
            filters: [
                {
                    text: 'All',
                    value: 'ALL',
                },
                {
                    text: 'Child',
                    value: 'CHILD',
                },
                {
                    text: 'Teenager',
                    value: 'TEENAGER',
                },
                {
                    text: 'Adult',
                    value: 'ADULT',
                },
                {
                    text: 'Senior',
                    value: 'SENIOR',
                },
            ],
            onFilter: (value, record) => record.ticket_type === value,
            render: (text, record) => {
                let color = 'default';
                let tempText = text;
                switch (text) {
                    case 'ALL':
                        color = 'magenta';
                        tempText = 'All'
                        break;
                    case 'CHILD':
                        color = 'volcano';
                        tempText = 'Child'
                        break;
                    case 'TEENAGER':
                        color = 'green';
                        tempText = 'Teenager'
                        break;
                    case 'ADULT':
                        color = 'cyan';
                        tempText = 'Adult'
                        break;
                    case 'SENIOR':
                        color = 'purple';
                        tempText = 'Senior'
                        break;
                }

                return <Tag color={color}>{tempText}</Tag>;
            },
        },
        {
            title: 'Ticket(s) Remaining',
            dataIndex: 'ticket_count',
            key: 'ticket_count',
            sorter: (a, b) => a.ticket_count > b.ticket_count,
            ...getColumnSearchProps('ticket_count'),
        },
    ];

    // upon table search
    async function onSearch(val) {
        let startDate = dayjs(val.dateRange[0]).format("YYYY-MM-DD");
        let endDate = dayjs(val.dateRange[1]).format("YYYY-MM-DD");
        let response = await getAllTicketListedByAttractionInTimeRange(props.id, startDate, endDate);
        if (response.status) {
            let tempData = response.data.map((val) => ({
                ...val,
                ticket_date: moment(val.ticket_date).format('ll'),
                key: val.ticket_per_day_id,
            }));
            setData(tempData);
        } else {
            console.log("data not fetched!");
        }
    }

    return (
        <div>
            <Modal
                title="View Ticket(s)"
                centered
                open={props.isVisible}
                onCancel={props.onCancel}
                footer={null}
                style={{height: 800}}
            >
                <Form
                    form={form}
                    name="viewTicketForm"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 15 }}
                    style={{ maxWidth: 800 }}
                    onFinish={onSearch}
                >
                    <Row>
                        <Col span={20} style={{marginRight: '-35px'}}>
                            <Form.Item
                                name="dateRange"
                                label="Select Range:"
                                rules={[{ required: true, message: 'Date range is required!'}]}
                            >
                                <RangePicker
                                    format="YYYY-MM-DD"
                                    disabledDate={disabledDateChecker}

                                />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item wrapperCol={{ offset: 11, span: 10 }}>
                                <Button type="primary" htmlType="submit">
                                    Search
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <CustomTablePagination data={data} column={column} tableLayout="fixed" />
            </Modal>
        </div>
    )
}