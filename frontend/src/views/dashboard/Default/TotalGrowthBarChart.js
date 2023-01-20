import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import ReportDataService from '../../../services/report';
import { useAuth } from '../../../authContext';

// chart data
import chartData from './chart-data/total-growth-bar-chart';



// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading, rerenderTransaktions }) => {
    const [value, setValue] = useState('today');
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const { navType } = customization;
    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.primary[200];
    const primaryDark = theme.palette.primary.dark;
    const secondaryMain = theme.palette.secondary.main;
    const secondaryLight = theme.palette.secondary.light;


    const [expenseArray, setExpenseArray] = useState([2]);
    const [incomeArray, setIncomeeArray] = useState([2]);//change this in production
    const [weekNumberArray, setWeekNumberArray] = useState([]);
    const { tokenState } = useAuth();

    useEffect(() => {
        ReportDataService.getReportOneWeek(tokenState)
            .then((response) => {
                    setExpenseArray([]);
                    setIncomeeArray([]);
                    response.data.data.forEach(oneWeek => {
                        setExpenseArray(expenseArray =>[...expenseArray,oneWeek.expense.total])
                        setIncomeeArray(incomeArray =>[...incomeArray,oneWeek.income.total])
                        var comparisonTime = Date.parse(oneWeek.end);
                        var dateObject = new Date(comparisonTime);
                        var oneJan = new Date(dateObject.getFullYear(),0,1);
                        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
                        var result = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
                        setWeekNumberArray(weekNumberArray =>[...weekNumberArray, result])
                 });
            })
            .catch((e) => {
                console.log(e);
            });
    }, [rerenderTransaktions]);


    useEffect(() => {
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: grey200
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            },
            series: [
                {
                    name: 'Income',
                    data: incomeArray.slice(11)
                },
                {
                    name: 'Expenses',
                    data: expenseArray.slice(11)
                }
            ],
            xaxis: {
                type: 'category',
                categories: weekNumberArray.slice(11)
            },
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Weekly Growth</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">$2,324.00</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
