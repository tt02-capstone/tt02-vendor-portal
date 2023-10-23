import React, { useEffect, useState } from 'react';
import { Layout, Input, Button, List, Avatar, Descriptions, Switch, Select, Badge, Tag, Modal } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import {
  createReply, getAllRepliesBySupportTicket,
  getSupportTicket, updateSupportTicket,
  updateSupportTicketStatus, updateReply, deleteReply
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
import ViewAttractionBookingModal from "../bookings/ViewAttractionBookingModal";
import ViewRoomBookingModal from "../bookings/ViewRoomBookingModal";
import ViewTelecomBookingModal from "../bookings/ViewTelecomBookingModal";

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
  const [replyIdToEdit, setReplyIdToEdit] = useState('');
  const [replyIdToDelete, setReplyIdToDelete] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openEditReplyModal, setOpenEditReplyModal] = React.useState(false);
  const [editedMessage, setEditedMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState(false);
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
  const [isViewAttractionBookingModal, setIsViewAttractionBookingModal] = useState(false);
  const [isViewRoomBookingModal, setIsViewRoomBookingModal] = useState(false);
  const [isViewTelecomBookingModal, setIsViewTelecomBookingModal] = useState(false);
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

          setTicketStatus(response.data.is_resolved)
          console.log("Curr vl", response.data.is_resolved)
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

    if (values.description === supportTicket.description) {
      setIsEditing(!isEditing);
      setFetchSupportTicket(true)
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
      if (props.toggleFetchAdminList) {
        props.toggleFetchAdminList();
      } else {
        props.toggleFetchUserList();
      }
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

  const formatUserType = (userType) => {
    if (userType === "VENDOR_STAFF" || userType === "VENDOR") {
      return 'Vendor';
    } else if (userType === "ADMIN") {
      return 'Admin';
    } else if (userType === "TOURIST") {
      return 'Tourist';
    } else if (userType === "LOCAL") {
      return 'Local';
    }
    return '';
  };

  const categoryColorMap = {
    REFUND: 'red',
    CANCELLATION: 'blue',
    GENERAL_ENQUIRY: 'purple',
    BOOKING: 'gold',
    DEAL: 'cyan',
    RESTAURANT: 'magenta',
    ATTRACTION: 'orange',
    TELECOM: 'volcano',
    ACCOMMODATION: 'lime',
    TOUR: 'geekblue',
  };

  const getColorForCategory = (category) => {
    const color = categoryColorMap[category] || 'gray';
    const formattedCategory = category ? category.replace('_', ' ') : 'N/A';
    return { color, formattedCategory };
  };

  const getDescriptions = () => [
    { label: "Submitted By", content: supportTicket.submitted_user_name },
    { label: "From / To", content: `From ${formatUserType(supportTicket.submitted_user)} to ${formatUserType(supportTicket.ticket_type)}` },
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
    console.log("Ticket Status", supportTicket.is_resolved);

    setTicketStatus(!ticketStatus);

    let response = await updateSupportTicketStatus(supportTicket.support_ticket_id);
    if (response.status) {
      setFetchSupportTicket(true);
      setFetchReplyList(true);
      if (props.toggleFetchUserList) {
        props.toggleFetchUserList();
      } else {
        props.toggleFetchAdminList();
      }
      console.log("updateSupportTicketStatus response", response.data.is_resolved)
      toast.success('Support ticket marked as ' + (response.data.is_resolved ? 'resolved' : 'unresolved') + '!', {
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

  const [isEditReplyModalOpen, setIsEditReplyModalOpen] = useState(false);

  function onClickOpenEditReplyModal(replyId) {
    setReplyIdToEdit(replyId);
    setIsEditReplyModalOpen(true);
  }

  // edit accom modal cancel button
  function onClickCancelEditReplyModal() {
    setIsEditReplyModalOpen(false);
  }

  function handleEditReply(replyId) {
    console.log("replyId", replyId);
    setReplyIdToEdit(replyId);
    setEditedMessage(replyList.find(reply => reply.reply_id === replyId).message);
    setOpenEditReplyModal(true);
  };

  async function handleEditReplySubmission(replyIdToEdit) {

    console.log("replyIdToEdit", replyIdToEdit);

    let replyObj = {
      message: editedMessage,
    };

    let response = await updateReply(replyIdToEdit, replyObj);

    if (response.status) {
      toast.success('Reply edited!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });

      setOpenEditReplyModal(false);

      setFetchReplyList(true);

    } else {
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

  function handleDelete(replyId) {
    setReplyIdToDelete(replyId);
    console.log("replyIdToDelete", replyIdToDelete);
    setOpenDeleteModal(true);
  };

  useEffect(() => {
  }, [replyIdToDelete, replyIdToEdit]);

  async function handleConfirmDelete(replySupportTicketId, replyId) {

    let response = await deleteReply(replySupportTicketId, replyId);

    if (response.status) {

      toast.success('Reply deleted!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });

      setOpenDeleteModal(false);

      setFetchReplyList(true);

    } else {
      toast.error(response.data.errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      });
    }
  }

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


  const renderCategoryButtons = () => {
    const buttons = [];

    if (supportTicket.attraction) {
      buttons.push(
        <div key="attraction">
          <CustomButton
            text="View Attraction"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.telecom) {
      buttons.push(
        <div key="telecom">
          <CustomButton
            text="View Telecom"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.deal) {
      buttons.push(
        <div key="deal">
          <CustomButton
            text="View Deal"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.accommodation) {
      buttons.push(
        <div key="accommodation">
          <CustomButton
            text="View Accommodation"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.restaurant) {
      buttons.push(
        <div key="restaurant">
          <CustomButton
            text="View Restaurant"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.tour) {
      buttons.push(
        <div key="tour">
          <CustomButton
            text="View Tour"
            style={{ fontWeight: "bold", marginTop: '10px' }}
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
      );
    }

    if (supportTicket.booking && supportTicket.booking.attraction) {
      buttons.push(
        <div key="attractionBooking">
          <CustomButton
            text="View Booking"
            style={{ fontWeight: "bold", marginTop: '10px' }}
            onClick={() => { setIsViewAttractionBookingModal(true); }}
          />
          {supportTicket.booking.booking_id ? (
            <ViewAttractionBookingModal
                openViewModal={isViewAttractionBookingModal}
                onClickCancelViewAttractionBookingModal={() => { setIsViewAttractionBookingModal(false); }}
                id={supportTicket.booking.booking_id}
            />
          ) : null}
        </div>
      );
    }

    if (supportTicket.booking && supportTicket.booking.telecom) {
      buttons.push(
        <div key="telecomBooking">
          <CustomButton
            text="View Booking"
            style={{ fontWeight: "bold", marginTop: '10px' }}
            onClick={() => { setIsViewTelecomBookingModal(true); }}
          />
          {supportTicket.booking.booking_id ? (
            <ViewTelecomBookingModal
                openViewModal={isViewTelecomBookingModal}
                onClickCancelViewTelecomBookingModal={() => { setIsViewTelecomBookingModal(false); }}
                id={supportTicket.booking.booking_id}
            />
          ) : null}
        </div>
      );
    }

    if (supportTicket.booking && supportTicket.booking.room) {
      buttons.push(
        <div key="roomBooking">
          <CustomButton
            text="View Booking"
            style={{ fontWeight: "bold", marginTop: '10px' }}
            onClick={() => { setIsViewRoomBookingModal(true); }}
          />
          {supportTicket.booking.booking_id ? (
            <ViewRoomBookingModal
                openViewModal={isViewRoomBookingModal}
              onClickCancelViewRoomBookingModal={() => { setIsViewRoomBookingModal(false); }}
                id={supportTicket.booking.booking_id}
            />
          ) : null}
        </div>
      );
    }

    return buttons;
  };

  const getUserImage = (reply) => {
    if (reply.internal_staff_user && reply.internal_staff_user.profile_pic) {
      return reply.internal_staff_user.profile_pic
    } else if(reply.local_user && reply.local_user.profile_pic){
      return reply.local_user.profile_pic
    } else if(reply.vendor_staff_user && reply.vendor_staff_user.profile_pic){
      return reply.vendor_staff_user.profile_pic

    } else if(reply.tourist_user && reply.tourist_user.profile_pic){
      return reply.tourist_user.profile_pic

    } else {
      return  'http://tt02.s3-ap-southeast-1.amazonaws.com/user/default_profile.jpg'
    }
  }

  return (
    <Layout style={styles.layout}>
      <Content style={{ padding: '16px' }}>

        <Descriptions
          title={`Support Ticket ID: #${supportTicket.support_ticket_id}`}
          bordered
          style={styles.descriptions}
          // add in reopen ticket button
          extra={
            isEditing ? (
              <div>
                <Button type="primary" onClick={handleEdit} style={{marginRight: '8px'}}>Save</Button>
                <Button
                  type="primary"
                  onClick={handleTicketStatus}
                  style={{
                    backgroundColor: supportTicket.is_resolved ? "#1da31d" : "#db2c45",
                    fontWeight: 'bold',
                  }}
                >
                  {supportTicket.is_resolved ? "Reopen Ticket" : "Close Ticket"}
                </Button>
              </div>
            ) : (
              <div>
                <Button type="primary" onClick={handleUpdate} style={{ marginRight: '8px' }}>
                  Edit
                </Button>
                <Button
                  type="primary"
                  onClick={handleTicketStatus}
                  style={{
                    backgroundColor: supportTicket.is_resolved ? "#1da31d" : "#db2c45",
                    fontWeight: 'bold',
                  }}
                >
                  {supportTicket.is_resolved ? "Reopen Ticket" : "Close Ticket"}
                </Button>
              </div>
            )
          }
          column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}>
          {getDescriptions().map((item, index) => (
            <Descriptions.Item key={index} label={item.label} style={styles.item}>
              {item.label === 'Description' ? (
                <div style={{ height: '150px', overflow: 'auto', display: 'flex', alignItems: 'center' }}>{item.content}</div>
              ) : item.label === 'Ticket Category' ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Tag color={getColorForCategory(supportTicket.ticket_category).color}>
                    {getColorForCategory(supportTicket.ticket_category).formattedCategory}
                  </Tag>
                  {renderCategoryButtons()}
                </div>
              ) : (
                item.content
              )}
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
                <List.Item
                  actions={
                    ((reply.internal_staff_user != null && reply.internal_staff_user.user_id === vendorstaff.user_id)) &&
                      index === replyList.length - 1 && !supportTicket.is_resolved
                      ? [
                        <Button key="edit" type="primary" onClick={() => handleEditReply(reply.reply_id)}>
                          Edit
                        </Button>,
                        <Button key="delete" type="danger" onClick={() => handleDelete(reply.reply_id)}>
                          Delete
                        </Button>,
                      ]
                      : null
                  }>
                  <List.Item.Meta
                    avatar={<img
                        src={getUserImage(reply)}
                        style={{borderRadius: '50%', width: '20px', height: '20px'}}
                    />}
                    title={
                      <div>
                        <div style={styles.replyUserType}>{getReplyUserType(reply)}</div>
                        <div>{getReplyUser(reply)}</div>
                      </div>
                    }
                    description={<span style={{ color: 'black' }}>{reply.message}</span>}
                  />
                </List.Item>
              )}
            />
          </div>
          {!supportTicket.is_resolved && (
            <Content style={styles.replyInput}>
              <Input
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onPressEnter={handleReplySubmit}
                style={{ flex: 1, marginRight: '8px', height: '40px' }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleReplySubmit}
                style={{ height: '40px' }}
              >
                Send
              </Button>
            </Content>
          )}
          {supportTicket.is_resolved && (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <hr style={{ flex: 1, border: '1px solid lightgray', marginRight: '8px' }} />
              <p style={{ color: 'black', fontSize: '16px', marginLeft: '20px', marginRight: '20px' }}>Ticket is closed</p>
              <hr style={{ flex: 1, border: '1px solid lightgray', marginLeft: '8px' }} />
            </span>
          )}

          <Modal
            title="Edit Reply"
            visible={openEditReplyModal}
            onOk={() => handleEditReplySubmission(replyIdToEdit)}
            onCancel={() => setOpenEditReplyModal(false)}
            okText="Submit"
            cancelText="Cancel"
          >
            <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <label htmlFor="editedMessage">Message: </label>
              <input
                type="text"
                id="editedMessage"
                value={editedMessage}
                style={{ marginLeft: '10px', width: '60%', height: '40px' }}
                onChange={(e) => setEditedMessage(e.target.value)}
              />
            </div>
          </Modal>

          <Modal
            title="Delete Confirmation"
            visible={openDeleteModal}
            onOk={() => handleConfirmDelete(supportTicket.support_ticket_id, replyIdToDelete)}
            onCancel={() => setOpenDeleteModal(false)}
            okText="Yes"
            cancelText="Cancel"
          >
            <p>Are you sure you want to delete this reply?</p>
          </Modal>
        </Content>
      </Content >
    </Layout >
  );
};

const styles = {
  layout: {
    minHeight: '100%',
    minWidth: '100%',
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