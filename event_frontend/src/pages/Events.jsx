import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../features/events/components/EventCard';

// Base Dummy Data
const BASE_EVENTS = [
    {
        id: 1,
        title: "KTM Rock Fest",
        date: "Oct 26, 2026",
        location: "Dasarath Stadium, KTM",
        category: "Concert",
        price: 1500,
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 2,
        title: "Patan Comedy Night",
        date: "Nov 02, 2026",
        location: "Patan Durbar Square",
        category: "Comedy",
        price: 500,
        image: "https://images.unsplash.com/photo-1662999332578-1a5554de0171?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 3,
        title: "Lalitpur Futsal League",
        date: "Nov 10, 2026",
        location: "Lalitpur Futsal Arena",
        category: "Sports",
        price: 200,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 4,
        title: "Jazz at the Mandala",
        date: "Nov 15, 2026",
        location: "Mandala Theater",
        category: "Music",
        price: 1000,
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 5,
        title: "Startup Saturday",
        date: "Nov 20, 2026",
        location: "KTM Hub",
        category: "Workshop",
        price: 0,
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 6,
        title: "Food & Wine Festival",
        date: "Dec 01, 2026",
        location: "Bhrikutimandap",
        category: "Food",
        price: 300,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600"
    }
];

const FILTERS = {
    categories: ["All", "Concert", "Comedy", "Sports", "Music", "Workshop", "Food"],
    dates: ["Any Date", "Today", "Tomorrow", "This Weekend", "Next Week"],
    prices: ["Any Price", "Free", "Under Rs. 1000", "Rs. 1000+"]
};

const Events = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [displayedEvents, setDisplayedEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    // Sync state with URL params if they change (e.g., browser back button)
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) {
            setSelectedCategory(cat);
        } else {
            setSelectedCategory("All");
        }
    }, [searchParams]);

    // Update URL when filtering locally
    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        if (cat === "All") {
            searchParams.delete("category");
            setSearchParams(searchParams);
        } else {
            setSearchParams({ category: cat });
        }
    };

    // Simulate Infinite Filtering & Initial Data Load
    const getFilteredEvents = () => {
        return selectedCategory === "All"
            ? BASE_EVENTS
            : BASE_EVENTS.filter(event => event.category === selectedCategory);
    };

    // Reset list when category changes
    useEffect(() => {
        setDisplayedEvents(getFilteredEvents());
        setPage(1);
        setHasMore(true);
    }, [selectedCategory]);

    // Infinite Scroll Handler
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && hasMore && !isLoading) {
                loadMoreEvents();
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [loader, hasMore, isLoading, selectedCategory, displayedEvents]);

    const loadMoreEvents = () => {
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const filteredBase = getFilteredEvents();

            // In a real app, this would fetch page 2, 3, etc. from an API.
            if (page >= 3) { // Limit pages for demo
                setHasMore(false);
                setIsLoading(false);
                return;
            }

            const newEvents = filteredBase.map(e => ({ ...e, id: e.id + (page * 1000) + Math.random() })); // unique IDs
            setDisplayedEvents(prev => [...prev, ...newEvents]);
            setPage(prev => prev + 1);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                {/* Page Header */}
                <div className="bg-secondary py-12 md:py-16">
                    <div className="max-w-[1200px] mx-auto px-4 text-center">
                        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                            Explore All Events
                        </h1>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                            Find the best concerts, workshops, sports, and more happening around you.
                        </p>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-[1200px] mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                            {/* Scrollable Categories on Mobile */}
                            <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                                <div className="flex gap-2">
                                    {FILTERS.categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`
                                                px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                                                ${selectedCategory === cat
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                            `}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Filters (Placeholder) */}
                            <div className="flex gap-2 w-full md:w-auto">
                                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none">
                                    {FILTERS.dates.map(date => <option key={date}>{date}</option>)}
                                </select>
                                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none">
                                    {FILTERS.prices.map(price => <option key={price}>{price}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Events Grid */}
                <section className="max-w-[1200px] mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedEvents.map((event, index) => (
                            <EventCard key={`${event.id}-${index}`} event={event} />
                        ))}
                    </div>

                    {displayedEvents.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-xl text-gray-500">No events found in this category.</h3>
                            <button onClick={() => handleCategoryChange("All")} className="mt-4 text-primary font-bold hover:underline">
                                View all available events
                            </button>
                        </div>
                    )}

                    {/* Infinite Scroll Loader & Sentinel */}
                    {hasMore && displayedEvents.length > 0 && (
                        <div ref={loader} className="flex justify-center items-center py-12 w-full">
                            {isLoading && (
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                            )}
                        </div>
                    )}

                    {!hasMore && displayedEvents.length > 0 && (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            You've reached the end of the list.
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Events;
