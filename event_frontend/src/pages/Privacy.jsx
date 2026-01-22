import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Privacy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <div className="bg-secondary text-white py-20 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-[fadeIn_0.8s]">
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Privacy Policy</h1>
                    <p className="text-lg text-gray-300">Last Updated: January 2026</p>
                </div>
            </div>

            <main className="flex-grow md:-mt-20 relative z-20 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="card-premium p-10 md:p-16 space-y-10 animate-[slideUp_0.8s]">

                        <p className="text-xl text-gray-700 font-medium leading-relaxed">
                            Your privacy is critically important to us. At NepaliShows, we have a few fundamental principles regarding your data.
                        </p>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">What Data We Collect</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                We gather only the information necessary to provide our services:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 ml-2">
                                <li><strong>Identity Data:</strong> Name, username, or similar identifier.</li>
                                <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
                                <li><strong>Financial Data:</strong> Partial payment details processed securely by our payment partners (eSewa, Khalti). We do not store full card numbers.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">How We Use Your Data</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We use your personal information to process your ticket bookings, manage venue reservations, and communicate important updates regarding events you strictly have signed up for.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">Data Security</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We implement state-of-the-art encryption and security protocols to protect your personal information from unauthorized access or disclosure.
                            </p>
                        </section>

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <p className="text-sm text-gray-400">
                                Privacy Officer Contact: <a href="mailto:privacy@nepalishows.com" className="text-primary hover:underline">privacy@nepalishows.com</a>
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
