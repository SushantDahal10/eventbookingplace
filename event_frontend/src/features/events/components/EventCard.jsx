import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    // Calculate total tickets
    const totalTickets = event.ticket_tiers?.reduce((acc, tier) => acc + (tier.available_quantity || 0), 0) ?? 0;
    const isSoldOut = totalTickets === 0 && (event.ticket_tiers && event.ticket_tiers.length > 0);

    // Date Logic: Treat DB UTC time as Local Time
    const eventDate = new Date(event.event_date);
    const userTarget = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate(),
        eventDate.getUTCHours(),
        eventDate.getUTCMinutes(),
        eventDate.getUTCSeconds()
    );
    const now = new Date();
    const diff = userTarget - now;
    const isBookingClosed = diff < 12 * 60 * 60 * 1000;

    return (
        <Link to={`/events/${event.id}`} className="block h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className={`w-full h-full object-cover transform transition-transform duration-500 ${isSoldOut ? 'grayscale' : 'group-hover:scale-110'}`}
                    />

                    {/* Category Badge - Top Right */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm z-10">
                        {event.category}
                    </div>

                    {/* Status Labels - Top Left (Premium Design) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
                        {!isSoldOut && totalTickets < 20 && totalTickets > 0 && (
                            <span className="bg-red-600/95 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg shadow-red-600/20 animate-pulse border border-white/20 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                                High Demand
                            </span>
                        )}
                        {!isSoldOut && !isBookingClosed && diff < 48 * 60 * 60 * 1000 && (
                            <span className="bg-orange-500/95 backdrop-blur-sm text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-lg shadow-orange-500/20 border border-white/20 flex items-center gap-1.5">
                                <span>⏳</span> Closing Soon
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-5 flex flex-col flex-grow">
                    <p className="text-primary font-bold text-xs uppercase tracking-wide mb-2">
                        {event.date}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>

                    <button
                        disabled={isSoldOut || isBookingClosed}
                        className={`mt-auto w-full border-2 font-bold py-2 rounded-lg transition-all text-sm ${isSoldOut || isBookingClosed
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                    >
                        {isSoldOut ? "Sold Out" : isBookingClosed ? "Booking Window Passed" : "Book Ticket"}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
