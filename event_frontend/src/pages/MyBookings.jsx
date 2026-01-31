import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

const TicketModal = ({ booking, onClose }) => {
    const [isResending, setIsResending] = useState(false);

    if (!booking) return null;

    const eventTitle = booking.events?.title || 'Event';
    const eventLocation = booking.events?.location || 'Location';
    // Format date if needed, assuming ISO string from DB
    const eventDate = booking.events?.event_date ? new Date(booking.events.event_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Date';

    // Add Time
    const eventTime = booking.events?.event_date ? new Date(booking.events.event_date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Time';

    const isPaid = booking.status === 'paid';

    // 2-Hour Buffer Logic (Same as parent)
    const eventTimestamp = booking.events?.event_date ? new Date(booking.events.event_date).getTime() : 0;
    const bufferTime = 2 * 60 * 60 * 1000; // 2 Hours
    const isExpired = (eventTimestamp + bufferTime) < Date.now();

    const handleResendEmail = async () => {
        try {
            setIsResending(true);
            const response = await api.post('/payment/resend-email', { bookingId: booking.id });
            if (response.data.success) {
                toast.success(response.data.message || "Ticket resent successfully!");
            } else {
                toast.error(response.data.message || "Failed to resend ticket.");
            }
        } catch (error) {
            console.error("Resend error:", error);
            const errorMsg = error.response?.data?.message || "An error occurred while resending the ticket.";
            toast.error(errorMsg);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative bg-surface-dim rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-[scaleIn_0.3s] border border-white/10">
                <div className="h-40 relative bg-secondary flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur transition-all border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">{eventTitle}</h3>
                        <p className="text-white/80 text-sm font-medium drop-shadow-md">{eventLocation}</p>
                    </div>
                </div>
                <div className="bg-white rounded-t-3xl -mt-4 relative z-10 p-6 pb-8">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full"></div>
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date & Time</p>
                            <p className="text-gray-900 font-bold">{eventDate} at {eventTime}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                            <p className={`font-bold ${isPaid ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</p>
                        </div>
                    </div>

                    {booking.transaction_id && !isExpired && isPaid ? (
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                            <QRCodeCanvas value={booking.transaction_id} size={150} level="H" />
                            <p className="text-xs text-center text-gray-500 mt-4 font-mono">{booking.transaction_id.substring(0, 8)}...</p>
                            <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest mt-1">Transaction ID</p>
                            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full"></div>
                            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full"></div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-2xl p-6 mb-6 border border-gray-200 flex flex-col items-center justify-center">
                            <span className="text-4xl mb-2">{!isPaid ? "⏳" : "🏁"}</span>
                            <p className="font-bold text-gray-500">{!isPaid ? "Payment Pending" : "Event has ended"}</p>
                            <p className="text-xs text-center text-gray-400 mt-1">{!isPaid ? "Complete payment to view QR" : "QR Code is no longer available."}</p>
                        </div>
                    )}

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {booking.booking_items && booking.booking_items.length > 0 ? (
                            booking.booking_items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{item.ticket_tiers?.tier_name || 'Ticket'}</span>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Rs. {item.ticket_tiers?.price || 0} per ticket</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-headings font-black text-secondary">x {item.quantity}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Tickets x {booking.quantity}</span>
                                <span className="font-bold text-gray-800">Rs. {booking.price_per_ticket} / each</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-2">
                            <span className="font-bold text-gray-900">Total Paid</span>
                            <span className="font-extrabold text-primary text-xl">Rs. {booking.total_amount}</span>
                        </div>
                    </div>

                    {isPaid && !isExpired && (
                        <button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-all border border-primary/20 disabled:opacity-50"
                        >
                            {isResending ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span>📧</span>
                            )}
                            Resend Ticket to Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const PendingModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-[scaleIn_0.2s]">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">⏳</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Pending</h3>
                    <p className="text-gray-600 mb-6 font-medium leading-relaxed">
                        Your payment is pending. Please fix within <span className="text-yellow-600 font-bold">10 mins</span> or book a new ticket.
                    </p>
                    <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6">
                        Note: Unpaid bookings are automatically removed from the table after 2 hours.
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors"
                    >
                        Understood
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [pendingBooking, setPendingBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    const filteredBookings = bookings.filter(booking => {
        const eventTime = new Date(booking.events?.event_date).getTime();
        const bufferTime = 2 * 60 * 60 * 1000;
        const isExpired = (eventTime + bufferTime) < Date.now();

        if (activeTab === 'upcoming') {
            return !isExpired;
        } else {
            return isExpired;
        }
    });

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                const response = await api.get(`/payment/bookings/${user.id}`);
                if (response.data.success) {
                    setBookings(response.data.bookings);
                }
            } catch (error) {
                console.error("Failed to fetch bookings", error);
                toast.error("Could not load your bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />
            <main className="flex-grow pt-28 pb-20 px-4 w-full max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-extrabold text-secondary mb-2">My Wallet</h1>
                        <p className="text-text-muted">Manage your tickets and receipts.</p>
                    </div>
                </div>

                <div className="flex gap-4 border-b border-gray-100 mb-8 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'upcoming'
                            ? 'border-primary text-secondary'
                            : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === 'history'
                            ? 'border-primary text-secondary'
                            : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        History
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading your tickets...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fade-in-up]">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => {
                                const eventTitle = booking.events?.title || 'Unknown Event';
                                const eventLocation = booking.events?.location || 'Unknown Location';
                                const eventDate = booking.events?.event_date ? new Date(booking.events.event_date).toLocaleDateString() : 'N/A';
                                const isPaid = booking.status === 'paid';

                                // Extract cover image
                                const coverImage = booking.events?.event_images?.find(img => img.image_type === 'cover')?.image_url
                                    || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1000";

                                // 2-Hour Buffer Logic
                                const eventTime = new Date(booking.events?.event_date).getTime();
                                const bufferTime = 2 * 60 * 60 * 1000; // 2 Hours in milliseconds
                                const isExpired = (eventTime + bufferTime) < Date.now();

                                return (
                                    <div key={booking.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                                        <div
                                            className={`h-40 relative cursor-pointer ${isExpired ? 'grayscale' : 'bg-secondary'}`}
                                            onClick={() => {
                                                if (!isPaid) {
                                                    setPendingBooking(booking);
                                                } else {
                                                    setSelectedTicket(booking);
                                                }
                                            }}
                                        >
                                            <img src={coverImage} alt={eventTitle} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                            <div className="absolute inset-0 flex items-end p-6">
                                                <div>
                                                    <h3 className="text-white font-bold text-xl leading-tight mb-1 drop-shadow-md">{eventTitle}</h3>
                                                    <p className="text-white/80 text-xs font-medium uppercase tracking-wider drop-shadow-sm">{eventLocation}</p>
                                                </div>
                                            </div>
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${isPaid ? 'bg-green-500/80 text-white border border-green-400/50' : 'bg-yellow-500/80 text-white border border-yellow-400/50'}`}>
                                                {booking.status}
                                            </div>
                                        </div>

                                        <div className="p-6 relative bg-white flex-grow flex flex-col">
                                            <div className="absolute -top-3 left-0 w-6 h-6 bg-surface-dim rounded-full translate-x-[-50%]"></div>
                                            <div className="absolute -top-3 right-0 w-6 h-6 bg-surface-dim rounded-full translate-x-[50%]"></div>
                                            <div className="absolute -top-0 left-4 right-4 border-t-2 border-dashed border-gray-200"></div>

                                            <div className="flex justify-between items-center mb-4 mt-2">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                                                    <p className="font-bold text-gray-900">{eventDate}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                                                    <p className="font-bold text-gray-900">Rs. {booking.total_amount}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (!isPaid) {
                                                        setPendingBooking(booking);
                                                    } else {
                                                        setSelectedTicket(booking);
                                                    }
                                                }}
                                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${isExpired
                                                    ? "bg-gray-100 text-gray-400 border border-gray-200"
                                                    : !isPaid
                                                        ? "bg-yellow-50 hover:bg-yellow-100 text-yellow-600 border border-yellow-200"
                                                        : "bg-gray-50 hover:bg-primary/5 text-secondary hover:text-primary border border-gray-100 hover:border-primary/20"
                                                    }`}
                                            >
                                                {isExpired ? "View Receipt" : (!isPaid ? "Payment Pending ⚠️" : "View Ticket")}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} tickets found</h3>
                                <p className="text-gray-500">You don't have any {activeTab} events.</p>
                                {activeTab === 'upcoming' && (
                                    <Link to="/events" className="mt-4 btn-primary inline-flex px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all">
                                        Explore Events
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
            {pendingBooking && <PendingModal onClose={() => setPendingBooking(null)} />}
            <Footer />
        </div>
    );
};

export default MyBookings;
