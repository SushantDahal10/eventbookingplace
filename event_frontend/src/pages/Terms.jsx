import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Terms = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header Decoration */}
                    <div className="h-4 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

                    <div className="p-8 md:p-16">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl md:text-6xl font-heading font-black text-secondary mb-4 leading-tight">
                                Terms of <span className="text-primary">Service</span>
                            </h1>
                            <p className="text-text-muted font-medium uppercase tracking-[0.2em] text-sm">
                                Last Updated: 26 Jan 2026
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12">
                            <section>
                                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                                    <p className="text-xl font-medium text-gray-800 leading-relaxed text-center">
                                        Welcome to NepalShows. These Terms of Service govern your use of our platform. By accessing our services, you agree to these terms in full.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">1</span>
                                    Acceptance of Terms
                                </h2>
                                <p className="text-gray-600">
                                    By accessing or using NepaliShows, you agree to be bound by these Terms of Service. This includes all future updates and modifications. If you do not agree to these terms, you must immediately cease all use of our platform.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">2</span>
                                    Booking & Cancellations
                                </h2>
                                <p className="text-gray-600">
                                    Purchases made through our platform are generally final and non-refundable, subject to the specific organizer's policy.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        "Tickets are valid ONLY for the specific date and time selected.",
                                        "Venue bookings require a 20% non-refundable service deposit.",
                                        "Cancellations must be requested via support 48 hours in advance.",
                                        "Refunds are only issued if the event is cancelled by the host."
                                    ].map((policy, i) => (
                                        <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-primary font-bold">#0{i + 1}</span>
                                            <span className="text-sm font-medium text-gray-700">{policy}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">3</span>
                                    User Conduct & Responsibility
                                </h2>
                                <p>We maintain a positive community. You agree not to:</p>
                                <ul className="space-y-4 list-none p-0">
                                    {[
                                        "Create fraudulent bookings or use stolen payment details.",
                                        "Interfere with the platform's security or technical integrity.",
                                        "Harass event organizers or other users on the platform.",
                                        "Resell tickets at unauthorized higher prices (scalping)."
                                    ].map((rule, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0"></div>
                                            <span className="text-gray-600 font-medium">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="bg-secondary text-white p-10 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
                                <h2 className="text-2xl font-heading font-extrabold mb-4">4. Limitation of Liability</h2>
                                <p className="opacity-80 leading-relaxed italic">
                                    NepalShows acts as an intermediary booking service. We are not responsible for event postponements, venue conditions, or personal experiences during the event. Our liability is limited to the service fees collected.
                                </p>
                            </section>

                            <div className="h-px bg-gray-100 my-10"></div>

                            <section className="flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-heading font-black text-secondary mb-2">Have specific questions?</h3>
                                    <p className="text-gray-500">Our legal team is here to clarify any concerns.</p>
                                </div>
                                <div className="flex gap-4">
                                    <a href="mailto:support@nepalshows.com" className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                        Email Support
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
