import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import NavRoute from '../NavRoute';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: (
        <NavRoute>
            <MinimalLayout />
        </NavRoute>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin3 />
        },
        {
            path: '/signin',
            element: <AuthRegister3 />
        }
    ]
};

export default AuthenticationRoutes;
