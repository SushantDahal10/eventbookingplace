import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, login, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: ""
    });

    const [originalEmail, setOriginalEmail] = useState("");
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [otp, setOtp] = useState("");

    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || ""
            });
            setOriginalEmail(user.email || "");
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.user) {
                const u = response.data.user;
                setFormData(prev => ({
                    ...prev,
                    fullName: u.fullName,
                    email: u.email,
                    phoneNumber: u.phoneNumber || ""
                }));
                setOriginalEmail(u.email);
            }
        } catch (error) {
            console.error("Failed to fetch fresh profile", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Always update name first (or only name)
            const nameResponse = await api.put('/auth/profile', {
                fullName: formData.fullName
            });
            if (nameResponse.data.user) {
                updateUser(nameResponse.data.user);
            }

            // 2. Check if email changed
            if (formData.email !== originalEmail) {
                // Request OTP
                await api.post('/auth/profile/request-email-change', {
                    newEmail: formData.email
                });
                toast.success("OTP sent to your new email!");
                setShowOtpModal(true);
                setLoading(false); // Stop loading to let user enter OTP
                return; // Early return, wait for OTP
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            const errorMsg = error.response?.data?.error || "Failed to update profile";
            if (errorMsg.includes("Email is already in use")) {
                setError(errorMsg);
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await api.put('/auth/profile/verify-email-change', {
                newEmail: formData.email,
                otp
            });

            if (response.data.user) {
                updateUser(response.data.user); // Sync global state
                setShowOtpModal(false);
                setOriginalEmail(response.data.user.email);
                setShowSuccessModal(true);
                // Auto hide after 3 seconds
                setTimeout(() => setShowSuccessModal(false), 3000);
            }
        } catch (error) {
            console.error("OTP Error:", error);
            toast.error(error.response?.data?.error || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />
            <main className="flex-grow pt-28 pb-20 px-4 w-full max-w-4xl mx-auto">
                <div className="relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/20 blur-[100px] -z-10 rounded-full opacity-60"></div>

                    <div className="text-center mb-12 animate-[fadeIn_0.5s]">
                        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary mb-4">Your Profile</h1>
                        <p className="text-gray-500 text-lg">Manage your personal information and account settings.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Card: Avatar & Summary */}
                        <div className="col-span-1">
                            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-white/40 backdrop-blur-md text-center sticky top-28">
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full p-1 mb-6 shadow-lg shadow-primary/30">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                                        <span className="text-5xl font-black text-secondary uppercase">
                                            {formData.fullName ? formData.fullName.charAt(0) : "U"}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.fullName}</h2>
                                <p className="text-sm text-gray-500 mb-6 font-medium">{formData.email}</p>

                                <div className="space-y-3">
                                    <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Status</p>
                                        <p className="text-green-600 font-bold flex items-center justify-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified
                                        </p>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <Link to="/profile/bookings" className="block w-full py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                            <span>🎟️</span> My Bookings
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Card: Edit Form */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-white/40 backdrop-blur-md">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">✏️</span>
                                    Edit Details
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Error Alert */}
                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-[fadeIn_0.3s]">
                                            <div className="flex items-center gap-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <div>
                                                    <p className="font-bold text-red-700">Update Failed</p>
                                                    <p className="text-sm text-red-600">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-gray-800"
                                                placeholder="john@example.com"
                                                required
                                            />
                                            {formData.email !== originalEmail && (
                                                <p className="text-xs text-orange-500 font-bold ml-1">Changing email will require OTP verification.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative w-full md:w-auto px-8 py-3.5 bg-secondary hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                ) : "Save Changes"}
                                            </span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OTP Modal */}
                {showOtpModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setShowOtpModal(false)}></div>
                        <div className="relative bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s]">
                            <h3 className="text-xl font-bold text-center mb-2">Verify Email Change</h3>
                            <p className="text-gray-500 text-center text-sm mb-6">Enter the OTP sent to <span className="font-bold text-gray-800">{formData.email}</span></p>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full text-center text-2xl tracking-widest font-bold px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-colors"
                                    maxLength={6}
                                />
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Verifying..." : "Verify & Update"}
                                </button>
                                <button
                                    onClick={() => setShowOtpModal(false)}
                                    className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm"></div>
                        <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-secondary mb-2">Success!</h3>
                            <p className="text-gray-500 font-medium mb-6">Your email address has been successfully updated.</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3.5 bg-secondary text-white font-bold rounded-xl hover:bg-black transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Profile;
