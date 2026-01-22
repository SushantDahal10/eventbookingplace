import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Mock Data Lookup (Simulating organizer-defined types)
const getEventById = (id) => {
    return {
        id: id,
        title: "KTM Rock Fest",
        date: "Oct 26, 2026",
        time: "18:00 PM",
        location: "Dasarath Stadium, KTM",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600",
        ticketTypes: [
            { id: 'gen', name: 'General Admission', price: 1500, desc: 'Standard entry to the ground' },
            { id: 'fan', name: 'Fanpit', price: 3000, desc: 'Front row experience standing' },
            { id: 'vip', name: 'VIP Seated', price: 5000, desc: 'Reserved seating with food included' }
        ]
    };
};

const Booking = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const event = getEventById(eventId);

    // State now tracks count for EACH ticket type: { gen: 0, fan: 2, vip: 0 }
    const [ticketCounts, setTicketCounts] = useState(
        event.ticketTypes.reduce((acc, type) => ({ ...acc, [type.id]: 0 }), {})
    );
    const [paymentMethod, setPaymentMethod] = useState('esewa');

    // Derived values
    const subtotal = event.ticketTypes.reduce((total, type) => {
        return total + (type.price * (ticketCounts[type.id] || 0));
    }, 0);

    // Ensure at least one ticket is selected to proceed
    const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);

    const serviceFee = Math.round(subtotal * 0.05); // 5% fee
    const total = subtotal + serviceFee;

    const handleCountChange = (typeId, delta) => {
        setTicketCounts(prev => ({
            ...prev,
            [typeId]: Math.max(0, (prev[typeId] || 0) + delta)
        }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        if (totalTickets === 0) {
            alert("Please select at least one ticket.");
            return;
        }
        alert(`Processing payment of Rs. ${total} via ${paymentMethod} for ${event.title}`);
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-8">
                        <Link to={`/events/${eventId}`} className="text-text-muted hover:text-primary transition-colors flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Event
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary">Secure Checkout</h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* LEFT COLUMN - STEPS */}
                        <div className="w-full lg:w-2/3 space-y-8">

                            {/* Step 1: Tickets */}
                            <div className="card-premium p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-secondary flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                                        Select Tickets
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    {event.ticketTypes.map(type => (
                                        <div key={type.id} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${ticketCounts[type.id] > 0 ? 'bg-primary/5 border-primary/30' : 'bg-gray-50 border-gray-100'}`}>
                                            <div>
                                                <div className="font-bold text-gray-900">{type.name}</div>
                                                <div className="text-sm text-gray-500">{type.desc}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-gray-900">Rs. {type.price}</span>
                                                <div className="flex items-center gap-3 bg-white rounded-lg p-1 border border-gray-200">
                                                    <button
                                                        onClick={() => handleCountChange(type.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-bold w-4 text-center">{ticketCounts[type.id]}</span>
                                                    <button
                                                        onClick={() => handleCountChange(type.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step 2: Details */}
                            <div className="card-premium p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-secondary flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                                        Attendee Details
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                        <input type="tel" placeholder="+977 9800000000" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Payment */}
                            <div className="card-premium p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-secondary flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
                                        Payment Method
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('esewa')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'esewa' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="font-bold text-green-600">eSewa</div>
                                        <span className="text-xs text-gray-500">Mobile Wallet</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('khalti')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'khalti' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="font-bold text-purple-600">Khalti</div>
                                        <span className="text-xs text-gray-500">Mobile Wallet</span>
                                    </button>
                                    <button
                                        onClick={() => setPaymentMethod('card')}
                                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                    >
                                        <div className="font-bold text-blue-600">Card</div>
                                        <span className="text-xs text-gray-500">Visa / Mastercard</span>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="w-full lg:w-1/3">
                            <div className="sticky top-24 space-y-6">
                                <div className="card-premium p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Order Summary</h3>

                                    <div className="flex gap-4 mb-6">
                                        <img src={event.image} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{event.title}</h4>
                                            <p className="text-sm text-gray-500">{event.date}</p>
                                            <p className="text-sm text-gray-500">{event.location}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        {event.ticketTypes.map(type => (
                                            ticketCounts[type.id] > 0 && (
                                                <div key={type.id} className="flex justify-between">
                                                    <span>{ticketCounts[type.id]} x {type.name}</span>
                                                    <span className="font-medium">Rs. {type.price * ticketCounts[type.id]}</span>
                                                </div>
                                            )
                                        ))}
                                        {totalTickets === 0 && <span className="text-gray-400 italic">No tickets selected</span>}

                                        <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                            <span>Service Fee (5%)</span>
                                            <span className="font-medium">Rs. {serviceFee}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Total</span>
                                        <span className="font-bold text-primary text-xl">Rs. {total}</span>
                                    </div>

                                    <button onClick={handleCheckout} disabled={totalTickets === 0} className="w-full btn-primary py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Pay Rs. {total}
                                    </button>

                                    <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Secure Payment
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

export default Booking;
