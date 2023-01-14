//Christian Bernhardt MTR-NR: 298354 HTWG-Konstanz
//Imports
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

//Erzeugung der Privaten Route
export default function PrivateRoute({ children }) {
    const { tokenState } = useAuth();
    return !tokenState ? children : <Navigate to="/" />;
}
