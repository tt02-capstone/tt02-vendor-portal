import React, {useState, useEffect, useRef} from 'react';
import {Dropdown, Button, Menu, Layout, Select, Typography} from 'antd';
import 'chartjs-adapter-date-fns'; // Import the date adapter

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
    TimeScale,
    ArcElement
} from 'chart.js';
import {Bar, Line, Pie} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    LineController,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const NATIONALITY = 'Nationality';
const AGE = 'Age';
const STATUS = 'Status';
const ACTIVITY = "Activity";
export const BookingBreakdown = (props) => {
    const data = props.data
    const [selectedItem, setSelectedItem] = useState(NATIONALITY);
    const chartRef = useRef(null);


    const itemsDropdown = [
        {
            value: NATIONALITY,
            label: NATIONALITY,
        },
        {
            value: AGE,
            label: AGE,
        },
        {
            value: STATUS,
            label: STATUS,
        },
        {
            value: ACTIVITY,
            label: ACTIVITY,
        },

    ];

    const aggregateDatafromDropdown = (data) => {
        console.log(data)
        const d = {
            Status: {COMPLETED: 89},
            Category: {DELUXE_SUITE: 89},
            Country: {China: 23, Malaysia: 13, Australia: 16, Indonesia: 19, India: 18}
        }

        let aggregatedData = new Map(); // Use a Map to store aggregated data by month

        if (selectedItem === NATIONALITY) {
            aggregatedData = d.Country
        } else if (selectedItem === STATUS) {
            aggregatedData = d.Status
        } else if (selectedItem === ACTIVITY) {
            aggregatedData = d.Category
        }

        return aggregatedData
    };

    const aggregatedData = aggregateDatafromDropdown(data);

    const pieData = {
        labels: Object.keys(aggregatedData),
        datasets: [
            {
                data: Object.values(aggregatedData),
                backgroundColor: [
                    'red',
                    'green',
                    'blue',
                    'orange',
                    'purple',
                    // Add more colors as needed
                ],
            },
        ],
    };

    console.log(data)

    console.log(data.map(item => item[1]))

    const defaultChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Breakdown by ${selectedItem}`,
            },
        },
    };
    //
    // const getChartOptions = () => {
    //     const chartOptions = {
    //         ...defaultChartOptions, // Start with the default options
    //     };
    //
    //     // Adjust time unit-specific settings
    //     if (selectedXAxis === WEEKLY) {
    //         chartOptions.scales.x.time.unit = 'week';
    //     } else if (selectedXAxis === YEARLY) {
    //         chartOptions.scales.x.time.unit = 'year';
    //     } else if (selectedXAxis === MONTHLY) {
    //         chartOptions.scales.x.time.unit = 'month';
    //     }
    //
    //     return chartOptions;
    // };

    const handleChangeDropdown = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedItem(value.value)

        // Destroy the previous chart
        // if (chartRef.current) {
        //     chartRef.current.chartInstance.destroy();
        // }
    };


    return (
        <>

            <div style={styles.container}>
                <Typography.Title level={5} style={{marginRight: '10px'}}>Breakdown by: </Typography.Title>
                <Select
                    labelInValue
                    defaultValue={itemsDropdown[0]}
                    style={{width: 120}}
                    onChange={handleChangeDropdown}
                    options={itemsDropdown}
                />

            </div>
            <br></br>

            <div style={styles.line}>
                <Pie
                    ref={chartRef}
                    data={pieData}
                    options={defaultChartOptions}
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
    container: {
        display: 'flex',
        alignItems: 'center'
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
