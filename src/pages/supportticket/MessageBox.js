import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, List, Avatar, Descriptions, Switch, Select, Badge } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import {
  createReply, getAllRepliesBySupportTicket,
  getSupportTicket, updateSupportTicket,
  updateSupportTicketStatus
} from "../../redux/supportticketRedux";
import moment from "moment/moment";
import { toast } from "react-toastify";
import ViewAttractionModal from "../attractions/ViewAttractionModal";
import CustomButton from "../../components/CustomButton";
import ViewTelecomModal from "../telecom/ViewTelecomModal";
import ViewDealModal from "../deals/ViewDealModal";
import ViewAccommodationModal from "../accommodations/ViewAccommodationModal";
import ViewRestaurantModal from "../restaurant/ViewRestaurantModal";
import ViewTourModal from "../tour/ViewTourModal";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

export default function MessageBox(props) {
  const [fetchSupportTicket, setFetchSupportTicket] = useState(true);
  const [fetchReplyList, setFetchReplyList] = useState(true);
  const [supportTicket, setSupportTicket] = useState('');
  const [replyList, setReplyList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const vendorstaff = JSON.parse(localStorage.getItem("user"));
  const [values, setValues] = useState({
    description: '',
    ticket_category: '',
    is_resolved: false
  });

  // VIEW ATTRACTION
  const [isViewAttractionModalOpen, setIsViewAttractionModalOpen] = useState(false);
  const [isViewDealModal, setIsViewDealModal] = useState(false);
  const [isViewTelecomModal, setIsViewTelecomModal] = useState(false);
  const [isViewAccommodationModal, setIsViewAccommodationModal] = useState(false);
  const [isViewBookingModal, setIsViewBookingModal] = useState(false);
  const [isViewRestaurantModal, setIsViewRestaurantModal] = useState(false);
  const [isViewTourModal, setIsViewTourModal] = useState(false);

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

    if (values.description === supportTicket.description && values.ticket_category === supportTicket.ticket_category) {
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
    { label: "Submitted By", content: supportTicket.submitted_user_name },
    // { label: "From / To", content: `From ${formatUserType(supportTicket.submitted_user)} to ${formatUserType(supportTicket.ticket_type)}` },
    {
      label: "Ticket Category", content: isEditing ? (
        <Select value={values.ticket_category} style={{ minWidth: 200 }} onChange={(value) => setValues({ ...values, ticket_category: value })}>
          <Option value='MASTER_ACCOUNT_CREATION'>Admin Account Creation</Option>
          <Option value='WALLET'>Finance Related</Option>
          <Option value='GENERAL_ENQUIRY'>General Inquiries</Option>
        </Select>
      ) : supportTicket.ticket_category
    },
    {
      label: "Status", content: isEditing ? (
        <Switch
          checked={values.is_resolved}
          onChange={(is_resolved) => setValues({ ...values, is_resolved })}
        />
      ) : (
        <Badge
          status={supportTicket.is_resolved ? 'error' : 'success'}
          text={supportTicket.is_resolved ? 'Closed' : 'Open'}
        />
      )
    },
    { label: "Created Time", content: moment(supportTicket.created_time).format('llll') },
    { label: "Last Updated", content: moment(supportTicket.updated_time).format('llll') },
    {
      label: "Description", content: isEditing ? (
        <TextArea
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
      ) : supportTicket.description
    },
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

  const getReplyUserType = (item) => {
    if (item.tourist_user != null) {
      return 'Tourist';
    } else if (item.local_user != null) {
      return 'Local';
    } else if (item.vendor_staff_user != null) {
      if (supportTicket.attraction != null) {
        return 'Vendor' + ' - ' + supportTicket.attraction.name;
      } else if (supportTicket.accommodation != null) {
        return 'Vendor' + ' - ' + supportTicket.accommodation.name;
      } else if (supportTicket.tour != null) {
        return 'Vendor' + ' - ' + supportTicket.tour.name;
      } else if (supportTicket.telecom != null) {
        return 'Vendor' + ' - ' + supportTicket.telecom.name;
      } else if (supportTicket.restaurant != null) {
        return 'Vendor' + ' - ' + supportTicket.restaurant.name;
      } else if (supportTicket.deal != null) {
        return 'Vendor' + ' - ' + supportTicket.deal.name;
      } else {
        return 'Vendor';
      }
    } else if (item.internal_staff_user != null) {
      return 'Admin';
    } else {
      return 'Error';
    }
  }
  const getReplyUser = (item) => {
    if (item.tourist_user != null) {
      return item.tourist_user.name;
    } else if (item.local_user != null) {
      return item.local_user.name;
    } else if (item.vendor_staff_user != null) {
      return item.vendor_staff_user.name;
    } else if (item.internal_staff_user != null) {
      return item.internal_staff_user.name;
    } else {
      return 'Error';
    }
  }
  return (
    <Layout style={styles.layout}>
      <Content style={{ padding: '16px' }}>

        {supportTicket.attraction ? (
          <div>
            <CustomButton
              text="View Attraction"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewAttractionModalOpen(true); }}
            />
            {supportTicket.attraction.attraction_id ? (
              <ViewAttractionModal
                isViewAttractionModalOpen={isViewAttractionModalOpen}
                onClickCancelViewAttractionModal={() => { setIsViewAttractionModalOpen(false); }}
                attractionId={supportTicket.attraction.attraction_id}
              />
            ) : null}
          </div>
        ) : null}

        {supportTicket.telecom ? (
          <div>
            <CustomButton
              text="View Telecom"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewTelecomModal(true); }}
            />
            {supportTicket.telecom.telecom_id ? (
              <ViewTelecomModal
                selectedTelecomId={supportTicket.telecom.telecom_id}
                viewTelecomModal={isViewTelecomModal}
                onCancelViewModal={() => { setIsViewTelecomModal(false); }}
              />
            ) : null}
          </div>
        ) : null}


        {supportTicket.deal ? (
          <div>
            <CustomButton
              text="View Deal"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewDealModal(true); }}
            />
            {supportTicket.deal.deal_id ? (
              <ViewDealModal
                selectedDealId={supportTicket.deal.deal_id}
                viewDealModal={isViewDealModal}
                onCancelViewModal={() => { setIsViewDealModal(false); }}
              />
            ) : null}
          </div>
        ) : null}


        {supportTicket.accommodation ? (
          <div>
            <CustomButton
              text="View Accommodation"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewAccommodationModal(true); }}
            />
            {supportTicket.accommodation.accommodation_id ? (
              <ViewAccommodationModal
                isViewAccommodationModalOpen={isViewAccommodationModal}
                onClickCancelViewAccommodationModal={() => { setIsViewAccommodationModal(false); }}
                accommodationId={supportTicket.accommodation.accommodation_id}
              />
            ) : null}
          </div>
        ) : null}

        {supportTicket.restaurant ? (
          <div>
            <CustomButton
              text="View Telecom"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewRestaurantModal(true); }}
            />
            {supportTicket.restaurant.restaurant_id ? (
              <ViewRestaurantModal
                isViewRestaurantModalOpen={isViewRestaurantModal}
                onClickCancelViewRestaurantModal={() => { setIsViewRestaurantModal(false); }}
                restId={supportTicket.restaurant.restaurant_id}
              />
            ) : null}
          </div>
        ) : null}

        {supportTicket.tour ? (
          <div>
            <CustomButton
              text="View Telecom"
              style={{ fontWeight: "bold" }}
              onClick={() => { setIsViewTourModal(true); }}
            />
            {supportTicket.tour.tour_id ? (
              <ViewTourModal
                isViewTourModalOpen={isViewTourModal}
                onClickCancelViewTourModal={() => { setIsViewTourModal(false); }}
                tourId={supportTicket.tour.tour_id}
              />
            ) : null}
          </div>
        ) : null}

        <Descriptions
          title="Support Ticket Info"
          bordered
          style={styles.descriptions}
          extra={isEditing ? <Button type="primary" onClick={handleEdit}>Save</Button> : <Button type="primary" onClick={handleUpdate}>Edit</Button>}
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}>
          {getDescriptions().map((item, index) => (
            <>
              <Descriptions.Item key={index} label={item.label} style={styles.item}>
                {item.content}
              </Descriptions.Item>
              {/* Modal to view attraction */}
            </>

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
                    title={getReplyUser(reply)}
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