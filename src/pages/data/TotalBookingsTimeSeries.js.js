import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, SmileOutlined, DashboardOutlined } from '@ant-design/icons';
import {Dropdown, Button, Menu, Layout, Select} from 'antd';
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

const WEEKLY = 'weekly';
const YEARLY = 'yearly';
const MONTHLY = 'monthly';

export const TotalBookingsTimeSeries = (props) => {
  const data = props.data
  const [selectedXAxis, setSelectedXAxis] = useState(YEARLY);

  const dataBreadCrumb = [
    {
      title: 'Dashboard',
    }
];

  const items = [
    {
      value: MONTHLY,
      label: 'Monthly',
    },
    {
      value: WEEKLY,
      label: 'Weekly',
    },
    {
      value: YEARLY,
      label: 'Yearly',
    },

  ];


  const aggregateDatafromDropdown = (data) => {
    const aggregatedData = new Map(); // Use a Map to store aggregated data by month

    // Loop through the data and aggregate by month
    data.forEach((item) => {
      const [date, count] = item; //    ["2023-05-17", 1]
      let xAxisKey;
      if(selectedXAxis === MONTHLY) {
         xAxisKey = date.substr(0, 7); // Extract yyyy-MM part of the date
      } else if (selectedXAxis === YEARLY) {
        xAxisKey = date.substr(0, 4); // Extract yyyy-MM part of the date
        console.log(xAxisKey)
      }


      if (aggregatedData.has(xAxisKey)) {
        // Increment the count for the existing month
        aggregatedData.set(xAxisKey, aggregatedData.get(xAxisKey) + count);
      } else {
        // Initialize the count for a new month
        aggregatedData.set(xAxisKey, count);
      }
    });
  
    // Convert the aggregated Map back to an array of [month, count] pairs
    const aggregatedArray = Array.from(aggregatedData, ([month, count]) => [month, count]);
  
    // Sort the array by month if needed
    aggregatedArray.sort((a, b) => a[0].localeCompare(b[0]));
  
    return aggregatedArray;
  };
  
  // Usage:
  const aggregatedData = aggregateDatafromDropdown(data);
  

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

  const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'yyyy-MM',
            week: 'YYYY [W]WW', // Adjust the format for weeks
            year: 'yyyy',
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const getChartOptions = () => {
    const chartOptions = {
      ...defaultChartOptions, // Start with the default options
    };

    // Adjust time unit-specific settings
    if (selectedXAxis === WEEKLY) {
      chartOptions.scales.x.time.unit = 'week';
    } else if (selectedXAxis === YEARLY) {
      chartOptions.scales.x.time.unit = 'year';
    } else if (selectedXAxis === MONTHLY)   {
      chartOptions.scales.x.time.unit = 'month';
    }

    return chartOptions;
  };

  const handleChange = (value) => {
    console.log(value); // { value: "lucy", label: "Lucy (101)" }
    setSelectedXAxis(value.value)
  };


  return (
      <>

        <Select
              labelInValue
              defaultValue={items[0]}
              style={{ width: 120 }}
              onChange={handleChange}
              options={items}
          />


        <div style={styles.line}>
          <Line
              data={lineData}
              options={getChartOptions()}
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
