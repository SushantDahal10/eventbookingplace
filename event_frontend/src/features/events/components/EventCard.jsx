import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event.id}`} className="block">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-secondary shadow-sm">
                        {event.category}
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

                    <button className="mt-auto w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 rounded-lg transition-all text-sm">
                        Book Ticket
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
