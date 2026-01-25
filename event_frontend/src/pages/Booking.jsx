import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';


const Booking = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // State
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketCounts, setTicketCounts] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('esewa');
    const [checkoutDetails, setCheckoutDetails] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: ''
    });

    // Fetch Event Data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${eventId}`);
                if (response.data.success) {
                    const eventData = response.data.event;

                    // Extract cover image
                    const coverImage = eventData.event_images?.find(img => img.image_type === 'cover')?.image_url || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000";

                    setEvent({
                        ...eventData,
                        image: coverImage
                    });

                    // Initialize counts for each tier
                    const initialCounts = {};
                    if (eventData.ticket_tiers) {
                        eventData.ticket_tiers.forEach(tier => {
                            initialCounts[tier.id] = 0;
                        });
                    }
                    setTicketCounts(initialCounts);
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
                toast.error("Failed to load event details");
            } finally {
                setLoading(false);
            }
        };
        if (eventId) fetchEvent();
    }, [eventId]);

    // Handle early returns
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

    // Derived values
    const subtotal = event.ticket_tiers ? event.ticket_tiers.reduce((total, tier) => {
        return total + (Number(tier.price) * (ticketCounts[tier.id] || 0));
    }, 0) : 0;

    const totalTickets = Object.values(ticketCounts).reduce((a, b) => a + b, 0);
    const serviceFee = 0; // Backend handles fees or set to 0 strictly
    const total = subtotal + serviceFee;

    const handleCountChange = (tierId, delta) => {
        // Check available quantity
        const tier = event.ticket_tiers.find(t => t.id === tierId);
        const currentCount = ticketCounts[tierId] || 0;
        const newCount = Math.max(0, currentCount + delta);

        if (newCount > tier.available_quantity) {
            toast.error(`Only ${tier.available_quantity} tickets available`);
            return;
        }

        setTicketCounts(prev => ({
            ...prev,
            [tierId]: newCount
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCheckoutDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to book tickets");
            navigate('/login');
            return;
        }

        if (totalTickets === 0) {
            toast.error("Please select at least one ticket");
            return;
        }

        // Validate Attendee Details
        if (!checkoutDetails.fullName || !checkoutDetails.email || !checkoutDetails.phoneNumber) {
            toast.error("Please fill in all attendee details (Name, Email, Phone)");
            // Optional: scroll to the form
            document.getElementById('attendee-details')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (paymentMethod === 'esewa') {
            try {
                const toastId = toast.loading("Initiating eSewa Payment...");

                // Construct Booking Items
                const bookingItems = Object.entries(ticketCounts)
                    .filter(([_, qty]) => qty > 0)
                    .map(([tierId, qty]) => ({
                        tierId,
                        quantity: qty
                    }));

                const response = await api.post('/payment/esewa/initiate', {
                    bookingItems,
                    eventId: event.id,
                    userId: user.id,
                    amount: total, // For reference/validation only
                    serviceCharge: 0,
                    deliveryCharge: 0,
                    taxAmount: 0,
                });

                if (response.data.success) {
                    const params = response.data.paymentData;
                    const form = document.createElement("form");
                    form.setAttribute("method", "POST");
                    form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

                    for (const key in params) {
                        const hiddenField = document.createElement("input");
                        hiddenField.setAttribute("type", "hidden");
                        hiddenField.setAttribute("name", key);
                        hiddenField.setAttribute("value", params[key]);
                        form.appendChild(hiddenField);
                    }

                    document.body.appendChild(form);
                    form.submit();
                    toast.dismiss(toastId);
                } else {
                    toast.error(response.data.message || "Failed to initiate payment", { id: toastId });
                }
            } catch (error) {
                console.error("Payment Error", error);
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }
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
                                    {event.ticket_tiers && event.ticket_tiers.map(tier => (
                                        <div key={tier.id} className={`flex justify-between items-center p-4 rounded-xl border transition-all ${ticketCounts[tier.id] > 0 ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-white border-gray-100'}`}>
                                            <div className="flex-grow">
                                                <div className="font-bold text-gray-900 text-lg">{tier.tier_name}</div>
                                                <div className="text-sm font-medium mt-1">
                                                    {tier.available_quantity > 20 ? (
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            Selling Fast <span className="text-lg">🔥</span>
                                                        </span>
                                                    ) : tier.available_quantity > 0 ? (
                                                        <span className="text-orange-600 font-bold flex items-center gap-1">
                                                            Only {tier.available_quantity} left <span className="text-lg">⚡</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-500 font-bold">Sold Out ❌</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3">
                                                <span className="font-headings font-black text-xl text-secondary">Rs. {tier.price}</span>
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                                    <button
                                                        onClick={() => handleCountChange(tier.id, -1)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-primary transition-colors disabled:opacity-50"
                                                        disabled={!ticketCounts[tier.id]}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-bold w-6 text-center text-lg">{ticketCounts[tier.id] || 0}</span>
                                                    <button
                                                        onClick={() => handleCountChange(tier.id, 1)}
                                                        className="w-9 h-9 flex items-center justify-center rounded-md bg-primary text-white shadow-md hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={ticketCounts[tier.id] >= tier.available_quantity}
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
                            <div id="attendee-details" className="card-premium p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-secondary flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
                                        Attendee Details
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={checkoutDetails.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={checkoutDetails.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={checkoutDetails.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="+977 9800000000"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
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

                                <div className="grid grid-cols-1 gap-4">
                                    <button
                                        onClick={() => setPaymentMethod('esewa')}
                                        className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all border-primary bg-primary/5`}
                                    >
                                        <div className="font-bold text-green-600 text-lg">eSewa</div>
                                        <span className="text-sm text-gray-500">Fast & Secure Mobile Wallet Payment</span>
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
                                        <img src={event.image || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000"} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 line-clamp-2 leading-tight mb-1">{event.title}</h4>
                                            <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">{event.location}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600">
                                        {event.ticket_tiers && event.ticket_tiers.map(tier => (
                                            ticketCounts[tier.id] > 0 && (
                                                <div key={tier.id} className="flex justify-between">
                                                    <span>{ticketCounts[tier.id]} x {tier.tier_name}</span>
                                                    <span className="font-medium">Rs. {Number(tier.price) * ticketCounts[tier.id]}</span>
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
                                        {user ? `Pay Rs. ${total}` : 'Login to Continue'}
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
