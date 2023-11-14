import React, {useState, useRef, useEffect} from 'react';
import {Dropdown, Button, Menu, Layout, Select, Typography, Table, Row, Col} from 'antd';
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
    TimeScale
} from 'chart.js';
import {Bar, Line} from 'react-chartjs-2';
import moment from "moment";


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

const WEEKLY = 'Week';
const YEARLY = 'Year';
const MONTHLY = 'Month';
const TOTAL_REVENUE = "Total Revenue";
const TOTAL_REVENUE_LOCAL = "Total Revenue from Local";
const TOTAL_REVENUE_TOURIST = "Total Revenue from  Tourist";
const TOTAL_REVENUE_BY_COUNTRY = "Total Revenue from  Country";


export const RevenueToBooking = (props) => {
    const chartRef = props.chartRef;
    const data = props.data
    const [selectedXAxis, setSelectedXAxis] = useState(MONTHLY);
    const [selectedYAxis, setSelectedYAxis] = useState(TOTAL_REVENUE);
    const [yData, setYData] = useState([]);


    const itemsXAxis = [
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

    const itemsYAxis = [
        {
            value: TOTAL_REVENUE,
            label: TOTAL_REVENUE,
        },
        {
            value: TOTAL_REVENUE_LOCAL,
            label: TOTAL_REVENUE_LOCAL,
        },
        {
            value: TOTAL_REVENUE_TOURIST,
            label: TOTAL_REVENUE_TOURIST,
        },
        {
            value: TOTAL_REVENUE_BY_COUNTRY,
            label: TOTAL_REVENUE_BY_COUNTRY,
        },

    ];

    const getRandomColor = (index) => {

        const colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 0, 0, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 0, 255, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(128, 0, 0, 1)',
            'rgba(0, 128, 0, 1)',
            'rgba(0, 0, 128, 1)',
        ];
        console.log(index)
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[index];
    };


    const aggregateDatafromDropdown = (data) => {
        const aggregatedData = new Map(); // Use a Map to store aggregated data by date

        // Loop through the data and aggregate by date
        data.forEach((item) => {
            const [date, country, revenue] = item; // ["2023-05-17", "CountryName"]
            let xAxisKey;
            if (selectedXAxis === MONTHLY) {
                xAxisKey = date.substr(0, 7); // Extract yyyy-MM part of the date
            } else if (selectedXAxis === YEARLY) {
                xAxisKey = date.substr(0, 4); // Extract yyyy part of the date
            } else if (selectedXAxis === WEEKLY) {
                const currdate = moment(date)
                xAxisKey = currdate.clone().startOf('week').format('YYYY-MM-DD').toString()
                // console.log(xAxisKey)
            }

            if (!aggregatedData.has(xAxisKey)) {
                // Initialize data for the date
                aggregatedData.set(xAxisKey, {Date: xAxisKey, Revenue: 0, Count: 0, Countries: {}});
            }

            // Increment the count for the date
            aggregatedData.get(xAxisKey).Revenue += parseFloat(revenue);
            aggregatedData.get(xAxisKey).Count++;

            // Increment the count for the country within the date
            if (!aggregatedData.get(xAxisKey).Countries[country]) {
                aggregatedData.get(xAxisKey).Countries[country] = {Count: 1, Revenue: parseFloat(revenue)};
            } else {
                aggregatedData.get(xAxisKey).Countries[country].Count++;
                aggregatedData.get(xAxisKey).Countries[country].Revenue += parseFloat(revenue);
            }
        });

        console.log(Array.from(aggregatedData.values()))

        //console.log(Array.from(aggregatedData.values()).map((value) => []))

        // Convert the aggregated Map back to an array of lists
        // const aggregatedArray = Array.from(aggregatedData.values()).map((value) => [
        //   value.Date,
        //   value.Count,
        //   value.Revenue,
        //   Object.entries(value.Countries).map(([country, count]) => [country, count]),
        // ]);

        //console.log(aggregatedArray);

        return Array.from(aggregatedData.values());
    };


    // Usage:
    console.log(data)
    const aggregatedData = aggregateDatafromDropdown(data);
    console.log(aggregatedData)
    console.log(aggregatedData.map(item => item.Revenue))
    let dataset = [];

    //const uniqueCountries = [...new Set(aggregatedData.flatMap((item) => item[2].map(([country]) => country)))];
    const uniqueCountries = [...new Set(data.map((item) => item[1]))];
    console.log(uniqueCountries);
    if (selectedYAxis === TOTAL_REVENUE) {
        dataset = [
            {
                label: 'Total Revenue',
                data: aggregatedData.map(item => item.Revenue / item.Count),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                backgroundColor:'rgba(75, 192, 192, 1)',
            },
        ];
    } else if (selectedYAxis === TOTAL_REVENUE_LOCAL) {
        dataset = [
            {
                label: `Total Revenue from Local`,
                data: aggregatedData.map((item) => {
                    if (item.Countries && item.Countries.Singapore) {

                        return item.Countries.Singapore.Revenue / item.Countries.Singapore.Count || 0; // Use 0 if Revenue is null or undefined
                    } else {
                        return 0; // Handle the case where item.Countries.Singapore is null or undefined
                    }
                }),
                borderColor: getRandomColor(0), // You can assign a specific color for Local bookings
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(0),
            },
        ];
    } else if (selectedYAxis === TOTAL_REVENUE_TOURIST) {
        dataset = [
            {
                label: `Total Revenue from Tourist`,
                data: aggregatedData.map((item) => {
                    if (item.Countries && item.Countries.Singapore) {
                        const touristRevenue = item.Revenue - (item.Countries.Singapore.Revenue || 0);
                        const touristCount = item.Count - (item.Countries.Singapore.Count || 0);

                        return touristRevenue / touristCount; // Use 0 if Revenue is null or undefined
                    } else {
                        return item.Revenue / item.Count; // Handle the case where item.Countries.Singapore is null or undefined
                    }
                }),
                borderColor: getRandomColor(0), // You can assign a specific color for Tourist bookings
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(0),
            },
        ];
    } else if (selectedYAxis === TOTAL_REVENUE_BY_COUNTRY) {
        dataset = uniqueCountries.map((country) => {
            return {
                label: `Total Revenue in ${country}`,
                data: aggregatedData.map((item) => {
                    const countryData = item.Countries[country];
                    return countryData ? countryData.Revenue / countryData.Count : 0;
                }),
                borderColor: getRandomColor(uniqueCountries.indexOf(country)),
                borderWidth: 1,
                fill: false,
                backgroundColor: getRandomColor(uniqueCountries.indexOf(country)),
            };
        });
    }


    const lineData = {
        labels: aggregatedData.map((item) => item.Date), // Convert dates to strings
        datasets: dataset,
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
                        week: 'yyyy-MM-dd', // Adjust the format for weeks
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
        } else if (selectedXAxis === MONTHLY) {
            chartOptions.scales.x.time.unit = 'month';
        }

        return chartOptions;
    };

    const handleChangeXAxis = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedXAxis(value.value)
    };

    const handleChangeYAxis = (value) => {
        console.log(value); // { value: "lucy", label: "Lucy (101)" }
        setSelectedYAxis(value.value)
        updateYaxisDropdown(value.value)
    };

    useEffect(() => {
        updateYaxisDropdown();
    }, []);

    const updateYaxisDropdown = (yaxis) => {
        console.log("In y axis", yaxis)
        let newData = []
        newData = aggregatedData
        if (yaxis === TOTAL_REVENUE) {
            newData = aggregatedData
        } else if (yaxis === TOTAL_REVENUE_LOCAL) {
            newData = aggregatedData.filter(item => {
                console.log(item)
                const countries = Object.keys(item.Countries);
                return countries.includes("Singapore");
            });
            console.log(newData)

        } else if (yaxis === TOTAL_REVENUE_TOURIST) {
            newData = aggregatedData.filter(item => {
                const countries = Object.keys(item.Countries);
                return !countries.includes("Singapore");
            });
        } else if (yaxis === TOTAL_REVENUE_BY_COUNTRY) {
            newData = aggregatedData
        }

        setYData(newData)

    }

    useEffect(() => {
        const chart = chartRef.current;

        console.log(chart)

    }, []);


    const expandedRowRender = (record) => {
        const nestedColumns = [
            {
                title: 'Country',
                dataIndex: 'country',
                key: 'country',
            },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
            },
            {
                title: 'Number of Bookings',
                dataIndex: 'count',
                key: 'count',
            },
        ];

        const mappedCountries = Object.entries(record.Countries).map(([country, data], index) => ({
            key: index,
            country,
            count: data.Count,
            revenue: data.Revenue,
        }));

        return (
            <Table
                columns={nestedColumns}
                dataSource={mappedCountries}
                pagination={false}
                size="small"
            />
        );
    };

    const columns = [
        {
            title: selectedXAxis,
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: selectedYAxis === TOTAL_REVENUE_BY_COUNTRY? TOTAL_REVENUE: selectedYAxis,
            dataIndex: 'Revenue',
            key: 'Revenue',
        },
        {
            title: 'Number of Bookings',
            dataIndex: 'Count',
            key: 'Count',
        },
        {
            title: 'Revenue to Booking Ratio',
            dataIndex: 'Ratio',
            key: 'Ratio',
        },
    ];

    const tableData = yData.map(({Date, Revenue, Count, Countries}, index) => ({
        key: index,
        Date,
        Revenue,
        Count,
        Countries,
        Ratio: (Revenue / Count).toFixed(2)
    }));


    return (
        <>

            <Row style={{marginRight: 50}}>
                <Col style={{marginLeft: 'auto', marginRight: 16}}>
                    <div style={styles.container}>
                        <Typography.Title level={5} style={{marginRight: '10px'}}>X Axis: </Typography.Title>
                        <Select
                            labelInValue
                            defaultValue={itemsXAxis[0]}
                            style={{width: 120}}
                            onChange={handleChangeXAxis}
                            options={itemsXAxis}
                        />

                    </div>
                </Col>
                <Col>
                    <div style={styles.container}>
                        <Typography.Title level={5} style={{marginRight: '10px'}}>Y Axis: </Typography.Title>
                        <Select
                            labelInValue
                            defaultValue={itemsYAxis[0]}
                            style={{width: 300}}
                            onChange={handleChangeYAxis}
                            options={itemsYAxis}
                        />
                    </div>
                </Col>

            </Row>

            <br></br>


            <div ref={chartRef} style={styles.line}>
                <Line

                    data={lineData}
                    options={getChartOptions()}
                />
            </div>

            <br></br>
            <Row style={{marginLeft: 30, marginTop: 20, width: '100%'}}>
                <Table dataSource={tableData} columns={columns} bordered
                       style={{
                           width: '90%',
                       }}
                       expandable={{expandedRowRender}}
                       className="ant-table ant-table-bordered ant-table-striped"
                />
            </Row>
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
