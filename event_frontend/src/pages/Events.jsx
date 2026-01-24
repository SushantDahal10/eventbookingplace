import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../features/events/components/EventCard';
import BigCarousel from '../components/common/BigCarousel';

// Mock Data
import { EVENTS } from './mock';

// Carousel Slides Data
const EVENT_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1459749411177-287ce63e3ba9?auto=format&fit=crop&q=80&w=1600",
        title: "Upcoming Concerts",
        subtitle: "Feel the energy of live music.",
        tag: "Music",
        primaryAction: { text: "Book Feature Ticket", link: "/booking/1", icon: "🎟️" },
        secondaryAction: { text: "View Details", link: "/events/1" }
    },
    {
        id: 2,
        image: "https://media.istockphoto.com/id/637268486/photo/patan.jpg?s=612x612&w=0&k=20&c=IHL_X9XMlTKCFjXMAdJTr3dLoJTN-Vvn5QsYfNtnkgc=",
        title: "Comedy Specials",
        subtitle: "Laugh out loud with top comedians.",
        tag: "Comedy",
        primaryAction: { text: "Book Feature Ticket", link: "/booking/2", icon: "🎟️" },
        secondaryAction: { text: "View Details", link: "/events/2" }
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1600",
        title: "Sports Tournaments",
        subtitle: "Cheer for your favorite teams.",
        tag: "Sports",
        primaryAction: { text: "Book Feature Ticket", link: "/booking/3", icon: "🎟️" },
        secondaryAction: { text: "View Details", link: "/events/3" }
    }
];

const Events = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const initialCategory = queryParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
    const [searchQuery, setSearchQuery] = useState("");
    const resultsRef = useRef(null);

    // Scroll to results if category is pre-selected from URL
    useEffect(() => {
        if (initialCategory && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [initialCategory]);

    const filteredEvents = EVENTS.filter(event => {
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            {/* Big Premium Carousel */}
            <BigCarousel slides={EVENT_SLIDES} />

            <main className="flex-grow max-w-[1200px] mx-auto px-4 py-16 w-full relative z-10 -mt-20">
                {/* Search & Filter Card */}
                <div ref={resultsRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12 flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-grow w-full md:w-auto">
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {["All", "Concert", "Comedy", "Sports", "Music"].map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedCategory(cat);
                                }}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-secondary text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-heading font-extrabold text-secondary">All Upcoming Events</h2>
                    <p className="text-text-muted">Found {filteredEvents.length} events matching your criteria.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                    {filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Events;
