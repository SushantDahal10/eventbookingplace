import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-heading font-black text-gray-900 mb-2">Payment Failed ❌</h1>
                    <p className="text-lg text-gray-600 mb-6 font-medium">
                        Something went wrong during the transaction. Your account has not been charged.
                    </p>

                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 text-left space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <div className="font-bold text-gray-900">Common Causes</div>
                                <ul className="text-sm text-gray-600 list-disc list-inside mt-1 space-y-1">
                                    <li>Insufficient balance</li>
                                    <li>Transaction cancelled by user</li>
                                    <li>Network connectivity issues</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/30"
                        >
                            Try Again ➜
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentFailure;
