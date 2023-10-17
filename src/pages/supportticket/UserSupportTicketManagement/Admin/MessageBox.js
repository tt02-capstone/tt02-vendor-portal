import React, {useEffect, useState} from 'react';
import { Layout, Input, Button, List, Avatar } from 'antd';
import {SendOutlined, UserOutlined} from '@ant-design/icons';
import {
  createReply, getAllRepliesBySupportTicket,
  getAllSupportTicketsByVendorStaff,
  getSupportTicket,
  updateSupportTicketStatus
} from "../../../../redux/supportticketRedux";
import moment from "moment/moment";
import {toast} from "react-toastify";

const { Content } = Layout;
export default function MessageBox(props) {
  const [fetchSupportTicket, setFetchSupportTicket] = useState(true);
  const [fetchReplyList, setFetchReplyList] = useState(true);
  const [supportTicket, setSupportTicket] = useState('');
  const [replyList, setReplyList] = useState([]);
  const [inputText, setInputText] = useState('');
  const vendorstaff = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    if (vendorstaff && vendorstaff.user_type === 'VENDOR_STAFF' && fetchSupportTicket) {
      const fetchData = async () => {
        console.log(vendorstaff.user_id)
        const response = await getSupportTicket(props.supportTicketId);
        if (response.status) {
          setSupportTicket(response.data);
          setFetchSupportTicket(false);
          setReplyList(response.data.reply_list)
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

  const handleTicketStatus = async () => {
    let response = await updateSupportTicketStatus(supportTicket.support_ticket_id);
    if (response.status) {
      console.log("updateSupportTicketStatus response", response.status)
      toast.success('Support ticket marked as ' + (supportTicket.is_resolved ? 'resolved' : 'unresolved') + '!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });

      setFetchReplyList(true);

    } else {
      console.log('error')
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '16px' }}>
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px', padding: '16px', minHeight: '400px' }}>
          <List
            itemLayout="horizontal"
            dataSource={replyList}
            renderItem={(reply, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={reply.internal_staff_user ? null : <UserOutlined />} />}
                  title={reply.internal_staff_user ? 'Admin': 'You' }
                  description={reply.message}
                />
              </List.Item>
              //   <>
              //   </>
            )}
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <Input
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPressEnter={handleReplySubmit}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleReplySubmit}
          >
            Send
          </Button>
        </div>
      </Content>
    </Layout>
  );
};