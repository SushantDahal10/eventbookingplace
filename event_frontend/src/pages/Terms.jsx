import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Terms = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <div className="bg-secondary text-white py-20 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-[fadeIn_0.8s]">
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4">Terms of Service</h1>
                    <p className="text-lg text-gray-300">Last Updated: January 2026</p>
                </div>
            </div>

            <main className="flex-grow md:-mt-20 relative z-20 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="card-premium p-10 md:p-16 space-y-10 animate-[slideUp_0.8s]">

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                By accessing or using NepaliShows, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">2. Booking & Cancellations</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                Purchases made through our platform are generally non-refundable unless an event is cancelled by the organizer.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-600 ml-2">
                                <li>Tickets are valid only for the specific date and event.</li>
                                <li>Venue bookings require a 20% non-refundable deposit.</li>
                                <li>Cancellations must be made at least 48 hours in advance for partial refund eligibility on applicable events.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-heading font-bold text-secondary mb-4">3. User Conduct</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                You agree not to misuse the platform, create false bookings, or interfere with the operation of the site. We reserve the right to ban users who violate these rules.
                            </p>
                        </section>

                        <div className="border-t border-gray-100 pt-8 mt-8">
                            <p className="text-sm text-gray-400">
                                Questions? Contact us at <a href="mailto:legal@nepalishows.com" className="text-primary hover:underline">legal@nepalishows.com</a>
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
