import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {DownOutlined, SmileOutlined, DashboardOutlined} from '@ant-design/icons';
import {Dropdown, Button, Menu, Layout, Typography, Select, DatePicker} from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import SubscriptionModal from "./SubscriptionModal";
import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import {Content} from "antd/es/layout/layout";

import {
    Chart as ChartJS,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    TimeScale
} from 'chart.js';
import {Bar, Line} from 'react-chartjs-2';
import {getData, subscribe, getSubscription, getSubscriptionStatus} from "../../redux/dataRedux";
import {set} from 'date-fns';
import {ToastContainer, toast} from 'react-toastify';
import {TotalBookingsTimeSeries} from "./TotalBookingsTimeSeries.js";
import {BookingBreakdown} from "./BookingBreakdown";
import {TotalRevenueTimeSeries} from "./TotalRevenueTimeSeries";
import {disabledDateChecker} from "../../helper/dateFormat";

const { RangePicker } = DatePicker;

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

const TOTAL_BOOKINGS_OVER_TIME = "Total Bookings Over Time";
const REVENUE_OVER_TIME = "Revenue Over Time";
const BOOKINGS_BREAKDOWN = "Bookings Breakdown by Activity, Nationality, Age";
const REVENUE_BREAKDOWN = "Revenue Breakdown by Activity, Nationality, Age";
const CUSTOMER_RETENTION = "Customer Retention (Number of Repeat Bookings Over Time)";

const DataDashboard = () => {

    const [isSubscribed, setIsSubscribed] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [data, setData] = useState([]);
    const [selectedDataUseCase, setSelectedDataUseCase] = useState(TOTAL_BOOKINGS_OVER_TIME);

    const dataBreadCrumb = [
        {
            title: 'Dashboard',
        }
    ];
    //const [subscriptionDetails, setSubscriptionDetails] = useState(null);
    const [operation, setOperation] = useState("SUBSCRIBE");

    const navigate = useNavigate();

    const onClickViewSubButton = () => {
        navigate('/datadashboard/subscription'); 
    };

    // Subscription
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);

    function onClickCancelManageSubButton() {
        setIsSubModalOpen(false);
    }

    function onClickManageSubButton() {
        setIsSubModalOpen(true);
    }
    
  
  useEffect(() => {
    // Fetch user subscription status here
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace this with your API call to fetch user subscription status
        const response = await getSubscriptionStatus(user.vendor.vendor_id, "VENDOR");

        if (response.status) {
          const subscribed = response.data;
          
          if (subscribed) {
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

                let dataUseCase = selectedDataUseCase
                console.log(dataUseCase)

                if (!dataUseCase) {
                  dataUseCase = TOTAL_BOOKINGS_OVER_TIME;
                  setSelectedDataUseCase(TOTAL_BOOKINGS_OVER_TIME);
                }


                const start_date =  new Date(2023, 0, 1)
                const end_date = new Date(2023, 9, 31)

                console.log(dataUseCase)
                // Replace this with your API call to fetch user subscription status
                const response = await getData(dataUseCase, user.vendor.vendor_type ,user.vendor.vendor_id, start_date, end_date);
                if (response.status) {
                    console.log(response.data)
                    setData(response.data)

                } else {
                    console.log("Wat");

                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        callGetData();
    }, [selectedDataUseCase]);


    const items = [
        {
            label: TOTAL_BOOKINGS_OVER_TIME,
            value: TOTAL_BOOKINGS_OVER_TIME
        },

        {
            label: REVENUE_OVER_TIME,
            value: REVENUE_OVER_TIME

        },
        {
            label: REVENUE_BREAKDOWN,
            value: REVENUE_BREAKDOWN

        },
        {
            label: BOOKINGS_BREAKDOWN,
            value: BOOKINGS_BREAKDOWN

        },

        {
          label: CUSTOMER_RETENTION,
          value: CUSTOMER_RETENTION

      },

    ];

    const handleChangeDataUseCase = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedDataUseCase(value.value)
    };
    // Usage:

    function onCalendarChange(dates) {
        console.log("onCalendarChange", dates);
    }
    const returnChart = () => {
        if(selectedDataUseCase === TOTAL_BOOKINGS_OVER_TIME) {
            return  <TotalBookingsTimeSeries data={data}/>
        } else if (selectedDataUseCase === REVENUE_OVER_TIME) {
           return  <TotalRevenueTimeSeries data={data}/>
        } else if (selectedDataUseCase === BOOKINGS_BREAKDOWN) {
            return <BookingBreakdown data={data} />
        }

    }

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={dataBreadCrumb}/>
            <Content style={styles.content}>
                <div>
                    {isSubscribed ? (
                        <div>
                            <CustomButton style= {{margin: '10px'}}text="Manage Subscription" icon={<DashboardOutlined/>} onClick={onClickViewSubButton}/>

                            <div style={styles.container}>
                                <Typography.Title level={5} style={{marginRight: '10px'}}>Chart Type: </Typography.Title>
                                <Select
                                    labelInValue
                                    defaultValue={items[0]}
                                    style={{width: 400}}
                                    onChange={handleChangeDataUseCase}
                                    options={items}
                                />
                            </div>

                            {/*<RangePicker*/}
                            {/*    format="YYYY-MM-DD"*/}
                            {/*    onCalendarChange={onCalendarChange}*/}
                            {/*/>*/}

                            <br></br>
                            <br></br>
                            {returnChart()}
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
                            <CustomButton text="Subscribe Now" icon={<DashboardOutlined/>}
                                          onClick={onClickManageSubButton}/>

                            {isSubModalOpen &&
                                <SubscriptionModal
                                    operation={operation}
                                    isSubModalOpen={isSubModalOpen}
                                    onClickSubmitSubscription={onClickSubmitSubscription}
                                    onClickCancelManageSubButton={onClickCancelManageSubButton}
                                />
                            }
                            <ToastContainer />
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
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    line: {
        position: 'relative',
        margin: 'auto',
        maxWidth: '80vw',
        height: '300px',
        width: '100%'
    }
}
