import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200"
                        alt="Event Crowd"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>

                    <div className="relative z-10 max-w-[1000px] mx-auto px-4 text-center text-white">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold tracking-widest uppercase mb-4">
                            Our Mission
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-6 leading-tight">
                            Bringing People Together Through <br /> Unforgettable Experiences
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                            NepaliShows is Nepal's premier event booking platform. We connect you with the vibrant culture, music, and energy of our nation.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white py-16 border-b border-gray-100">
                    <div className="max-w-[1200px] mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</h3>
                                <p className="text-gray-500 font-medium">Events Hosted</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">50k+</h3>
                                <p className="text-gray-500 font-medium">Happy Attendees</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</h3>
                                <p className="text-gray-500 font-medium">Venues Partnered</p>
                            </div>
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</h3>
                                <p className="text-gray-500 font-medium">Customer Support</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Story / Values */}
                <div className="max-w-[1200px] mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                                Why We Started
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Founded in 2025, NepaliShows began with a simple idea: it shouldn't be hard to find good things to do. We wanted to solve the chaotic ticketing process and bring a world-class booking experience to Nepal.
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Today, we are a team of passionate music lovers, tech enthusiasts, and culture advocates working tirelessly to ensure every event is accessible, secure, and memorable.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                    <span className="text-gray-700 font-medium">100% Secure Digital Ticketing</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                    <span className="text-gray-700 font-medium">Instant Confirmation via SMS/Email</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                    <span className="text-gray-700 font-medium">Refund Protection Guarantee</span>
                                </li>
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply blur-3xl"></div>
                            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-secondary/10 rounded-full mix-blend-multiply blur-3xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                alt="Our Team"
                                className="relative rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Team Grid */}
                <div className="bg-white py-20">
                    <div className="max-w-[1200px] mx-auto px-4 text-center">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">The Dream Team</span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-12">
                            Meet the Minds Behind the Magic
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="group">
                                    <div className="relative overflow-hidden rounded-xl mb-4 h-80">
                                        <img
                                            src={`https://images.unsplash.com/photo-${item === 1 ? '1560250097-0b93528c311a' : item === 2 ? '1573496359142-b8d87734a5a2' : '1580489944761-15a19d654956'}?auto=format&fit=crop&q=80&w=500`}
                                            alt="Team Member"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                                            <div className="flex gap-4">
                                                <a href="#" className="text-white hover:text-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></a>
                                                <a href="#" className="text-white hover:text-primary"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">
                                        {item === 1 ? 'Sushant Dahal' : item === 2 ? 'Anjali Sharma' : 'Rohan Maharjan'}
                                    </h4>
                                    <p className="text-primary font-medium text-sm">
                                        {item === 1 ? 'CEO & Founder' : item === 2 ? 'Head of Operations' : 'Tech Lead'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-secondary py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10 max-w-[800px] mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                            Join the Community
                        </h2>
                        <p className="text-gray-300 text-lg mb-10">
                            Be the first to know about exclusive events, early-bird tickets, and special offers.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            />
                            <button className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
