import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;

    const handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async ({ email, password, username }) => {
        try {
            setLoading(true);
            const data = await register({ email, password, username });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
            setUser(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }
    
    // const handleGetMe = async () => {
    //     try {
    //         setLoading(true);
    //         const data = await getMe();
    //         setUser(data.user);
    //         return data;
    //     } catch (error) {
    //         throw error;
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return { user, loading, handleRegister, handleLogin, handleLogout };
};