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
    const data = {
        Status: {Completed: 89, Cancelled: 20, Upcoming: 35 , Ongoing: 50},
        Category: {DeluxeSuite: 89, JuniorSuite: 20, Double: 20, Standard: 30},
        Country: {China: 23, Malaysia: 13, Australia: 16, Indonesia: 19, India: 18}
    }
    // const data = props.data
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

    // const pieData = {
    //     labels: Object.keys(aggregatedData),
    //     datasets: [
    //         {
    //             data: Object.values(aggregatedData),
    //             backgroundColor: [
    //                 'red',
    //                 'green',
    //                 'blue',
    //                 'orange',
    //                 'purple',
    //                 // Add more colors as needed
    //             ],
    //         },
    //     ],
    // };

    const getRandomColors = (count) => {
        // Generate random colors for the chart
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        return colors;
    };
    console.log(data)
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
                position: 'bottom'
            },
        },
    };

    const getChartOptions = (key) => {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Breakdown by ${key}`,
                    position: 'bottom'
                },
            },
        };

        return chartOptions;
    };

    const handleChangeDropdown = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedItem(value.value)

        // Destroy the previous chart
        // if (chartRef.current) {
        //     chartRef.current.chartInstance.destroy();
        // }
    };

    const renderCharts = () => {
        Object.keys(data).map(key => {
            console.log(key)
        });
    };


    return (
        <>

            <div style={styles.container}>
                {/*<Typography.Title level={5} style={{marginRight: '10px'}}>Breakdown by: </Typography.Title>*/}
                {/*<Select*/}
                {/*    labelInValue*/}
                {/*    defaultValue={itemsDropdown[0]}*/}
                {/*    style={{width: 120}}*/}
                {/*    onChange={handleChangeDropdown}*/}
                {/*    options={itemsDropdown}*/}
                {/*/>*/}

            </div>
            <br></br>

            <div style={styles.content}>
                {Object.keys(data).map((key) => {
                    const labels = Object.keys(data[key]);
                    const values = Object.values(data[key]);

                    const pieData = {
                        labels,
                        datasets: [
                            {
                                data: values,
                                backgroundColor: getRandomColors(values.length),
                            },
                        ],
                    };

                    return (
                        <div key={key} style={styles.line}>
                            {/*<h3>{key}</h3>*/}
                            <Pie data={pieData} options={getChartOptions(key)} />
                        </div>
                    );
                })}
            </div>
            </>
    );
};

const styles = {
    layout: {
        minHeight: '100vh',
        minWidth: '90vw',
        backgroundColor: 'white',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 'calc(50% - 20px)', // Set each chart to take 50% width with spacing
        margin: '1vh 3vh 1vh 3vh',
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0 20px', // Increase the margin to add spacing between charts
    },
    chart: {
        flex: 1,
        margin: '0 20px', // Increase the margin to add spacing between charts

    },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Creates a 2x2 grid
        gap: '20px', // Adjust the gap as needed for spacing
    }
};
