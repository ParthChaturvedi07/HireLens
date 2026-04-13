import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function register({ email, password, username }) {
    try {
        const response = await api.post(`/auth/register`, {
            email,
            password,
            username
        });
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post(`/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export async function getMe() {
    try {
        const response = await api.get(`/auth/get-me`);
        return response.data;
    } catch (error) {
        console.error("Error getting profile:", error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.post(`/auth/logout`, {});
        return response.data;
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
}