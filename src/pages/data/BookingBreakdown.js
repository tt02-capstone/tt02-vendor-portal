import React, {useState, useEffect, useRef} from 'react';
import {Dropdown, Row, Col, Menu, Layout, Select, Typography} from 'antd';
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

export const BookingBreakdown = (props) => {
    const data = props.data
    const getRandomColors = (count) => {
        // Generate random colors for the chart
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
        }
        return colors;
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

    return (
        <>

            <div style={styles.container}>

                <br></br>

                <Row style={styles.content}>
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
                            <Col>
                                <div key={key} style={styles.line}>
                                    {/*<h3>{key}</h3>*/}
                                    <Pie data={pieData} options={getChartOptions(key)}/>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
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
        margin: '1vh 3vh 1vh 3vh',
        marginTop: -10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 0
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
        height: 450,
        width: 450,
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
