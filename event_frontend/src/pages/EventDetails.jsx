import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                const data = response.data.event;

                // Extract images
                const coverImage = data.event_images?.find(img => img.image_type === 'cover')?.image_url || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000";
                const galleryImages = data.event_images?.filter(img => img.image_type === 'gallery').map(img => img.image_url) || [];

                // Normalize data
                setEvent({
                    ...data,
                    date: new Date(data.event_date).toLocaleDateString(),
                    time: new Date(data.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: data.ticket_tiers?.[0]?.price || 'N/A', // Show first tier price as base
                    tags: ['Event', 'Live', 'Nepal'],
                    image: coverImage,
                    gallery: galleryImages,
                    description: data.description || "No description provided."
                });
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-bold">Event not found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <div className="bg-white shadow-sm z-50 relative">
                <Navbar />
            </div>

            <main className="flex-grow">
                {/* 1. Hero Section */}
                <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/events')}
                        className="absolute top-28 left-4 z-50 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white font-bold flex items-center gap-2 transition-all border border-white/20"
                    >
                        ← Back to Events
                    </button>

                    {/* Background Image - Clean visible image */}
                    <div className="absolute inset-0">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* Hero Content - Prominent Date & Time */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {/* Tags/Category */}
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white font-bold text-sm tracking-wide shadow-lg">
                                #{event.tags?.[1] || "Event"}
                            </span>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-sm tracking-wide border border-white/30">
                                {event.partners?.organization_name || "Organizer"}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-6 leading-tight drop-shadow-lg">
                            {event.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                                <span className="text-4xl">📅</span>
                                <div>
                                    <div className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Date & Time</div>
                                    <div className="text-white text-2xl md:text-3xl font-black">{event.date}</div>
                                    <div className="text-white/90 text-xl font-bold">{event.time}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                                <span className="text-4xl">📍</span>
                                <div>
                                    <div className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Location</div>
                                    <div className="text-white text-xl md:text-2xl font-bold leading-tight">{event.location}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT: Description & Gallery */}
                        <div className="lg:col-span-2 space-y-10 pt-10">

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-secondary border-l-4 border-primary pl-4">About This Event</h3>
                                <p className="text-lg text-text-muted leading-relaxed whitespace-pre-line">
                                    {event.description}
                                </p>
                            </div>

                            {/* Gallery */}
                            {event.gallery && event.gallery.length > 0 && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-secondary border-l-4 border-primary pl-4">Gallery</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {event.gallery.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`Gallery ${idx}`}
                                                className="w-full h-64 object-cover rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Booking Action Card (Sticky) */}
                        <div className="relative">
                            <div className="sticky top-24 bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 -mt-20 lg:-mt-32">
                                <div className="text-center mb-6">
                                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">Tickets Starting From</p>
                                    <h2 className="text-4xl md:text-5xl font-black text-primary">
                                        Rs. {event.price}
                                        <span className="text-lg text-gray-400 font-normal ml-1 align-baseline">/pax</span>
                                    </h2>
                                </div>

                                {/* Available Tiers Preview - Removed as per user request to simpler UI */}

                                <div className="mb-8"></div> {/* Spacer */}

                                <button
                                    onClick={() => {
                                        if (user) {
                                            navigate(`/booking/${event.id}`);
                                        } else {
                                            navigate('/login', { state: { from: location } });
                                        }
                                    }}
                                    className="block w-full btn-primary py-4 text-center text-xl font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all rounded-2xl relative z-20"
                                >
                                    Book Ticket Now ➜
                                </button>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                    <span>🔒 Secure Payment via eSewa</span>
                                    <span>•</span>
                                    <span>⚡ Instant Confirmation</span>
                                </div>
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
