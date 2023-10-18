import React, {useEffect, useState} from 'react';
import {Layout, Input, Button, List, Avatar, Descriptions, Switch, Select} from 'antd';
import {SendOutlined, UserOutlined} from '@ant-design/icons';
import {
  createReply, getAllRepliesBySupportTicket,
  getAllSupportTicketsByVendorStaff,
  getSupportTicket, updateSupportTicket,
  updateSupportTicketStatus
} from "../../../../redux/supportticketRedux";
import moment from "moment/moment";
import {toast} from "react-toastify";

const { Content } = Layout;
const {Option} = Select;
const { TextArea } = Input;

export default function MessageBox(props) {
  const [fetchSupportTicket, setFetchSupportTicket] = useState(true);
  const [fetchReplyList, setFetchReplyList] = useState(true);
  const [supportTicket, setSupportTicket] = useState('');
  const [replyList, setReplyList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [isResolved, setIsResolved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Finance Related');
  const vendorstaff = JSON.parse(localStorage.getItem("user"));
  const [values, setValues] = useState({
    description: '',
    ticket_category: '',
    is_resolved: false
  });

  useEffect(() => {
    if (vendorstaff && vendorstaff.user_type === 'VENDOR_STAFF' && fetchSupportTicket) {
      const fetchData = async () => {
        console.log(vendorstaff.user_id)
        const response = await getSupportTicket(props.supportTicketId);
        if (response.status) {
          setSupportTicket(response.data);
          console.log(response.data)
          setFetchSupportTicket(false);
          setReplyList(response.data.reply_list)
          // let category = '';
          // if (response.data.ticket_category === 'MASTER_ACCOUNT_CREATION') {
          //   category = 'Admin Account Creation'
          // } else if (response.data.ticket_category === 'WALLET') {
          //   category = 'Finance Related'
          // } else {
          //   category = 'General Inquiries'
          // }
          setValues({
            is_resolved: response.data.is_resolved,
            description: response.data.description,
            ticket_category: response.data.ticket_category
          })
        } else {
          console.log("Admin Ticket list not fetched!");
        }
      }

      fetchData();

    }

      if (vendorstaff && vendorstaff.user_type === 'VENDOR_STAFF' && fetchReplyList) {
      const fetchReplyData = async () => {
        console.log(vendorstaff.user_id)
        const response = await getAllRepliesBySupportTicket(props.supportTicketId);
        if (response.status) {
          console.log(response.data)
          setFetchReplyList(false);
          setReplyList(response.data)
        } else {
          console.log("Admin Ticket list not fetched!");
        }
      }
      fetchReplyData()
    }

    }, [fetchSupportTicket, fetchReplyList]);

  const handleEdit = async () => {
    console.log(values)

    if (values.is_resolved !== supportTicket.is_resolved) {
      await handleTicketStatus()
    }

    if(values.description === supportTicket.description && values.ticket_category === supportTicket.ticket_category ) {
      return
    }

    let supportTicketObj = {
      description: values.description,
      ticket_category: values.ticket_category,
    }

    console.log("supportTicketObj", supportTicketObj);
    console.log("supportTicketId", supportTicket.support_ticket_id);

    let response = await updateSupportTicket(supportTicket.support_ticket_id, supportTicketObj);
    if (response.status) {
      setFetchSupportTicket(true)
      props.toggleFetchAdminList()
      toast.success('Ticket Updated', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });

    } else {
      console.log("Support ticket edit failed!");
      console.log(response.data);
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }

    setIsEditing(!isEditing);

  }

  const handleReplySubmit = async () => {
    let replyObj;
    console.log(vendorstaff.user_id)
    console.log("support ticket", supportTicket.support_ticket_id)
    console.log("user.user_id", vendorstaff.user_id)
    if (inputText.trim() !== '') {
      replyObj = {
        message: inputText,
      }
    }

    let response = await createReply(vendorstaff.user_id, supportTicket.support_ticket_id, replyObj);
    if (response.status) {
      console.log("createReply response", response.status)
      toast.success('Reply created!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
      setInputText('');
      setFetchReplyList(true);

    } else {
      console.log('error', response.data)
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  const getDescriptions = () => [
    { label: "Support Ticket ID", content: supportTicket.support_ticket_id },
    { label: "Created Time", content: moment(supportTicket.created_time).format('llll') },
    { label: "Last Updated", content: moment(supportTicket.updated_time).format('llll') },
    { label: "Description", content: isEditing ? (
          <TextArea
              value={values.description}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
              autoSize={{ minRows: 2, maxRows: 6 }}
          />
      ) : supportTicket.description },
    { label: "Resolved", content: isEditing ? (
          <Switch
              checked={values.is_resolved}
              onChange={(is_resolved) => setValues({ ...values, is_resolved })}
          />
      ): supportTicket.is_resolved? 'YES': 'NO' },
    { label: "Ticket Category", content: isEditing ? (
          <Select value={values.ticket_category} style={{ minWidth: 200 }} onChange={(value) => setValues({ ...values, ticket_category: value }) }>
              <Option value='MASTER_ACCOUNT_CREATION'>Admin Account Creation</Option>
              <Option value='WALLET'>Finance Related</Option>
              <Option value='GENERAL_ENQUIRY'>General Inquiries</Option>
          </Select>
      ) : supportTicket.ticket_category },
  ];
  const handleTicketStatus = async () => {
    let response = await updateSupportTicketStatus(supportTicket.support_ticket_id);
    if (response.status) {
      setFetchSupportTicket(true);
      console.log("updateSupportTicketStatus response", response.status)
      toast.success('Support ticket marked as ' + (supportTicket.is_resolved ? 'resolved' : 'unresolved') + '!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });


    } else {
      console.log('error')
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  const handleUpdate = () => {
    setIsEditing(!isEditing);
    // Perform the update logic here
  };

  return (
    <Layout style={styles.layout}>
      <Content style={{ padding: '16px' }}>
        <Descriptions
            title="Support Ticket Info"
            bordered
            style={styles.descriptions}
            extra={isEditing? <Button type="primary" onClick={handleEdit}>Save</Button>: <Button type="primary" onClick={handleUpdate}>Edit</Button>}
            column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}>
          {getDescriptions().map((item, index) => (
              <Descriptions.Item key={index} label={item.label} style={styles.item}>
                {item.content}
              </Descriptions.Item>
          ))}
        </Descriptions>

        <br />
        <Content style={styles.replyContainer}>
          <div
              style={styles.scrollableList}
          >
          <List
              itemLayout="horizontal"
              dataSource={replyList}
              renderItem={(reply, index) => (
                  <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar icon={reply.internal_staff_user ? null : <UserOutlined />} style={{ backgroundColor: reply.internal_staff_user ? '#1890ff' : '#52c41a' }} />}
                        title={reply.internal_staff_user ? 'Admin' : 'You'}
                        description={reply.message}
                        // style={{
                        //   textAlign: reply.internal_staff_user ? 'left' : 'right',
                        //   // You can add more styling here if needed, e.g., setting the background color for each message sender
                        // }}
                    />
                  </List.Item>
              )}
          />
          </div>
          <Content style={styles.replyInput}>
            <Input
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={handleReplySubmit}
                style={{ flex: 1, marginRight: '8px' }}
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReplySubmit}
            >
              Send
            </Button>
          </Content>
        </Content>
      </Content>
    </Layout>
  );
};

const styles = {
  layout: {
    minHeight: '60vh',
    minWidth: '91.5vw',
    backgroundColor: 'darkgrey'
  },
  content: {
    margin: '1vh 3vh 1vh 3vh',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: "98%",
    marginTop: '-5px'
  },
  replyContainer: {
    color: 'blue',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    padding: '16px',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  scrollableList: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  replyInput: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  descriptions: {
    backgroundColor: 'white', // Set the background color for the Descriptions
    border: '1px solid #d9d9d9', // Border style
    borderRadius: '4px', // Border radius
    padding: '16px', // Padding
    marginBottom: '16px', // Add some margin at the bottom
  },
  item: {
    // You can style the individual items here, for example:
    // fontSize: '16px',
    // fontWeight: 'bold',
    // color: 'blue',
  },
}