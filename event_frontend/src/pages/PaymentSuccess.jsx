import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const data = searchParams.get('data');

    const [countdown, setCountdown] = useState(5);
    const calledRef = React.useRef(false);

    useEffect(() => {
        let timer;
        if (status === 'success' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (status === 'success' && countdown === 0) {
            navigate('/profile/bookings');
        }
        return () => clearInterval(timer);
    }, [status, countdown, navigate]);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!data || calledRef.current) return;
            calledRef.current = true;

            try {
                // Call verification endpoint
                const response = await api.post('/payment/esewa/verify', { encodedData: data });

                if (response.data.success) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    toast.error('Payment verification failed');
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('error');
                toast.error('Failed to verify payment');
            }
        };

        verifyPayment();
    }, [data]);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">

                    {status === 'verifying' && (
                        <>
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
                            <p className="text-gray-600">Please wait while we confirm your transaction.</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-[bounce_1s_infinite]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
                            <p className="text-lg text-gray-600 mb-6 font-medium">
                                Your booking is confirmed. See you at the event!
                            </p>

                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 text-left space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📧</span>
                                    <div>
                                        <div className="font-bold text-gray-900">Check your Email</div>
                                        <div className="text-sm text-gray-600">We've sent the ticket details to your inbox.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-400 mb-1">Redirecting you to your tickets in <span className="text-primary font-bold">{countdown}</span> seconds...</p>
                                <button
                                    onClick={() => navigate('/profile/bookings')}
                                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/30"
                                >
                                    View My Ticket ➜
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                            <p className="text-gray-600 mb-8">
                                We couldn't verify your payment details with the server.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full btn-secondary py-3 text-white"
                            >
                                Return Home
                            </button>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
