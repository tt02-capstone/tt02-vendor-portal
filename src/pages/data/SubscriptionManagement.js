import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SmileOutlined, DashboardOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu, Descriptions, Badge, Typography, Item, Modal } from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import SubscriptionModal from "./SubscriptionModal";
import CustomButton from "../../components/CustomButton";
import { Chart as ChartJS, LineController,LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend,TimeScale} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import {  subscribe, getSubscription, unsubscribe, renewSubscription, updateSubscription } from "../../redux/dataRedux";
import { set } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';


export default function SubscriptionManagement() {
    const { Title } = Typography;
    const [isSubscribed, setIsSubscribed] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [data, setData] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    plan: "Monthly",
    expiry: "2023-12-31",
    nextBillingDate: "2023-12-31",
    autoRenewal: true,
    status: "Active"
  });
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [operation, setOperation] = useState("UPDATE");

  function onClickCancelManageSubButton() {
    setIsSubModalOpen(false);
  }

  function onClickManageSubButton(operationString) {
    console.log('check')
    setIsSubModalOpen(true);
    setOperation(operationString);
  }

  function onClickCancelSubButton() {
    Modal.confirm({
      title: 'Are you sure you want to unsubscribe?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          // Replace this with your API call to fetch user subscription status
          const response = await unsubscribe(subscriptionDetails.subscription_id);
          console.log(response.status)
          if (response.status) {
            setIsSubscribed(false);
            
          } else {
            console.log("trigger")
            toast.error("Error!", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
          }
        } catch (error) {
          toast.error(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }
        
      },
      onCancel() {
        
      },
    });
  }

    useEffect(() => {
        // Fetch user subscription status here
        const fetchSubscriptionStatus = async () => {
          try {
            // Replace this with your API call to fetch user subscription status
            const response = await getSubscription(user.vendor.vendor_id, "VENDOR");
    
            if (response.status) {
              const details = response.data;
              console.log(details)
              setSubscriptionDetails(response.data);
              if (details == "active") {
                setIsSubscribed(true);
              }
              
            } else {
              toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });
            }
          } catch (error) {
            toast.error(error, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            });
          }
        };
    
        fetchSubscriptionStatus();
      }, []);

      async function onClickSubmitSubscription(subscriptionFormDetails) {
        try {

          if (operation == "UPDATE") {
            console.log(subscriptionFormDetails)
            console.log(subscriptionDetails)
            const response = await updateSubscription(subscriptionDetails.subscription_id, subscriptionFormDetails.subscriptionType, subscriptionFormDetails.autoRenew);
            if (response.status) {
              console.log(response.data)
              setSubscriptionDetails(response.data);
            } else {
              toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });
            }
          } else if (operation == "RENEW") {
            
            const response = await renewSubscription(subscriptionDetails.subscription_id);
            console.log(response)
            if (response.status) {
              console.log(response.data)
              onClickCancelManageSubButton()
              setSubscriptionDetails(response.data);
            } else {
              toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });
            }

          } else if (operation == "SUBSCRIBE") {
            const response = await subscribe(user.vendor.vendor_id, "VENDOR", subscriptionFormDetails.subscriptionType, subscriptionFormDetails.autoRenew);
            if (response.status) {
              setIsSubscribed(true);
              setSubscriptionDetails(response.data);
            } else {
              toast.error(response.data.errorMessage, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              });
            }
          }
    
          setIsSubModalOpen(false);
    
    
        } catch (error) {
          toast.error(error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          });
        }
    
    
      }

      


      return (
        <div>
          {isSubscribed ? (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Title level={2}>Subscription Details</Title>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Subscription Plan">
                {subscriptionDetails.plan}
                </Descriptions.Item>
                <Descriptions.Item label="Subscription Expiry">
                {subscriptionDetails.current_period_end}
                </Descriptions.Item>
                <Descriptions.Item label="Next Billing Date">
                {subscriptionDetails.current_period_start}
                </Descriptions.Item>
                <Descriptions.Item label="Auto-renewal">
                {subscriptionDetails.autoRenewal ? 'Enabled' : 'Disabled'}
                {!subscriptionDetails.autoRenewal &&
                <CustomButton text="Renew Subscription" icon={<DashboardOutlined />} onClick={() => onClickManageSubButton("RENEW")} />
                }
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                <Badge status={subscriptionDetails.status === 'active' ? 'success' : 'error'} text={subscriptionDetails.status} />
                </Descriptions.Item>
            </Descriptions>
            <CustomButton text="Update Subscription" icon={<DashboardOutlined />} onClick={() => onClickManageSubButton("UPDATE")} />
           
            <Button type="primary" danger text="Unsubscribe" onClick={onClickCancelSubButton}>
                Unsubscribe
            </Button>

            {isSubModalOpen &&
              <SubscriptionModal
                operation={operation}
                isSubModalOpen={isSubModalOpen}
                onClickSubmitSubscription={onClickSubmitSubscription}
                onClickCancelManageSubButton={onClickCancelManageSubButton}
                subscriptionPlan={subscriptionDetails.plan}
                autoRenewal={subscriptionDetails.autoRenewal}
              />
            } 
            <ToastContainer />
          </div>   

          
     
          ) : (
    
            
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
              <p>Empower your business with data</p>
              <CustomButton text="Subscribe Now" icon={<DashboardOutlined />} onClick={() => onClickManageSubButton("SUBSCRIBE")} />
              {isSubModalOpen &&
              <SubscriptionModal
                operation={operation}
                isSubModalOpen={isSubModalOpen}
                onClickSubmitSubscription={onClickSubmitSubscription}
                onClickCancelManageSubButton={onClickCancelManageSubButton}
                subscriptionPlan={subscriptionDetails.plan}
                autoRenewal={subscriptionDetails.auto_renewal}
              />
            } 

            <ToastContainer />
              
            </div>
    
            
          )}
        </div>
      );


}