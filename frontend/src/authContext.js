import React, { useContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const cookies = new Cookies();
    const token = cookies.get('userDetails');
    const [tokenState, setTokenState] = useState(token);

    function login(token) {
        cookies.set('userDetails', token.data.authToken, { path: '/' });
    }
    function signIn(token) {
        cookies.set('userDetails', token.data.authToken, { path: '/' });
    }
    function logout() {
        cookies.remove('userDetails', { path: '/' });
        setTokenState(false);
    }

    cookies.addChangeListener(callback);

    function callback(cookie_change) {
        setTokenState(cookie_change.value);
    }

    useEffect(() => {
        cookies.addChangeListener(callback);

        if (token) {
            setTokenState(token);
        } else {
            setTokenState();
        }
    }, [token]);

    const value = {
        tokenState,
        signIn,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
