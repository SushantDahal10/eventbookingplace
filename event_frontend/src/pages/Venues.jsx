import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const VENUES = [
    {
        id: 1,
        name: "Dasarath Rangasala Stadium",
        location: "Tripureshwor, Kathmandu",
        capacity: "15,000",
        type: "Stadium",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80&w=800",
        features: ["Parking", "VIP Box", "Food Court"]
    },
    {
        id: 2,
        name: "LOD - Lord of the Drinks",
        location: "Thamel, Kathmandu",
        capacity: "2,500",
        type: "Club",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800",
        features: ["Bar", "Live DJ", "Dance Floor"]
    },
    {
        id: 3,
        name: "Mandala Theater",
        location: "Anamnagar, Kathmandu",
        capacity: "300",
        type: "Theater",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1503095392269-27528ca388ec?auto=format&fit=crop&q=80&w=800",
        features: ["Acoustic Sound", "Cafe", "Accessible"]
    },
    {
        id: 4,
        name: "Heritage Garden",
        location: "Sanepa, Lalitpur",
        capacity: "800",
        type: "Banquet",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800",
        features: ["Garden", "Catering", "Parking"]
    },
    {
        id: 5,
        name: "Purple Haze Rock Bar",
        location: "Thamel, Kathmandu",
        capacity: "600",
        type: "Club",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1574391884720-385002ec8720?auto=format&fit=crop&q=80&w=800",
        features: ["Live Music", "Bar", "Rooftop"]
    },
    {
        id: 6,
        name: "Nepal Academy Hall",
        location: "Kamaladi, Kathmandu",
        capacity: "1,200",
        type: "Theater",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1583849567104-54c348f958f0?auto=format&fit=crop&q=80&w=800",
        features: ["Auditorium", "Conference Rooms"]
    }
];

const Venues = () => {
    const [selectedType, setSelectedType] = useState("All");

    const filteredVenues = selectedType === "All"
        ? VENUES
        : VENUES.filter(venue => venue.type === selectedType);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-secondary text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10 max-w-[1200px] mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                        Discover World-Class Venues
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        From energetic stadiums to intimate theaters, find the perfect space for every experience.
                    </p>
                </div>
            </div>

            <main className="flex-grow max-w-[1200px] mx-auto px-4 py-12 w-full">

                {/* Filters */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
                    {["All", "Stadium", "Club", "Theater", "Banquet"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${selectedType === type
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Venues Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVenues.map((venue) => (
                        <Link to={`/venues/${venue.id}`} key={venue.id} className="block">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={venue.image}
                                        alt={venue.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                                        <span className="text-yellow-500">★</span> {venue.rating}
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-lg text-xs font-medium text-white">
                                        {venue.type}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                        {venue.name}
                                    </h3>

                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {venue.location}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mt-auto">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Capacity: <span className="font-bold text-gray-800">{venue.capacity}</span></span>
                                            <span className="text-primary font-bold hover:underline">View Details</span>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {venue.features.slice(0, 2).map((feat, i) => (
                                                <span key={i} className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">{feat}</span>
                                            ))}
                                            {venue.features.length > 2 && (
                                                <span className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-100">+{venue.features.length - 2} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Venues;
