import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = (userInformation) => {
    var userInformation = userInformation.userInformation
    return(
    <ButtonBase disableRipple component={Link} to={config.defaultPath}>
        <Logo />
        <p className="logoSubText">
            {userInformation&&userInformation.licenseType||""}
        </p>
    </ButtonBase>
);
    }
export default LogoSection;
