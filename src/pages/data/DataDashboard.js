import React, { useState, useEffect } from 'react';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter

import { Chart as ChartJS, LineController,LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend,TimeScale} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getData } from "../../redux/dataRedux";

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

  /* useEffect(() => {
    // Fetch user subscription status here
    const fetchSubscriptionStatus = async () => {
      try {
        // Replace this with your API call to fetch user subscription status
        const response = await fetch('/api/subscription-status');
        const data = await response.json();
        
        if (data.isSubscribed) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscriptionStatus();
  }, []); */

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

  /* const data = ; */

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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

  const aggregateDataByMonth = (data) => {
    const aggregatedData = new Map(); // Use a Map to store aggregated data by month
  
    // Loop through the data and aggregate by month
    data.forEach((item) => {
      const [date, count] = item;
      const monthKey = date.substr(0, 7); // Extract yyyy-MM part of the date
  
      if (aggregatedData.has(monthKey)) {
        // Increment the count for the existing month
        aggregatedData.set(monthKey, aggregatedData.get(monthKey) + count);
      } else {
        // Initialize the count for a new month
        aggregatedData.set(monthKey, count);
      }
    });
  
    // Convert the aggregated Map back to an array of [month, count] pairs
    const aggregatedArray = Array.from(aggregatedData, ([month, count]) => [month, count]);
  
    // Sort the array by month if needed
    aggregatedArray.sort((a, b) => a[0].localeCompare(b[0]));
  
    return aggregatedArray;
  };
  
  // Usage:
  const aggregatedData = aggregateDataByMonth(data);
  

  const lineData = {
    labels: aggregatedData.map(item => item[0]), // Convert dates to strings
    datasets: [
      {
        label: 'Number of Bookings',
        data: aggregatedData.map(item => item[1]),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  console.log(data)

  console.log(data.map(item => item[1]))

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'yyyy-MM',
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  

  return (
    <div>
      {isSubscribed ? (
        <div>
        <Dropdown menu={{
            items,
          }}>
          <Button>
            Choose an Option
          </Button>
        </Dropdown>
        <Line data={lineData} 
        options={chartOptions}/>
        </div>


          
 
      ) : (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
          <p>Empower your business with data</p>
          <Button type="primary">Subscribe Now</Button>
        </div>
      )}
    </div>
  );
};

export default DataDashboard;
