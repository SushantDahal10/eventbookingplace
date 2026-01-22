import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EventCard from '../features/events/components/EventCard';

// Dummy data lookup
const getVenueById = (id) => {
    return {
        id: id,
        name: "LOD - Lord of the Drinks",
        location: "Thamel, Kathmandu",
        capacity: "2,500",
        type: "Club",
        rating: 4.9,
        reviews: 1240,
        description: "LOD is not just a club; it's a monument to nightlife. Listed among the top clubs in the world, it offers a state-of-the-art sound system, kinetic lighting, and a massive stage that has hosted global superstars. Perfect for high-energy concerts, DJ sets, and corporate parties that need a 'wow' factor.",
        whyThisVenue: {
            title: "Why Choose LOD?",
            points: [
                "World-Class Production: Features an industry-leading L-Acoustics sound system and grand lighting rig.",
                "Prime Location: Situated in the heart of Thamel, easily accessible for tourists and locals.",
                "Versatile Space: Massive dance floor, varying VIP levels, and a separate lounge area."
            ]
        },
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1200",
        gallery: [
            "https://images.unsplash.com/photo-1574391884720-385002ec8720?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600"
        ],
        features: ["Valet Parking", "VIP Box", "Live DJ", "Full Bar", "Security", "Catering"],
        contact: {
            phone: "+977-1-4XXXXXX",
            email: "booking@lodkathmandu.com"
        }
    };
};

const SIMILAR_EVENTS = [
    {
        id: 101,
        title: "Saturday Night Live",
        date: "This Saturday",
        location: "LOD, Thamel",
        category: "Music",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: 102,
        title: "Techno Rave 2026",
        date: "Next Friday",
        location: "LOD, Thamel",
        category: "Music",
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=600"
    }
];

const VenueDetails = () => {
    const { id } = useParams();
    const venue = getVenueById(id);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                {/* Immersive Hero Header */}
                <div className="relative h-[50vh] min-h-[400px]">
                    <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="max-w-[1200px] mx-auto">
                            <div className="mb-4 flex items-center gap-2">
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {venue.type}
                                </span>
                                <div className="flex items-center text-yellow-400 text-sm font-bold gap-1 bg-black/30 backdrop-blur px-2 py-1 rounded-full">
                                    <span>★</span> {venue.rating} ({venue.reviews} reviews)
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-2 leading-tight">
                                {venue.name}
                            </h1>
                            <div className="flex items-center text-gray-300 text-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {venue.location}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Why This Venue / Description */}
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">About the Space</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                {venue.description}
                            </p>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    {venue.whyThisVenue.title}
                                </h3>
                                <ul className="space-y-4">
                                    {venue.whyThisVenue.points.map((point, i) => (
                                        <li key={i} className="flex gap-4 items-start">
                                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center font-bold text-sm mt-0.5">
                                                {i + 1}
                                            </span>
                                            <span className="text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Amenities & Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {venue.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery */}
                        <section>
                            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-6">Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {venue.gallery.map((img, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden h-48 group">
                                        <img
                                            src={img}
                                            alt={`Gallery ${i}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Upcoming Events Here */}
                        <section>
                            <div className="flex justify-between items-end mb-6">
                                <h2 className="text-2xl font-heading font-bold text-gray-900">Upcoming Events Here</h2>
                                <a href="#" className="hidden md:inline-flex items-center text-primary font-bold hover:underline">
                                    See Calendar
                                </a>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {SIMILAR_EVENTS.map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Stats & Contact */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold font-heading mb-6 border-b border-gray-100 pb-4">Venue Info</h3>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Total Capacity</span>
                                    <span className="text-3xl font-bold text-gray-900">{venue.capacity}</span>
                                    <span className="text-gray-400 text-sm ml-1">people</span>
                                </div>

                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Contact</span>
                                    <p className="font-medium text-gray-900 truncate">{venue.contact.phone}</p>
                                    <p className="font-medium text-gray-900 truncate hover:text-primary cursor-pointer">{venue.contact.email}</p>
                                </div>

                                <div>
                                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Address</span>
                                    <p className="font-medium text-gray-900">{venue.location}</p>
                                    <div className="mt-2 h-32 bg-gray-200 rounded-lg w-full flex items-center justify-center text-gray-500 text-xs">
                                        Map Placeholder
                                    </div>
                                </div>
                            </div>

                            <button className="w-full bg-secondary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg transform active:scale-95 mb-4">
                                Book This Venue
                            </button>
                            <button className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-bold py-4 rounded-xl transition-all">
                                Download Floor Plan
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VenueDetails;
