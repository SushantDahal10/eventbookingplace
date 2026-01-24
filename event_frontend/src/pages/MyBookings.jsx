import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

const TicketModal = ({ booking, onClose }) => {
    if (!booking) return null;

    // Handle ticket_type whether it's an array, a JSON string, a wrapped object, or legacy text
    let tickets = [];
    try {
        const rawType = booking.ticket_type;
        if (Array.isArray(rawType)) {
            tickets = rawType;
        } else if (typeof rawType === 'object' && rawType !== null && rawType.tickets) {
            tickets = rawType.tickets;
        } else if (typeof rawType === 'string' && rawType.startsWith('[')) {
            tickets = JSON.parse(rawType);
        } else if (typeof rawType === 'string' && rawType.startsWith('{')) {
            const parsed = JSON.parse(rawType);
            tickets = parsed.tickets || [parsed];
        } else {
            tickets = [{ name: rawType || 'Mixed', quantity: booking.quantity, price: booking.total_amount }];
        }
    } catch (e) {
        tickets = [{ name: booking.ticket_type || 'Mixed', quantity: booking.quantity, price: booking.total_amount }];
    }

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
                        <h3 className="text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">{booking.event_title}</h3>
                        <p className="text-white/80 text-sm font-medium drop-shadow-md">{booking.event_location}</p>
                    </div>
                </div>
                <div className="bg-white rounded-t-3xl -mt-4 relative z-10 p-6 pb-8">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full"></div>
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                            <p className="text-gray-900 font-bold">{booking.event_date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                            <p className={`font-bold ${booking.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.status}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
                        <QRCodeCanvas value={booking.transaction_uuid} size={150} level="H" />
                        <p className="text-xs text-center text-gray-500 mt-4 font-mono">{booking.transaction_uuid.substring(0, 8)}...</p>
                        <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest mt-1">Transaction ID</p>
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                        {tickets.map((t, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">{t.name} x {t.quantity}</span>
                                <span className="font-bold text-gray-800">Rs. {t.price * t.quantity}</span>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-extrabold text-primary text-lg">Rs. {booking.total_amount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // For MVP, we might show all or filter if we had date logic
    const [selectedTicket, setSelectedTicket] = useState(null);

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

    // Simple filter logic (Since we store raw date strings, comparison is hard. Showing all for now or mock filter)
    const filteredBookings = bookings;

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

                {loading ? (
                    <div className="text-center py-20">Loading your tickets...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fade-in-up]">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <div key={booking.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col">
                                    <div className="h-40 relative cursor-pointer bg-secondary" onClick={() => setSelectedTicket(booking)}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-40"></div>
                                        <div className="absolute inset-0 flex items-end p-6">
                                            <div>
                                                <h3 className="text-white font-bold text-xl leading-tight mb-1">{booking.event_title}</h3>
                                                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{booking.event_location}</p>
                                            </div>
                                        </div>
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${booking.status === 'COMPLETED' ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-yellow-500/20 text-yellow-100 border border-yellow-400/30'}`}>
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
                                                <p className="font-bold text-gray-900">{booking.event_date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                                                <p className="font-bold text-gray-900">Rs. {booking.total_amount}</p>
                                            </div>
                                        </div>

                                        <button onClick={() => setSelectedTicket(booking)} className="w-full bg-gray-50 hover:bg-primary/5 text-secondary hover:text-primary border border-gray-100 hover:border-primary/20 py-2.5 rounded-xl text-sm font-bold transition-all">
                                            View Ticket
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
                                <p className="text-gray-500">You haven't booked any events yet.</p>
                                <Link to="/events" className="btn-primary inline-flex px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all">
                                    Explore Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <TicketModal booking={selectedTicket} onClose={() => setSelectedTicket(null)} />
            <Footer />
        </div>
    );
};

export default MyBookings;
