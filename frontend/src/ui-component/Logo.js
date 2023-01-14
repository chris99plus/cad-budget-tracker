// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

const Logo = () => {
    const theme = useTheme();

    return (
        <div className="icon">
            <p className="logoText">FINANCEL</p>
        </div>
    );
};

export default Logo;
