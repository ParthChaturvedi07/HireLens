import { useAuth } from "../hooks/useAuth";
import { Navigate, useNavigate } from "react-router";
import React from 'react';

const Protected = ({ children }) => {
    const { loading, user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to={'/login'} />
    }
    
    if (loading) {
        return (<main>
            <hi>Loading...</hi>
        </main>)
    }


    return children;
}

export default Protected;