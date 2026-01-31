import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Privacy = () => {
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
                    <div className="h-4 bg-gradient-to-r from-primary via-secondary to-primary"></div>

                    <div className="p-8 md:p-16">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl md:text-6xl font-heading font-black text-secondary mb-4 leading-tight">
                                Privacy <span className="text-primary">Policy</span>
                            </h1>
                            <p className="text-text-muted font-medium uppercase tracking-[0.2em] text-sm">
                                Effective Date: 26 Jan 2026
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-12">
                            <section>
                                <p className="text-xl font-medium text-gray-800 leading-relaxed">
                                    NepalShows is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website, mobile applications, and services (collectively, the “Platform”).
                                </p>
                                <p className="mt-4 text-gray-600">
                                    By using NepalShows, you agree to the practices described in this Privacy Policy.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">1</span>
                                    Information We Collect
                                </h2>

                                <div className="grid md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <div className="text-3xl mb-4">👤</div>
                                        <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>Full name</li>
                                            <li>Email address</li>
                                            <li>Mobile number</li>
                                            <li>Billing details</li>
                                            <li>ID for organizers</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <div className="text-3xl mb-4">🎟️</div>
                                        <h3 className="font-bold text-gray-900 mb-2">Event & Transaction</h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>Tickets purchased</li>
                                            <li>Attendance details</li>
                                            <li>Payment status</li>
                                            <li>QR code data</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <div className="text-3xl mb-4">💻</div>
                                        <h3 className="font-bold text-gray-900 mb-2">Technical Data</h3>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>IP address</li>
                                            <li>Device type</li>
                                            <li>Browser info</li>
                                            <li>Log data</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">2</span>
                                    How We Use Your Information
                                </h2>
                                <p>We use your information to:</p>
                                <ul className="grid md:grid-cols-2 gap-4 list-none p-0">
                                    {[
                                        "Manage user and organizer accounts",
                                        "Process ticket purchases and payments",
                                        "Issue e-tickets and QR codes",
                                        "Communicate important updates",
                                        "Provide customer support",
                                        "Prevent fraud and unauthorized access",
                                        "Comply with legal requirements",
                                        "Improve platform functionality"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <span className="text-primary text-xl">✓</span>
                                            <span className="text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">3</span>
                                    Payment Information
                                </h2>
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-3xl">
                                    <p className="text-blue-900 italic">
                                        All payments are processed through secure third-party payment gateways. NepalShows does not store your full card or banking details. Payment partners handle sensitive financial data in accordance with their own privacy and security standards.
                                    </p>
                                </div>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">4</span>
                                    Information Sharing & Disclosure
                                </h2>
                                <p>We do <strong className="text-primary flex items-center gap-2 inline-flex">not <span className="text-lg">🚫</span></strong> sell your personal data. We may share information only in necessary cases:</p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <span className="font-bold text-primary">01.</span>
                                        <span>With event organizers (attendee name, ticket count)</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-bold text-primary">02.</span>
                                        <span>With payment service providers for processing</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-bold text-primary">03.</span>
                                        <span>With platform service providers (hosting, analytics)</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-bold text-primary">04.</span>
                                        <span>When required by law or government authority</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-heading font-extrabold text-secondary">5. Data Retention</h2>
                                    <p className="text-sm text-gray-600">We retain personal data only for as long as necessary to provide services, meet legal obligations, and resolve disputes. After this, data is securely deleted.</p>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-heading font-extrabold text-secondary">6. Cookies</h2>
                                    <p className="text-sm text-gray-600">We use cookies to maintain sessions and analyze usage. You may disable them in your browser, but some features may not function properly.</p>
                                </div>
                            </section>

                            <section className="bg-secondary text-white p-8 rounded-[2rem] space-y-4">
                                <h2 className="text-2xl font-heading font-extrabold">7. Data Security</h2>
                                <p className="opacity-80">
                                    We implement reasonable technical and organizational security measures to protect your information. However, no online platform can guarantee absolute security.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <h2 className="text-3xl font-heading font-extrabold text-secondary flex items-center gap-4">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-lg">8</span>
                                    User Rights
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {["Access and review information", "Request correction of data", "Request account deletion", "Opt out of communications"].map((right, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors">
                                            <span className="text-primary font-bold">●</span>
                                            <span className="text-sm font-bold text-gray-700">{right}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="h-px bg-gray-100 my-10"></div>

                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-extrabold text-secondary text-lg mb-2">9. Children’s Privacy</h3>
                                        <p className="text-sm text-gray-600">We do not knowingly collect information from individuals under 18. If identified, it will be deleted promptly.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-secondary text-lg mb-2">10. Changes to Policy</h3>
                                        <p className="text-sm text-gray-600">We may update this policy. Continued use after updates constitutes acceptance of the revised policy.</p>
                                    </div>
                                </div>

                                <div className="bg-primary p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
                                    <h3 className="text-2xl font-heading font-black mb-4">11. Contact Us</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">✉️</span>
                                            <a href="mailto:info@nepashows.com" className="font-bold hover:underline">info@nepashows.com</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🏢</span>
                                            <span className="font-bold">NepalShows Organization</span>
                                        </div>
                                    </div>
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

export default Privacy;
