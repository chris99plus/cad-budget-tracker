import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../../../authContext';

// apis
import TrasactionDataService from '../../../services/transactions';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const [transaction, setTransaction] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [transactionName, setTransactionName] = useState(null);
    const [transactionValue, setTransactionValue] = useState(null);
    const [transactionContent, setTransactionContent] = useState(null);
    const [transactionComment, setTransactionComment] = useState(null);
    const [transactionCurrency, setTransactionCurrency] = useState('EUR');
    const [error, setError] = useState(false);
    const { tokenState } = useAuth();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    };

    const handleClickAdd = () => {
        if (
            transactionName != null &&
            transactionValue != null &&
            transactionContent != null &&
            transactionComment != null &&
            transactionCurrency != null
        ) {
            var data = {
                amount: transactionValue,
                type: transactionContent,
                description: transactionName,
                comment: transactionComment,
                timestamp: '',
                category: ''
            };
            TrasactionDataService.postTransaction(data, tokenState)
                .then((response) => {
                    //console.log(response.data);
                })
                .catch((e) => {
                    //console.log(e);
                });
            setOpen(false);
            setError(false);
        } else {
            setError('Please Select all Fields');
        }
    };

    const currencies = [
        {
            value: 'USD',
            label: '$'
        },
        {
            value: 'EUR',
            label: '€'
        },
        {
            value: 'BTC',
            label: '฿'
        },
        {
            value: 'JPY',
            label: '¥'
        }
    ];

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

    useEffect(() => {
        TrasactionDataService.getAll(tokenState)
            .then((response) => {
                setTransaction(response.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [open]);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item flex="true" alignContent="center">
                                        <Typography variant="h4">Transaktionen</Typography>
                                    </Grid>
                                    <Button
                                        disableElevation
                                        variant={'outlined'}
                                        size="small"
                                        sx={{ color: 'inherit' }}
                                        onClick={handleClickOpen}
                                    >
                                        Add Transaktion
                                    </Button>
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
                                                label="Select"
                                                defaultValue="EUR"
                                                helperText="Please select your currency"
                                                onChange={(newValue) => setTransactionCurrency(newValue.target.value)}
                                            >
                                                {currencies.map((option) => (
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
                                                label="Select"
                                                defaultValue=""
                                                helperText="Please select the transaction type"
                                                onChange={(newValue) => setTransactionContent(newValue.target.value)}
                                            >
                                                {types.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Name of your Transaction"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                onChange={(newValue) => setTransactionName(newValue.target.value)}
                                            />
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Comment for your Transaction"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                autoComplete="off"
                                                onChange={(newValue) => setTransactionComment(newValue.target.value)}
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
                                                onChange={(newValue) => setTransactionValue(newValue.target.value)}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClickClose}>Close</Button>
                                            <Button onClick={handleClickAdd}>Add</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Grid item>
                                        <MoreHorizOutlinedIcon
                                            fontSize="small"
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
                                            <MenuItem onClick={handleClose}> Today</MenuItem>
                                            <MenuItem onClick={handleClose}> This Month</MenuItem>
                                            <MenuItem onClick={handleClose}> This Year </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                {transaction[0] && (
                                    <BajajAreaChartCard
                                        value={transaction[0].amount}
                                        description={transaction[0].description}
                                        comment={transaction[0].comment}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                {transaction.map((child) => (
                                    <div key={child._id}>
                                        <Grid container direction="column">
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
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        width: 16,
                                                                        height: 16,
                                                                        borderRadius: '5px',
                                                                        backgroundColor: theme.palette.success.light,
                                                                        color: theme.palette.success.dark,
                                                                        ml: 2
                                                                    }}
                                                                >
                                                                    <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                                                                </Avatar>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                                                    {child.comment}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Divider sx={{ my: 1.5 }} />
                                    </div>
                                ))}
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
