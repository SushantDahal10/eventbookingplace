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

    const calledRef = React.useRef(false);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!data || calledRef.current) return;
            calledRef.current = true;

            try {
                // Call verification endpoint
                const response = await api.post('/payment/esewa/verify', { encodedData: data });

                if (response.data.success) {
                    setStatus('success');
                    // Automatically redirect after 3 seconds
                    setTimeout(() => {
                        navigate('/profile/bookings');
                    }, 3000);
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
    }, [navigate, data]);

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
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-600 mb-8">
                                Thank you for your booking. Your transaction has been confirmed.
                            </p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-8">
                                <p className="text-sm text-gray-500 mb-1">Redirecting to your bookings...</p>
                            </div>

                            <button
                                onClick={() => navigate('/profile/bookings')}
                                className="w-full btn-primary py-3"
                            >
                                View My Bookings Now
                            </button>
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
