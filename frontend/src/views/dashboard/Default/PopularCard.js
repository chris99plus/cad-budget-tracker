import { useState, useEffect, useRef } from 'react';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import dayjs from 'dayjs';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../../../authContext';

// apis
import TransactionDataService from '../../../services/transactions';
import ReportDataService from '../../../services/report';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

function PopularCard({ isLoading, rerenderTransaktions, setRerenderTransaktions}) {

    //React-States
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [transaction, setTransaction] = useState([]);
    const [open, setOpen] = useState(false);
    const [transactionPeriod, setTransactionPeriod] = useState('day');
    const [transactionBillImage, setTransactionBillImage] = useState(null);
    const [error, setError] = useState(false);
    const { tokenState } = useAuth();
    const [type, setType] = useState(false);
    const [reportForCurrentDay, setReportForCurrentDay] = useState([]);
    const [reportForCurrentMonth, setReportForCurrentMonth] = useState([]);
    const [totalBalance, setTotalBalance] = useState([]);
    const [showAllTransactions, setShowAllTransactions] = useState(false);
    const currentDate = new Date();
    const [dateValue, setDateValue] = useState(dayjs(currentDate));
    const [transactionView, setShowTransactionView] = useState(false);
    const [activeTransaction, setActiveTransaction] = useState(false);
    const [transactionFromToday, setTransactionFromToday] = useState([]);
    const [transactionFromThisMonth, setTransactionFromThisMonth] = useState([]);
    const [transactionValues, setTransactionValues] = useState([]);


    //References
    const textFieldCommentRef = useRef();
    const textFieldTypeRef = useRef();
    const textFieldValueRef = useRef();
    const textFieldDescriptionRef = useRef();
    const textFieldCategoryRef = useRef();

    //Variables
    var indexTransaction = 0; 
    const numerOfMaximalTransaktions = 5;

    //Types
    const types = [
        {
            value: 'income',
            label: 'Income'
        },
        {
            value: 'expense',
            label: 'Expense'
        }
    ];

    const transactionPeriods = [
        {
            value: 'day',
            label: 'Today'
        },
        {
            value: 'month',
            label: 'This Month'
        },
        {
            value: 'total',
            label: 'View All'
        }
    ];
    const incomeCategorys= [
        {
            value: 'Salary',
            label: 'Salary'
        },
        {
            value: 'Promotions',
            label: 'Promotions'
        },
        {
            value: 'Investments',
            label: 'Investments'
        },
        {
            value: 'Other Revenue',
            label: 'Other Revenue'
        }
    ];

    const expenseCategorys= [
        {
            value: 'Food',
            label: 'Food'
        },
        {
            value: 'Shopping',
            label: 'Shopping'
        },
        {
            value: 'Clothing',
            label: 'Clothing'
        },
        {
            value: 'Apartment',
            label: 'Apartment'
        },
        {
            value: 'Mobility',
            label: 'Mobility'
        }
    ];

    //Action-Listeners
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setShowTransactionView(false);
        setError(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
        setShowTransactionView(false);
        setError(false);
    };

    const handleChange = (newValue) => {
        setDateValue(newValue);
    };

    const handleClickAdd = () => {
        if (
            textFieldDescriptionRef.current.value != '' &&
            textFieldValueRef.current.value != '' &&
            textFieldCategoryRef.current.value != '' &&
            textFieldTypeRef.current.value != ''  
        ) {
            var data = {
                amount: textFieldValueRef.current.value,
                type: textFieldTypeRef.current.value,
                description: textFieldDescriptionRef.current.value,
                comment: textFieldCommentRef.current.value,
                timestamp: dateValue, 
                category: textFieldCategoryRef.current.value,
                billImage: transactionBillImage
            };
            
            TransactionDataService.postTransaction(data, tokenState)
                .then((response) => {
                    setOpen(false);
                    setRerenderTransaktions(true);
                    setError(false);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            setError('Please Select all Fields');
        }
    };

    //Functions
    function openTransactionView (childTransactionId) {
        TransactionDataService.getSingleTransaction(tokenState, childTransactionId)
            .then((response) => {
                setActiveTransaction(response.data.data);
                setShowTransactionView(true);
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function deleteTransaction (childTransactionId) {
        TransactionDataService.deleteSingleTransaction(tokenState, childTransactionId)
            .then((response) => {
                setShowTransactionView(false);
                setRerenderTransaktions(true);
            })
            .catch((e) => {
                console.log(e);
            });
    }
    //Side-Effects
    useEffect(() => {
        TransactionDataService.getAll(tokenState)
            .then((response) => {
                setTransaction(response.data.data.reverse());
                setTransactionFromToday([]);
                setTransactionFromThisMonth([]);
                setTransactionValues([]);
                response.data.data.forEach(transactionChild => {
                    if (transactionChild.type == 'expense') {
                        setTransactionValues(transactionFromToday =>[...transactionFromToday,-transactionChild.amount])
                    }else{
                        setTransactionValues(transactionFromToday =>[...transactionFromToday,transactionChild.amount])
                    }
                    var comparisonTime = Date.parse(transactionChild.timestamp);
                    var dateObject = new Date(comparisonTime);
                    if(dateObject.getDate() == currentDate.getDate()){
                        if (transactionChild.type == 'expense') {
                            setTransactionFromToday(transactionFromToday =>[...transactionFromToday,-transactionChild.amount])
                        }else{
                            setTransactionFromToday(transactionFromToday =>[...transactionFromToday,transactionChild.amount])
                        }
                    }
                    if(dateObject.getMonth() == currentDate.getMonth()){
                        if (transactionChild.type == 'expense') {
                            setTransactionFromThisMonth(transactionFromThisMonth =>[...transactionFromThisMonth,-transactionChild.amount])
                        }
                        else{
                            setTransactionFromThisMonth(transactionFromThisMonth =>[...transactionFromThisMonth,transactionChild.amount])
                        }
                    }
                }
            )})
            .catch((e) => {
                console.log(e);
            });
        TransactionDataService.getTotalBalance(tokenState)
            .then((response) => {
                setTotalBalance(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
        ReportDataService.getReportForOneDay(tokenState)
            .then((response) => {
                setReportForCurrentDay(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });;
        ReportDataService.getReportForCurrentMonth(tokenState)
            .then((response) => {
                setReportForCurrentMonth(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });;
    }, [rerenderTransaktions]);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                            <Grid container alignContent="center" justifyContent="space-between" marginBottom={2}>
                                <Fab size="small" color="primary" aria-label="add" onClick={handleClickOpen}>
                                    <AddIcon />
                                </Fab>
                                <Grid item marginTop={1}>
                                        <MoreHorizOutlinedIcon
                                            fontSize="medium"
                                            sx={{
                                                color: theme.palette.primary[200],
                                                cursor: 'pointer'
                                            }}
                                            aria-controls="menu-popular-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        />
                                        <Menu
                                            id="menu-popular-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            {transactionPeriods.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                    onClick={() => (setTransactionPeriod(option.value), handleClose())}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Grid>
                            </Grid>
                                <Grid container alignContent="center" justifyContent="space-between" marginBottom={-1}>
                                    <Grid item flex="true" alignContent="center">
                                        <Typography variant="h4" marginLeft={1}>Transaktionen</Typography>
                                    </Grid>

                                    {/*start of change/show single transaction dialog*/}

                                    <Dialog
                                        open={transactionView}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{'Change Your Transaction'}</DialogTitle>
                                        {error && (
                                            <DialogContentText id="alert-dialog-description" marginLeft="25px" color="red">
                                                {error}
                                            </DialogContentText>
                                        )}
                                        <DialogContent autoComplete="off">
                                            <TextField
                                                margin="dense"
                                                id="outlined-select-currency"
                                                variant="outlined"
                                                fullWidth
                                                label="Type"
                                                defaultValue={activeTransaction.type}
                                                disabled
                                            >

                                            </TextField>
                                            <TextField
                                                margin="dense"
                                                id="outlined-select-currency"
                                                variant="outlined"
                                                fullWidth
                                                label="Category"
                                                defaultValue={activeTransaction.category}
                                                disabled
                                            >
                                  
                                            </TextField>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Description"
                                                defaultValue={activeTransaction.description}
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                disabled
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Comment"
                                                defaultValue={activeTransaction.comment}
                                                type="text"
                                                fullWidth
                                                disabled
                                                variant="outlined"
                                                autoComplete="off"
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                defaultValue={activeTransaction.amount}
                                                type="number"
                                                fullWidth
                                                label="Value"
                                                variant="outlined"
                                                autoComplete="off"
                                                maxRows={10}
                                                disabled
                                            />
                                            <DialogActions></DialogActions>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    label="Date Transaction"
                                                    disabled
                                                    inputFormat="MM/DD/YYYY"
                                                    value={dayjs(activeTransaction.timestamp)}
                                                    onChange={handleChange}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                            <DialogActions></DialogActions>
                                 
                                            {activeTransaction? <div
                                                style={{
                                                    marginTop:"10px",
                                                backgroundImage:"url("+'"'+(activeTransaction.billImageUrl)+'"'+")",
                                                objectFit: "cover",
                                                height:"300px",
                                                width:"100%",
                                                backgroundSize:"cover"
                                                }}
                                            
                                            />:""}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => deleteTransaction(activeTransaction._id)}>Delete</Button>
                                            <Button onClick={handleClickClose}>Close</Button>
                                        </DialogActions>
                                    </Dialog>

                                    {/*end of change/show single transaction dialog*/}

                                    {/*start of upload transaction dialog*/}

                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle id="alert-dialog-title">{'Add Transaction'}</DialogTitle>
                                        {error && (
                                            <DialogContentText id="alert-dialog-description" marginLeft="25px" color="red">
                                                {error}
                                            </DialogContentText>
                                        )}
                                        <DialogContent autoComplete="off">
                                            <TextField
                                                margin="dense"
                                                id="outlined-select-currency"
                                                fullWidth
                                                select
                                                label="Type"
                                                defaultValue="income"
                                                inputRef={textFieldTypeRef}
                                                onChange={(e) => ((textFieldCategoryRef.current.value=''),setType(e.target.value))} 
                                            >
                                                {types.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                margin="dense"
                                                id="outlined-select-currency"
                                                fullWidth
                                                select
                                                label="Category"
                                                defaultValue=""
                                                inputRef={textFieldCategoryRef}
                                            >
                                                {(type&&(type == 'expense')?
                                                (expenseCategorys.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                )))
                                                :
                                                (incomeCategorys.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))))}
                                            </TextField>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Name of your Transaction"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                inputRef={textFieldDescriptionRef}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Comment for your Transaction"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                inputRef={textFieldCommentRef}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Value of your Transaction"
                                                type="number"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                maxRows={10}
                                                inputRef={textFieldValueRef}
                                            />
                                            <DialogActions></DialogActions>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DesktopDatePicker
                                                    label="Date Transaction"
                                                    inputFormat="MM/DD/YYYY"
                                                    value={dateValue}
                                                    onChange={handleChange}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                            <DialogActions></DialogActions>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                fullWidth
                                                
                                            >
                                                Upload File
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/png, image/jpeg"
                                                    onChange={(e) => setTransactionBillImage(e.target.files[0])} 
                                                   
                                                />
                                            </Button>
                                            {transactionBillImage? <div
                                                style={{
                                                    marginTop:"10px",
                                                backgroundImage:"url("+'"'+URL.createObjectURL(transactionBillImage)+'"'+")",
                                                objectFit: "cover",
                                                height:"300px",
                                                width:"100%",
                                                backgroundSize:"cover"
                                                }}
                                            
                                            />:""}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClickClose}>Close</Button>
                                            <Button onClick={handleClickAdd}>Add</Button>
                                        </DialogActions>
                                    </Dialog>

                                    {/*end of upload transaction dialog*/}
                                    
                                </Grid>
                            </Grid>

                            {/*start of dropdownmenue for change the time Intervall of the transactions*/}

                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                {transactionPeriod == 'day' &&
                                <BajajAreaChartCard
                                    value={Math.round(reportForCurrentDay.total) || 0}
                                    description={"Balance  " + transactionPeriod}
                                    array={transactionFromToday}
                                />}
                                {transactionPeriod == 'month' &&
                                <BajajAreaChartCard
                                    value={Math.round(reportForCurrentMonth.total) || 0}
                                    description={"Balance  " + transactionPeriod }
                                    array={transactionFromThisMonth}
                                />}
                                {transactionPeriod == 'total' &&
                                <BajajAreaChartCard
                                    value={totalBalance.total || 0}
                                    description={"Balance  " + transactionPeriod }
                                    array={transactionValues}
                                />}
                            </Grid>

                            {/*start of dropdownmenue for change the time Intervall of the transactions*/}

                            {/*start of main map-function of all transactions*/}
                            <Grid item xs={12}>
                                {transaction.map((child) => {
                                    var comparisonTime = Date.parse(child.timestamp);
                                    var dateObject = new Date(comparisonTime);
                                    if((transactionPeriod == 'day' && dateObject.getDate() == currentDate.getDate()) ||
                                        (transactionPeriod == 'month' && dateObject.getMonth() == currentDate.getMonth()) ||
                                        (transactionPeriod == 'total')) {
                                        indexTransaction ++;
                                    }
                                    return (
                                        ((((transactionPeriod == 'day' && dateObject.getDate() == currentDate.getDate()) ||
                                        (transactionPeriod == 'month' && dateObject.getMonth() == currentDate.getMonth()) ||
                                        (transactionPeriod == 'total')) && 
                                        ((indexTransaction < numerOfMaximalTransaktions) || showAllTransactions))) && (
                                            <div key={child._id}>
                                                <Grid className="transactionComponent" container sx={{cursor:"pointer"}} direction="column" onClick={()=>openTransactionView(child._id)}>
                                                    <Grid item>
                                                        <Grid container alignItems="center" justifyContent="space-between">
                                                            <Grid item>
                                                                <Typography variant="subtitle1" color="inherit">
                                                                    {child.description}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Grid container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1" color="inherit">
                                                                            {child.amount}€
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        {child.type == 'expense' && (
                                                                            <Avatar
                                                                                variant="rounded"
                                                                                sx={{
                                                                                    width: 16,
                                                                                    height: 16,
                                                                                    borderRadius: '5px',
                                                                                    color: '#E68296',
                                                                                    ml: 2,
                                                                                    backgroundColor: '#df380f'
                                                                                }}
                                                                            >
                                                                                <KeyboardArrowDownOutlinedIcon
                                                                                    fontSize="small"
                                                                                    color="inherit"
                                                                                />
                                                                            </Avatar>
                                                                        )}
                                                                        {child.type == 'income' && (
                                                                            <Avatar
                                                                                variant="rounded"
                                                                                sx={{
                                                                                    width: 16,
                                                                                    height: 16,
                                                                                    borderRadius: '5px',
                                                                                    color: theme.palette.success.dark,
                                                                                    ml: 2,
                                                                                    backgroundColor: theme.palette.success.light
                                                                                }}
                                                                            >
                                                                                <KeyboardArrowUpOutlinedIcon
                                                                                    fontSize="small"
                                                                                    color="inherit"
                                                                                />
                                                                            </Avatar>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item>
                                                        {child.type == 'expense' && (
                                                            <Typography variant="subtitle2" sx={{ color: '#D80B0B' }}>
                                                                {child.comment}
                                                            </Typography>
                                                        )}
                                                        {child.type == 'income' && (
                                                            <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                                                {child.comment}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                                <Divider sx={{ my: 1.5 }} />
                                            </div>
                                        )
                                    );

                                    {/*end of main map-function of all transactions*/}

                                })}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, mt: -4, justifyContent: 'center' }}>
                        {showAllTransactions?
                            <Button 
                            size="small" 
                            disableElevation 
                            onClick={() => setShowAllTransactions(false)}>
                                View Less
                                <ChevronRightOutlinedIcon />
                            </Button>
                            :
                            <Button 
                                size="small" 
                                disableElevation 
                                onClick={() => setShowAllTransactions(true)}>
                                    View All
                                    <ChevronRightOutlinedIcon />
                            </Button>
                        }
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};


export default PopularCard;
