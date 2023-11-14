import React, {useState, useEffect , useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {DownOutlined, SmileOutlined, DashboardOutlined} from '@ant-design/icons';
import { Row, Col, Layout, Typography, Select, DatePicker} from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter
import SubscriptionModal from "./SubscriptionModal";
import ExportModal from './ExportModal.js';
import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import {Content} from "antd/es/layout/layout";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
import { RevenueToBooking } from './RevenueToBooking.js';

import {Bar, Line} from 'react-chartjs-2';
import {getData, subscribe, getSubscription, getSubscriptionStatus} from "../../redux/dataRedux";
import {set} from 'date-fns';
import {ToastContainer, toast} from 'react-toastify';
import {TotalBookingsTimeSeries} from "./TotalBookingsTimeSeries.js";
import {BookingBreakdown} from "./BookingBreakdown";
import {TotalRevenueTimeSeries} from "./TotalRevenueTimeSeries";
import moment from "moment";
import {RevenueBreakdown} from "./RevenueBreakdown";
import { CustomerRetention } from './CustomerRetention.js';

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
const BOOKING_REVENUE_RATIO = "Revenue to Bookings Ratio Over Time";
const BOOKINGS_BREAKDOWN = "Bookings Breakdown by Activity, Nationality, Age";
const REVENUE_BREAKDOWN = "Revenue Breakdown by Activity, Nationality, Age";
const CUSTOMER_RETENTION = "Customer Retention (Number of Repeat Bookings Over Time)";

const DataDashboard = () => {

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [data, setData] = useState([]);
    const [selectedDataUseCase, setSelectedDataUseCase] = useState(TOTAL_BOOKINGS_OVER_TIME); //REVENUE_OVER_TIME
    const chartRef = useRef(null);
    const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
    const [endDate, setEndDate] = useState( new Date(2023, 9, 31));
    const [loading, setLoading] = useState(true);


    const dataBreadCrumb = [
        {
            title: 'Dashboard',
        }
    ];
    //const [subscriptionDetails, setSubscriptionDetails] = useState(null);
    const [operation, setOperation] = useState("SUBSCRIBE");

    const navigate = useNavigate();

    const onClickViewSubButton = () => {
        setIsSubModalOpen(true);
        setOperation("VIEW");
    };

    // Subscription
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    function onClickCancelManageExportButton() {
        setIsExportModalOpen(false);
    }

    function onClickManageExportButton() {
        setIsExportModalOpen(true);
    }

    function onClickCancelManageSubButton() {
        setIsSubModalOpen(false);
    }

    function onClickManageSubButton() {
        setIsSubModalOpen(true);
    }

    function onClickUnsub() {
        setIsSubModalOpen(false);
        setIsSubscribed(false);
    }
    
  
  useEffect(() => {
    // Fetch user subscription status here
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace this with your API call to fetch user subscription status
        let user_id;

        let user_type;

        if (user.user_type == "VENDOR_STAFF") {
            user_type = "VENDOR"
            user_id = user.vendor.vendor_id;
        } else if (user.user_type == "LOCAL") {
            user_type = "LOCAL"
            user_id = user.user_id;
        }

        const response = await getSubscriptionStatus(user_id, user_type);
        if (response.status) {
          const status = response.data;
          console.log(status);
          
          if (status == "active") {
            setIsSubscribed(true);
            // Save to local user?
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

            let user_id;

        let user_type;

        if (user.user_type == "VENDOR_STAFF") {
            user_type = "VENDOR"
            user_id = user.vendor.vendor_id;
        } else if (user.user_type == "LOCAL") {
            user_type = "LOCAL"
            user_id = user.user_id;
        }

            const response = await subscribe(user_id, user_type, subscriptionDetails.subscriptionType, subscriptionDetails.autoRenew);
            if (response.status) {
                setIsSubscribed(true);
                setIsSubModalOpen(false);
                toast.success("Subscribed successfully", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                });
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

    async function onClickSubmitExport(exportDetails) {
        try {

            console.log(exportDetails);

            if (exportDetails.fileType == "pdf") {

                html2canvas(chartRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL("image/png");
                    const pdf = new jsPDF("landscape");
                    const chartAspectRatio = canvas.width / canvas.height;

                    // Dimensions of the PDF page
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                
                    // Aspect ratio of the PDF page
                    const pdfAspectRatio = pdfWidth / pdfHeight;
                
                    let imgWidth, imgHeight, x, y;
                
                    if (chartAspectRatio > pdfAspectRatio) {
                        // Chart is wider than PDF page
                        imgWidth = pdfWidth;
                        imgHeight = imgWidth / chartAspectRatio;
                        x = 0;
                        y = (pdfHeight - imgHeight) / 2; // Center vertically
                    } else {
                        // Chart is taller than PDF page
                        imgHeight = pdfHeight;
                        imgWidth = imgHeight * chartAspectRatio;
                        x = (pdfWidth - imgWidth) / 2; // Center horizontally
                        y = 0;
                    }
                
                    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
                    pdf.save(exportDetails.fileName + ".pdf");
                  });

            } else if (exportDetails.fileType == "csv") {
                

                if (selectedDataUseCase == TOTAL_BOOKINGS_OVER_TIME) {
                    const header = "Booking Date, Country of Origin";

                    const csv = data.map((row) => row.join(",")).join("\n");

                    const csvContent = header + "\n" + csv;

                    const blob = new Blob([csvContent], { type: "text/csv" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = `${exportDetails.fileName}.csv`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    
                } else if (selectedDataUseCase == REVENUE_OVER_TIME) {
                    const header = "Booking Date, Country of Origin, Revenue";

                    const csv = data.map((row) => row.join(",")).join("\n");

                    const csvContent = header + "\n" + csv;

                    const blob = new Blob([csvContent], { type: "text/csv" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = `${exportDetails.fileName}.csv`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    
                } else if (selectedDataUseCase == BOOKING_REVENUE_RATIO) {
                    const header = "Booking Date, Country of Tourist";

                    const csv = data.map((row) => row.join(",")).join("\n");

                    const csvContent = header + "\n" + csv;

                    const blob = new Blob([csvContent], { type: "text/csv" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = `${exportDetails.fileName}.csv`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    
                } else if (selectedDataUseCase == BOOKINGS_BREAKDOWN) {
                    try {
                        const headers = "Category, Country, Status\n";

                        const flattenDataForCSV = (data) => {
                            return data.flatMap(item => {
                                const rows = [];
                                Object.entries(item.Category).forEach(([categoryKey, categoryValue]) => {
                                    Object.entries(item.Country).forEach(([countryKey, countryValue]) => {
                                        Object.entries(item.Status).forEach(([statusKey, statusValue]) => {
                                            rows.push({
                                                Category: `${categoryKey}: ${categoryValue}`,
                                                Country: `${countryKey}: ${countryValue}`,
                                                Status: `${statusKey}: ${statusValue}`
                                            });
                                        });
                                    });
                                });
                                return rows;
                            });
                        };
                        
                        const flattenedData = flattenDataForCSV(data[0]);

                        const csvRows = flattenedData.map(row => `${row.Category}, ${row.Country}, ${row.Status}`);

                    const csvContent = headers + csvRows.join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = `${exportDetails.fileName}.csv`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    } catch (error) {
                        console.log(error)
                    }
                    


                    
                } else if (selectedDataUseCase == REVENUE_BREAKDOWN) {
                    try {
                        const headers = "Category, Country, Status\n";

                        const flattenDataForCSV = (data) => {
                            return data.flatMap(item => {
                                const rows = [];
                                Object.entries(item.Category).forEach(([categoryKey, categoryValue]) => {
                                    Object.entries(item.Country).forEach(([countryKey, countryValue]) => {
                                        Object.entries(item.Status).forEach(([statusKey, statusValue]) => {
                                            rows.push({
                                                Category: `${categoryKey}: ${categoryValue}`,
                                                Country: `${countryKey}: ${countryValue}`,
                                                Status: `${statusKey}: ${statusValue}`
                                            });
                                        });
                                    });
                                });
                                return rows;
                            });
                        };
                        
                        const flattenedData = flattenDataForCSV(data[0]);

                        const csvRows = flattenedData.map(row => `${row.Category}, ${row.Country}, ${row.Status}`);

                    const csvContent = headers + csvRows.join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = `${exportDetails.fileName}.csv`;

                    document.body.appendChild(a);
                    a.click();

                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    } catch (error) {
                        console.log(error)
                    }
                    

                    
                }


                

                



            } else if (exportDetails.fileType == "png") {
                html2canvas(chartRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL(`image/${exportDetails.fileType}`);
                    const a = document.createElement("a");
                    a.href = imgData;
                    a.download = `${exportDetails.fileName}.${exportDetails.fileType}`;
                    a.click();
                  });
            } else if (exportDetails.fileType == "jpeg") {
                html2canvas(chartRef.current).then((canvas) => {
                    const imgData = canvas.toDataURL(`image/${exportDetails.fileType}`);
                    const a = document.createElement("a");
                    a.href = imgData;
                    a.download = `${exportDetails.fileName}.${exportDetails.fileType}`;
                    a.click();
                  });

            }

            setIsExportModalOpen(false);


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
            if (isSubscribed) {
                try {

                    let dataUseCase = selectedDataUseCase
    
                    if (!dataUseCase) {
                      dataUseCase = TOTAL_BOOKINGS_OVER_TIME;
                      setSelectedDataUseCase(TOTAL_BOOKINGS_OVER_TIME);
                    }
    
                    // Replace this with your API call to fetch user subscription status
                    const response = await getData(dataUseCase, user.vendor.vendor_type ,user.vendor.vendor_id, startDate, endDate);
                    if (response.status) {
                        console.log(response.data)
                        setData(response.data)
                        setLoading(false)
    
                    } else {
                        console.log("Wat");
                        setLoading(false)
                    }
    
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            
        };

        callGetData();
    }, [selectedDataUseCase, startDate, endDate, isSubscribed]);


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
            label: BOOKING_REVENUE_RATIO,
            value: BOOKING_REVENUE_RATIO
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
        setLoading(true)
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedDataUseCase(value.value)
    };
    // Usage:

    function onCalendarChange(dates) {
        console.log("onCalendarChange", dates);
        if (dates === null) {
            setStartDate(new Date(2023, 0, 1));
            setEndDate(new Date(2023, 9, 31));
            return
        }

        if (dates[0] !== null) {
            const start_time = moment(dates[0].$d);
            setStartDate(new Date(start_time))
        }

        if (dates[1] !== null) {
            const end_time = moment(dates[1].$d)
            setEndDate(new Date(end_time))
        }
    }
    const returnChart = () => {
        if(selectedDataUseCase === TOTAL_BOOKINGS_OVER_TIME) {
            return  <TotalBookingsTimeSeries chartRef={chartRef} data={data}/>
        } else if (selectedDataUseCase === REVENUE_OVER_TIME) {
            return <TotalRevenueTimeSeries chartRef={chartRef} data={data}/>
        } else if (selectedDataUseCase === BOOKING_REVENUE_RATIO) {
            return <RevenueToBooking chartRef={chartRef} data={data}/>
        } else if (selectedDataUseCase === BOOKINGS_BREAKDOWN) {
            return <BookingBreakdown data={data[0][0]} />
        } else if (selectedDataUseCase === REVENUE_BREAKDOWN) {
            return <RevenueBreakdown data={data[0][0]} />
        } else if (selectedDataUseCase === CUSTOMER_RETENTION) {
            return <CustomerRetention chartRef={chartRef} data={data}/>
        }

    }

    return (
        <Layout style={styles.layout}>
            <CustomHeader items={dataBreadCrumb}/>
            <Content style={styles.content}>
                <div>
                    {isSubscribed ? (
                        <div>
                            <Row justify="space-between" style={{ marginRight: 50, marginTop: 20 }}>
                                <Col>
                                    <div style={styles.container}>
                                        <Typography.Title level={5} style={{ marginRight: 5}}>Chart Type : </Typography.Title>
                                        <Select
                                            labelInValue
                                            defaultValue={items[0]}
                                            style={{ width: 400 }}
                                            onChange={handleChangeDataUseCase}
                                            options={items}
                                        />
                                    </div>
                                </Col>
                                <Col style={{ marginLeft: 'auto', marginRight: 16 }}>
                                    <CustomButton text="Export Data" icon={<DashboardOutlined />} onClick={onClickManageExportButton} />
                                </Col>
                                <Col>
                                    <CustomButton text="Manage Subscription" icon={<DashboardOutlined />} onClick={onClickViewSubButton} />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 50, marginTop: 10}}>
                            {isExportModalOpen &&
                                <ExportModal
                                    isExportModalOpen={isExportModalOpen}
                                    onClickSubmitExport={onClickSubmitExport}
                                    onClickCancelManageExportButton={onClickCancelManageExportButton}
                                />
                            }

                                <Col>
                                    <div style={styles.container}>
                                        <Typography.Title level={5} style={{ marginRight: 5}} >Date Range : </Typography.Title>
                                        <RangePicker
                                            format="YYYY-MM-DD"
                                            onCalendarChange={onCalendarChange}
                                            // defaultValue={[moment('2023-01-01', 'YYYY-MM-DD'),moment('2023-01-15', 'YYYY-MM-DD')]}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            {/*<div style={{ backgroundColor: '#ffc069', padding: '30px' }}>*/}
                                {loading? null: returnChart()}
                            {/*</div>*/}

                            {isSubModalOpen &&
                                <SubscriptionModal
                                    operation={operation}
                                    isSubModalOpen={isSubModalOpen}
                                    onClickSubmitSubscription={onClickSubmitSubscription}
                                    onClickCancelManageSubButton={onClickCancelManageSubButton}
                                    onClickUnsub={onClickUnsub}
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
