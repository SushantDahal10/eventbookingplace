import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                // First try to get user from API (checks cookie)
                const data = await authService.getCurrentUser();
                setUser(data.user);
                localStorage.setItem('user', JSON.stringify(data.user));
            } catch (err) {
                // If failed, check if we have local storage (fallback or clear)
                // Actually, if API fails (401), we should clear local storage
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    };

    const googleLogin = async (credential) => {
        const data = await authService.googleLogin(credential);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout failed', err);
        }
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
