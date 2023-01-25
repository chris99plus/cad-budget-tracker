import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../../../services/auth';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { useAuth } from '../../../../authContext';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const Register = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(false);
    const [email, setEmail] = useState(false);
    const [password, setPassword] = useState(false);
    const [createTenant, setCreateTenant] = useState(false);
    const [tenantID, setTenantID] = useState(false);
    const [tenantName, setTenantName] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const [strength, setStrength] = useState(0);
    const [level, setLevel] = useState();
    const { signIn, tokenChange } = useAuth();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    function signUpCall() {
        if (username && email && password) {
            var data = {
                username: username,
                email: email,
                password: password,
                licenseType: others.licencetype,
                createTenant: createTenant,
                tenantSecret: tenantID,
                tenantName: tenantName
            };
            if (others.licencetype == 'enterprise' && !createTenant && tenantName) {
                console.log(tenantName);
                AuthService.createUser(data)
                    .then((response) => {
                        signIn(response.data);
                        window.location.href = 'http://' + response.data.data.tenantDomain;
                    })
                    .catch((e) => {
                        setError('This Username or Email is already in use!');
                    });
            }
            if (others.licencetype == 'enterprise' && createTenant && tenantID) {
                AuthService.createUser(data)
                    .then((response) => {
                        signIn(response.data);
                        window.location.href = 'http://' + response.data.data.tenantDomain;
                    })
                    .catch((e) => {
                        setError('This Username or Email is already in use!');
                    });
            }
            if (others.licencetype == 'free' || others.licencetype == 'standard') {
                AuthService.createUser(data)
                    .then((response) => {
                        signIn(response.data);
                        window.location.href = 'http://' + response.data.data.tenantDomain;
                    })
                    .catch((e) => {
                        setError('This Username or Email is already in use!');
                    });
            }
        } else {
            setError('Please fill all fields!');
        }
    }

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}></Grid>
                <Grid item xs={12}></Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center" flexDirection="column">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                    {error && (
                        <Box sx={{ mb: 2 }}>
                            <Typography color="red">{error}</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    name="fname"
                                    type="text"
                                    defaultValue=""
                                    onChange={(newValue) => setUsername(newValue.target.value)}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleChange(e);
                                }}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}
                        {others.licencetype == 'enterprise' && (
                            <FormControl>
                                <FormControlLabel
                                    control={<Checkbox onClick={() => setCreateTenant(!createTenant)} />}
                                    label="Join existing Tenant"
                                />
                            </FormControl>
                        )}
                        {createTenant && others.licencetype == 'enterprise' && (
                            <TextField
                                fullWidth
                                label="Tenant-ID"
                                margin="normal"
                                name="fname"
                                type="text"
                                variant="outlined"
                                onChange={(newValue) => setTenantID(newValue.target.value)}
                                defaultValue=""
                            />
                        )}
                        {!createTenant && others.licencetype == 'enterprise' && (
                            <TextField
                                fullWidth
                                label="Tenant-Name"
                                margin="normal"
                                name="fname"
                                type="text"
                                variant="outlined"
                                onChange={(newValue) => setTenantName(newValue.target.value)}
                                defaultValue=""
                            />
                        )}
                        {!createTenant && others.licencetype == 'enterprise' && (
                            <TextField
                                fullWidth
                                label="Credit-Card Number"
                                margin="normal"
                                name="fname"
                                type="text"
                                variant="filled"
                                defaultValue=""
                                disabled
                            />
                        )}
                        {others.licencetype == 'standard' && (
                            <TextField
                                fullWidth
                                label="Credit-Card Number"
                                margin="normal"
                                name="fname"
                                type="text"
                                variant="filled"
                                defaultValue=""
                                disabled
                            />
                        )}
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    onClick={signUpCall}
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default Register;
