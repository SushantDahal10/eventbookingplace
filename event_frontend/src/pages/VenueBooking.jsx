import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

// Mock Data
const getVenueById = (id) => {
    return {
        id: id,
        name: "LOD - Lord of the Drinks",
        location: "Thamel, Kathmandu",
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1200",
        rates: {
            hourly: 5000,
            daily: 50000
        }
    };
};

const VenueBooking = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const navigate = useNavigate();
    const venue = getVenueById(id);

    // Form State
    const [bookingType, setBookingType] = useState('hourly'); // 'hourly' | 'multiday'
    const [eventType, setEventType] = useState('Concert');

    // Hourly State
    const [date, setDate] = useState(initialDate);
    const [startTime, setStartTime] = useState('18:00');
    const [endTime, setEndTime] = useState('23:00');

    // Multi-day State
    const [startDate, setStartDate] = useState(initialDate);
    const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);

    // Cost Calculation
    const [totalCost, setTotalCost] = useState(0);
    const [durationLabel, setDurationLabel] = useState("");

    useEffect(() => {
        let cost = 0;
        if (bookingType === 'hourly') {
            const start = parseInt(startTime.split(':')[0]);
            const end = parseInt(endTime.split(':')[0]);
            let hours = end - start;
            if (hours <= 0) hours += 24; // Handle overnight simply
            cost = hours * venue.rates.hourly;
            setDurationLabel(`${hours} Hours`);
        } else {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
            cost = diffDays * venue.rates.daily;
            setDurationLabel(`${diffDays} Days`);
        }
        setTotalCost(cost);
    }, [bookingType, startTime, endTime, startDate, endDate, venue.rates]);

    const handleCheckout = (e) => {
        e.preventDefault();
        toast.success(`Request sent for ${venue.name} (${durationLabel}) for Rs. ${totalCost}`);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <Link to={`/venues/${id}/calendar`} className="text-text-muted hover:text-primary transition-colors flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Calendar
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary">Book Venue</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* LEFT COLUMN - CONFIGURATION */}
                        <div className="w-full lg:w-2/3 space-y-8">

                            {/* Step 1: Duration Type */}
                            <div className="card-premium p-8">
                                <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                                    Booking Duration
                                </h2>

                                <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                                    <button
                                        onClick={() => setBookingType('hourly')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${bookingType === 'hourly'
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Specific Time Slots
                                    </button>
                                    <button
                                        onClick={() => setBookingType('multiday')}
                                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${bookingType === 'multiday'
                                            ? 'bg-white text-primary shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Full Days / Multi-Day
                                    </button>
                                </div>

                                {bookingType === 'hourly' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s]">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => setStartTime(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.3s]">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">End Date (Inclusive)</label>
                                            <input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Event Details */}
                            <div className="card-premium p-8">
                                <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                                    Event Details
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                                        <select
                                            value={eventType}
                                            onChange={(e) => setEventType(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        >
                                            <option>Concert</option>
                                            <option>Wedding</option>
                                            <option>Conference</option>
                                            <option>Private Party</option>
                                            <option>Exhibition</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Requirements</label>
                                        <textarea
                                            placeholder="Tell us about special requests (catering, security, etc)..."
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none h-32"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Organizer Info */}
                            <div className="card-premium p-8">
                                <h2 className="text-xl font-bold text-secondary mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
                                    Organizer Info
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Organization Name" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                                    <input type="tel" placeholder="Contact Number" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-24 space-y-6">
                                <div className="card-premium p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Price Breakdown</h3>

                                    <div className="flex gap-4 mb-6">
                                        <img src={venue.image} alt={venue.name} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{venue.name}</h4>
                                            <p className="text-sm text-gray-500">{venue.location}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Rate Type</span>
                                            <span className="font-medium text-gray-900 capitalize">{bookingType}</span>
                                        </div>
                                        {bookingType === 'hourly' ? (
                                            <>
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Base Rate</span>
                                                    <span>Rs. {venue.rates.hourly}/hr</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Duration</span>
                                                    <span className="font-medium">{durationLabel}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Base Rate</span>
                                                    <span>Rs. {venue.rates.daily}/day</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Total Days</span>
                                                    <span className="font-medium">{durationLabel}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                            <span>Subtotal</span>
                                            <span className="font-medium">Rs. {totalCost}</span>
                                        </div>
                                        <div className="flex justify-between text-green-600 font-medium">
                                            <span>Deposit Required (20%)</span>
                                            <span>Rs. {totalCost * 0.2}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Est. Total</span>
                                        <span className="font-bold text-primary text-xl">Rs. {totalCost}</span>
                                    </div>

                                    <button onClick={handleCheckout} className="w-full btn-primary py-4 mt-2">
                                        Send Request
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4 leading-normal">
                                        You are only paying the deposit now. The rest changes based on final amenities.
                                    </p>
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

export default VenueBooking;
