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

export const TotalBookingsTimeSeries = (props) => {
  const data = props.data


  const dataBreadCrumb = [
    {
      title: 'Dashboard',
    }
];

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
    responsive: true,
    maintainAspectRatio: false,
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
      <>
        <div style={styles.line}>
          <Line
              data={lineData}
              options={chartOptions}
          />
        </div>
      </>
  );
};


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
