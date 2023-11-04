import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SmileOutlined, DashboardOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu, Layout } from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import SubscriptionModal from "./SubscriptionModal";
import CustomButton from "../../components/CustomButton";import CustomHeader from "../../components/CustomHeader";
import { Content } from "antd/es/layout/layout";

import { Chart as ChartJS, LineController,LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend,TimeScale} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getData, subscribe, getSubscription, getSubscriptionStatus } from "../../redux/dataRedux";
import { set } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import {TotalBookingsTimeSeries} from "./TotalBookingsTimeSeries.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  LineController,
  Title,
  Tooltip,
  Legend
);

const DataDashboard = () => {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [data, setData] = useState([]);

  const dataBreadCrumb = [
    {
      title: 'Dashboard',
    }
];
  //const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [operation, setOperation] = useState("SUBSCRIBE");

  const navigate = useNavigate();

  const onClickViewSubButton = () => {
    navigate('/datadashboard/subscription'); // Replace with your route
  };

  // Subscription 
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  function onClickCancelManageSubButton() {
    setIsSubModalOpen(false);
  }

  function onClickManageSubButton() {
    setIsSubModalOpen(true);
  }


  // useEffect(() => {
  //   // Fetch user subscription status here
  //   const fetchSubscriptionStatus = async () => {
  //     try {
  //       // Replace this with your API call to fetch user subscription status
  //       const response = await getSubscriptionStatus(user.vendor.vendor_id, "VENDOR");

  //       if (response.status) {
  //         const subscribed = response.data;
          
  //         if (subscribed) {
  //           setIsSubscribed(true);
  //         }
          
  //       } else {
  //         toast.error(response.data.errorMessage, {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1500
  //         });
  //       }
  //     } catch (error) {
  //       toast.error(error, {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1500
  //       });
  //     }
  //   };

  //   fetchSubscriptionStatus();
  // }, []);

  async function onClickSubmitSubscription(subscriptionDetails) {
    try {

      const response = await subscribe(user.vendor.vendor_id, "VENDOR", subscriptionDetails.subscriptionType, subscriptionDetails.autoRenew);
      if (response.status) {
        setIsSubscribed(true);
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


  }

  useEffect(() => {
    // Fetch user subscription status here
    const callGetData = async () => {
      try {
        // Replace this with your API call to fetch user subscription status
        const response = await getData('3');
        if (response.status) {
          
          setData(response.data)

      } else {
          console.log("Wat");
          
      }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    callGetData();
  }, []);


  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item (disabled)
        </a>
      ),
      icon: <SmileOutlined />,
      disabled: true,
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: '4',
      danger: true,
      label: 'a danger item',
    },
  ];
  
  // Usage:

  return (
    <Layout style={styles.layout}>
        <CustomHeader items={dataBreadCrumb} />
        <Content style={styles.content}>
          <div>
            {isSubscribed ? (
              <div>
                <Dropdown menu={{
                    items,
                  }}>
                <Button> Choose an Option </Button>
                </Dropdown>
                <CustomButton text="Manage Subscription" icon={<DashboardOutlined />} onClick={onClickViewSubButton} />
                <TotalBookingsTimeSeries data={data} />

              </div>
          ) : (
        <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>

            <p>Empower your business with data</p>
            <CustomButton text="Subscribe Now" icon={<DashboardOutlined />} onClick={onClickManageSubButton} />

            {isSubModalOpen &&
            <SubscriptionModal
              operation={operation}
              isSubModalOpen={isSubModalOpen}
              onClickSubmitSubscription={onClickSubmitSubscription}
              onClickCancelManageSubButton={onClickCancelManageSubButton}
            />
          } 
        </div>
      )}    
        </div>
        </Content>
      </Layout>
  );
};

export default DataDashboard;

const styles = {
  layout: {
      minHeight: '100vh',
      minWidth: '90vw',
      backgroundColor: 'white'
  },
  content: {
      margin: '1vh 3vh 1vh 3vh',
      marginTop: -10, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginLeft: 57,
  },
  line: {
      position: 'relative',
      margin: 'auto',
      maxWidth: '80vw',
      height: '300px',
      width: '100%'
  }
}
