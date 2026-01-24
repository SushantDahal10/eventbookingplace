import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await authService.register({ fullName: name, email, password });
            // On success, move to OTP step
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Timer Logic
    const [timer, setTimer] = React.useState(60);
    const [canResend, setCanResend] = React.useState(false);

    React.useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleResendOtp = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.resendOtp(email);
            setTimer(60);
            setCanResend(false);
            toast.success("New code sent to your email!");
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to resend OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (otp.length !== 6) throw new Error("Please enter a valid 6-digit code");

            await authService.verifyOtp({ email, otp });
            toast.success("Verification successful! Logging you in...");
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Verification failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-surface-dim font-body">

            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark to-primary opacity-90 mix-blend-multiply"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-white">
                    <div>
                        <span className="text-2xl font-heading font-bold text-white">NepaliShows</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-heading font-bold mb-4">Join the fun.</h2>
                        <p className="text-lg text-white/90 max-w-md">
                            Create an account to track your tickets, get personalized recommendations, and exclusive venue access.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>

                <div className="w-full max-w-md animate-[slideUp_0.5s]">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-heading font-extrabold text-secondary mb-3">Create Account</h1>
                        <p className="text-text-muted">Start your journey with us today.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSignup} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Sushant Dahal"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-400 text-gray-700"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-400 text-gray-700"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-400 text-gray-700 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Get Started'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6 animate-[fadeIn_0.3s]">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🛡️
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Verify your email</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    We've sent a 6-digit code to <span className="font-bold">{email}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-center">Enter Verification Code</label>
                                <input
                                    type="text"
                                    placeholder="123456"
                                    className="w-full px-4 py-4 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-300 text-gray-900 text-center text-2xl font-bold tracking-widest"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>

                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="text-sm text-primary font-bold hover:underline disabled:opacity-50"
                                    >
                                        Resend Code
                                    </button>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        Resend code in <span className="font-bold text-gray-600">{timer}s</span>
                                    </p>
                                )}
                            </div>
                        </form>
                    )}

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
