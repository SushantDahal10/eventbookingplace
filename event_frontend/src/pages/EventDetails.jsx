import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Use same dummy data to prevent "not found" issues during verification without a real backend
const getEventById = (id) => {
    return {
        id: id,
        title: "KTM Rock Fest",
        date: "Oct 26, 2026",
        time: "18:00 PM",
        location: "Dasarath Stadium, KTM",
        description: "Join us for the biggest rock festival of the year! Featuring top bands from Nepal and abroad. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        price: 1500,
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200",
        organizer: "KTM Events",
        tags: ["Music", "Rock", "Festival"]
    };
};

const EventDetails = () => {
    const { id } = useParams();
    const event = getEventById(id);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section with Blur Backdrop */}
                <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-secondary/30"></div>

                    <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-8 md:gap-12 pt-12 md:pt-0">
                        {/* Event Poster */}
                        <div className="w-64 md:w-80 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 transform hover:scale-[1.02] transition-transform duration-500 animate-[scaleIn_0.8s]">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover aspect-[3/4]" />
                        </div>

                        {/* Event Info */}
                        <div className="text-center md:text-left text-white animate-[slideUp_0.8s]">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-orange-300 text-xs font-bold uppercase tracking-wider mb-4">
                                Upcoming Event
                            </span>
                            <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-4 leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-300 mb-8">
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="font-medium">{event.date} • {event.time}</span>
                                </div>
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">{event.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-6xl mx-auto px-4 py-12 -mt-20 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left: Description & Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-premium p-8 animate-[fadeIn_1s_0.2s]">
                                <h3 className="text-2xl font-bold text-secondary mb-4">About the Event</h3>
                                <p className="text-text-muted leading-relaxed text-lg mb-6">
                                    {event.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">#{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-premium p-8">
                                <h3 className="text-2xl font-bold text-secondary mb-4">Location Map</h3>
                                <div className="bg-gray-100 rounded-xl h-64 w-full flex items-center justify-center text-gray-400">
                                    Map Integration Placeholder
                                </div>
                            </div>
                        </div>

                        {/* Right: Booking Card (Sticky) */}
                        <div className="relative">
                            <div className="sticky top-24 card-premium p-6 border-t-4 border-primary shadow-2xl animate-[slideUp_1s_0.4s]">
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Starting From</p>
                                    <div className="text-4xl font-extrabold text-secondary">
                                        Rs. {event.price} <span className="text-lg font-medium text-gray-400">/ person</span>
                                    </div>
                                </div>

                                <Link to={`/booking/${event.id}`} className="block w-full btn-primary py-4 text-center">
                                    Book Ticket Now
                                </Link>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    By booking, you agree to our <a href="#" className="underline hover:text-primary">Terms & Conditions</a>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetails;
