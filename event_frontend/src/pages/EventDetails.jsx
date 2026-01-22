import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Dummy data lookup (in a real app this would come from an API based on ID)
const getEventById = (id) => {
    // Just returning static data for demo regardless of ID
    return {
        id: id,
        title: "KTM Rock Fest 2026",
        date: "Saturday, Oct 26, 2026",
        time: "5:00 PM onwards",
        location: "Dasarath Stadium, Kathmandu",
        priceRange: "Rs. 1000 - Rs. 5000",
        description: "Join us for the biggest rock festival of the year! Featuring top bands from Nepal and around the globe. Experience an electrifying atmosphere with high-fidelity sound, amazing light shows, and a crowd of thousands.",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1200",
        organizer: "Nepal Events Pvt Ltd",
        tickets: [
            { type: "General Admission", price: 1000, color: "border-gray-200" },
            { type: "Fan Pit", price: 2500, color: "border-primary/50 bg-primary/5" },
            { type: "VIP", price: 5000, color: "border-yellow-400/50 bg-yellow-50" }
        ]
    };
};

const EventDetails = () => {
    const { id } = useParams();
    const event = getEventById(id);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section with Blurred Background */}
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

                    <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-end pb-12">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider">
                            Upcoming Event
                        </span>
                        <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4 drop-shadow-lg">
                            {event.title}
                        </h1>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-gray-200 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {event.date} | {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="max-w-[1200px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Description & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Overview */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold font-heading mb-4 text-gray-900">Event Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {event.description}
                            </p>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-gray-900 mb-1">Organizer</h4>
                                    <p className="text-gray-600 text-sm">{event.organizer}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-gray-900 mb-1">Entry Policy</h4>
                                    <p className="text-gray-600 text-sm">Age 18+ Only. Valid ID required.</p>
                                </div>
                            </div>
                        </section>

                        {/* Map / Location Placeholder */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold font-heading text-gray-900">Location</h2>
                                <a href="#" className="text-primary font-bold hover:underline text-sm">Get Directions</a>
                            </div>
                            <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative">
                                {/* Placeholder for Map */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <span className="flex flex-col items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-1.447-.894L15 7m0 13V7" />
                                        </svg>
                                        Map View
                                    </span>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-600">{event.location}</p>
                        </section>
                    </div>

                    {/* Right Column: Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold font-heading mb-6 border-b border-gray-100 pb-4">Select Tickets</h3>

                            <div className="space-y-4 mb-8">
                                {event.tickets.map((ticket, index) => (
                                    <div key={index} className={`border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors ${ticket.color}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-900">{ticket.type}</span>
                                            <span className="font-bold text-primary">Rs. {ticket.price}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Includes access to {ticket.type.toLowerCase()} area.</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-3xl font-bold text-gray-900">Rs. 0</p>
                                </div>
                            </div>

                            <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 transform active:scale-95">
                                Proceed to Book
                            </button>
                            <p className="text-center text-xs text-gray-400 mt-4">Secure payment powered by eSewa / Khalti</p>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetails;
