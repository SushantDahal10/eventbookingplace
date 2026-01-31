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
                    // Premium date format: "Monday, Jan 26, 2026"
                    // Premium date format: "Monday, Jan 26, 2026"
                    formattedDate: new Date(data.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC' // Explicitly use UTC as DB time is absolute
                    }),
                    time: new Date(data.event_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC' // Explicitly use UTC
                    }),
                    price: data.ticket_tiers?.[0]?.price || 'N/A',
                    tags: data.tags || ['Event', 'Live', 'Nepal'],
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-dim">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-secondary font-bold animate-pulse">Fetching magic...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-dim">
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm">
                    <div className="text-6xl mb-6">🏜️</div>
                    <h2 className="text-2xl font-black text-secondary mb-4">Event not found</h2>
                    <p className="text-gray-500 mb-8">It seems this event has disappeared into the void.</p>
                    <button onClick={() => navigate('/events')} className="btn-primary px-8 w-full">Back to Events</button>
                </div>
            </div>
        );
    }

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
    const isSoldOut = event.ticket_tiers?.reduce((acc, tier) => acc + (tier.available_quantity || 0), 0) === 0;

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow">
                {/* 1. Hero Section - Premium Immersive Look */}
                <div className="relative h-[75vh] min-h-[600px] w-full overflow-hidden">
                    {/* Background Image with Parallax-like brightness control */}
                    <div className="absolute inset-0">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-transparent"></div>
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>

                    {/* Back Button Floating */}
                    <button
                        onClick={() => navigate('/events')}
                        className="absolute top-10 left-4 md:left-10 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full text-white transition-all border border-white/20 group hover:scale-110"
                        title="Back to Events"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    {/* Hero Content - Centered & Powerful */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24 md:pb-32">
                        <div className="flex flex-wrap gap-3 mb-8 animate-[slideUp_0.8s]">
                            <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 text-primary font-black text-xs tracking-widest uppercase">
                                {event.tags?.[1] || "FEATURED"}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs tracking-widest uppercase">
                                {event.city || "Event Location"}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white mb-8 leading-[0.9] drop-shadow-2xl max-w-4xl animate-[slideUp_1s]">
                            {event.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 md:gap-12 animate-[slideUp_1.2s] delay-300">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-primary transition-colors">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <div>
                                    <h4 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Date & Day</h4>
                                    <p className="text-white text-lg font-bold">{event.formattedDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-primary transition-colors">
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <div>
                                    <h4 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Starts At</h4>
                                    <p className="text-white text-lg font-bold">{event.time}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 group-hover:bg-primary transition-colors">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div>
                                    <h4 className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Venue</h4>
                                    <p className="text-white text-lg font-bold">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Main Content Layout with Sticky Booking */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* LEFT WING: Detailed Info */}
                        <div className="lg:col-span-8 space-y-16 pt-12">

                            {/* About Section */}
                            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                    <h3 className="text-3xl font-heading font-black text-secondary uppercase tracking-tight">The Experience</h3>
                                </div>
                                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium whitespace-pre-line">
                                    {event.description}
                                </div>
                            </section>

                            {/* Organizer Details */}
                            <section className="bg-secondary p-8 md:p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 border border-white/10">
                                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl border border-white/20">
                                    🎭
                                </div>
                                <div className="text-center md:text-left flex-grow">
                                    <h4 className="text-primary font-black uppercase text-xs tracking-widest mb-2">Presented By</h4>
                                    <h3 className="text-2xl font-heading font-extrabold mb-2">{event.partners?.organization_name || "NepalShows Partnership"}</h3>
                                    <p className="text-white/60 text-sm max-w-md">Expect nothing but the highest quality organization and unmatched entertainment for this special event.</p>
                                </div>
                            </section>

                            {/* Gallery - Modern Layout */}
                            {event.gallery && event.gallery.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                                        <h3 className="text-3xl font-heading font-black text-secondary uppercase tracking-tight">Glimpse of Magic</h3>
                                    </div>
                                    <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                        {event.gallery.map((img, idx) => (
                                            <div key={idx} className="break-inside-avoid rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100">
                                                <img
                                                    src={img}
                                                    alt={`Scene ${idx}`}
                                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Promo/Assurance Badge - Moved to correct column */}
                            <div className="mt-8 bg-primary/5 border border-primary/20 p-6 rounded-3xl flex items-center gap-4">
                                <div className="text-3xl">🛡️</div>
                                <div>
                                    <h5 className="font-black text-secondary text-sm">NepalShows Assurance</h5>
                                    <p className="text-xs text-secondary/60 font-medium">100% genuine tickets and guaranteed access or your money back.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT WING: The Checkout Card (Sticky) */}
                        <div className="lg:col-span-4 relative">
                            <div className="sticky top-32 lg:-mt-64 z-30">
                                <div className="bg-white rounded-[2.5rem] p-1 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                                    {/* Card Header Header */}
                                    <div className="bg-gray-50 p-8 text-center border-b border-gray-100">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Starting At Just</h4>
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-2xl font-black text-secondary mb-3">Rs.</span>
                                            <span className="text-6xl md:text-7xl font-heading font-black text-secondary tracking-tighter">{event.price}</span>
                                        </div>
                                        <p className="text-primary font-bold text-sm bg-primary/10 inline-block px-4 py-1 rounded-full mt-2">Best Price Guaranteed</p>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-4 text-sm font-bold text-gray-600">
                                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                                Instant Digital Ticket Delivery
                                            </li>
                                            <li className="flex items-center gap-4 text-sm font-bold text-gray-600">
                                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                                Official & Verified Merchant
                                            </li>
                                            <li className="flex items-center gap-4 text-sm font-bold text-gray-600">
                                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">✓</span>
                                                Multiple Ticket Tiers Available
                                            </li>
                                        </ul>

                                        <button
                                            onClick={() => {
                                                if (user) {
                                                    navigate(`/booking/${event.id}`);
                                                } else {
                                                    navigate('/login', { state: { from: location } });
                                                }
                                            }}
                                            disabled={isSoldOut || isBookingClosed}
                                            className={`w-full group relative p-6 rounded-3xl font-black text-xl shadow-2xl transition-all overflow-hidden ${isSoldOut || isBookingClosed
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                                : 'bg-primary hover:bg-primary-dark text-white shadow-primary/40 hover:-translate-y-1 active:scale-95'
                                                }`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                {isSoldOut ? "Sold Out" : isBookingClosed ? "Booking Window Passed" : "Book Your Spot"}
                                                {!isSoldOut && !isBookingClosed && <span>→</span>}
                                            </span>
                                            {!isSoldOut && !isBookingClosed && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            )}
                                        </button>
                                        <div className="flex items-center justify-center gap-3 opacity-40">
                                            <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Secure Checkout</span>
                                            <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Blocking Modal for 12hr Restriction AND Sold Out */}
            {((isBookingClosed && diff > 0 && !isSoldOut) || isSoldOut) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-secondary/60 backdrop-blur-md"></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl animate-[scaleIn_0.3s] border border-gray-100">
                        <div className={`w-20 h-20 ${isSoldOut ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                            {isSoldOut ? (
                                <span className="text-4xl">🚫</span>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>

                        <h2 className="text-2xl font-heading font-black text-gray-900 mb-4">
                            {isSoldOut ? "Event Sold Out" : "Booking Window Closed"}
                        </h2>

                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {isSoldOut
                                ? "We apologize, but all tickets for this event have been fully booked. Please stay tuned for future events."
                                : "Online reservations are no longer available as the event begins in less than 12 hours. Please contact the venue directly for last-minute inquiries."
                            }
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className={`w-full font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-xl ${isSoldOut
                                    ? "bg-gray-800 text-white shadow-gray-500/30 hover:bg-gray-900"
                                    : "bg-primary hover:bg-primary-dark text-white shadow-primary/30"
                                }`}
                        >
                            Go to Homepage
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default EventDetails;
