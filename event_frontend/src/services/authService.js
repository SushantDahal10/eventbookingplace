import api from './api';

export const authService = {
    // Register: { fullName, email, password }
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Verify OTP: { email, otp }
    verifyOtp: async (data) => {
        const response = await api.post('/auth/verify-otp', data);
        return response.data;
    },

    // Login: { email, password }
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Google Login: { credential }
    googleLogin: async (credential) => {
        const response = await api.post('/auth/google', { credential });
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    // Forgot Password: { email }
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset Password: { email, otp, newPassword }
    resetPassword: async (data) => {
        const response = await api.post('/auth/reset-password', data);
        return response.data;
    },

    // Resend OTP: { email }
    resendOtp: async (email) => {
        const response = await api.post('/auth/resend-otp', { email });
        return response.data;
    },

    // Get Current User
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};
