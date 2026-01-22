import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const MOCK_BOOKINGS = [
    {
        id: "T-10234",
        event: "KTM Rock Fest",
        location: "Dasarath Stadium",
        date: "Oct 26, 2026",
        time: "18:00",
        tickets: 2,
        type: "General Admission",
        total: 3150,
        status: "Upcoming",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=200",
        qr: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=T-10234-VALID"
    },
    {
        id: "T-9982",
        event: "Patan Comedy Night",
        location: "Patan Durbar Square",
        date: "Sep 15, 2026",
        time: "19:00",
        tickets: 1,
        type: "VIP",
        total: 2000,
        status: "Past",
        image: "https://images.unsplash.com/photo-1662999332578-1a5554de0171?auto=format&fit=crop&q=80&w=200",
        qr: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=T-9982-EXPIRED"
    }
];

const TicketModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const isPast = booking.status === 'Past';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-secondary/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="relative bg-surface-dim rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-[scaleIn_0.3s] border border-white/10">
                {/* Header Image */}
                <div className="h-40 relative">
                    <img src={booking.image} alt={booking.event} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur transition-all border border-white/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="absolute bottom-4 left-6 right-6">
                        <h3 className="text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">{booking.event}</h3>
                        <p className="text-white/80 text-sm font-medium drop-shadow-md">{booking.location}</p>
                    </div>
                </div>

                {/* Ticket Body */}
                <div className="bg-white rounded-t-3xl -mt-4 relative z-10 p-6 pb-8">
                    {/* Punch Hole Decoration top */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white/30 rounded-full"></div>

                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                            <p className="text-gray-900 font-bold">{booking.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time</p>
                            <p className="text-gray-900 font-bold">{booking.time}</p>
                        </div>
                    </div>

                    {/* QR / Status Area */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                        {isPast ? (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">Event Completed</h4>
                                <p className="text-sm text-gray-500">Thanks for attending!</p>
                                <p className="text-xs text-gray-400 mt-4">Ticket ID: {booking.id}</p>
                            </div>
                        ) : (
                            <>
                                <img src={booking.qr} alt="QR Code" className="w-48 h-48 object-contain mix-blend-multiply relative z-10" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                                <p className="text-xs font-bold text-secondary uppercase tracking-widest mt-4 bg-white px-3 py-1 rounded-full border border-gray-200 z-10">Scan at Gate</p>
                            </>
                        )}

                        {/* Cutout circles */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{booking.type} x {booking.tickets}</span>
                        <span className="font-bold text-primary text-lg">Rs. {booking.total}</span>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-3">
                    {!isPast && (
                        <button className="flex-1 btn-primary py-3 text-sm shadow-none">
                            Save Ticket
                        </button>
                    )}
                    <button className="flex-1 py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors w-full">
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewModal = ({ booking, onClose }) => {
    if (!booking) return null;
    const [rating, setRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your review!');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s]">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">How was it?</h3>
                    <p className="text-sm text-gray-500">Rate your experience at {booking.event}</p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`w-10 h-10 text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'
                                }`}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <textarea
                    placeholder="Describe your experience (optional)..."
                    className="w-full h-32 bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none text-sm"
                ></textarea>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 btn-primary py-3 shadow-none"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);

    const filteredBookings = MOCK_BOOKINGS.filter(b =>
        activeTab === 'upcoming' ? b.status === 'Upcoming' : b.status === 'Past'
    );

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow pt-28 pb-20 px-4 w-full max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-heading font-extrabold text-secondary mb-2">My Wallet</h1>
                        <p className="text-text-muted">Manage your tickets and receipts.</p>
                    </div>

                    <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm flex">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-secondary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            History
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fade-in-up]">
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                {/* Clickable Banner Trigger ticket modal only here or specific icon */}
                                <div className="h-40 overflow-hidden relative cursor-pointer" onClick={() => setSelectedTicket(booking)}>
                                    <img src={booking.image} alt={booking.event} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                        <div>
                                            <h3 className="text-white font-bold text-xl leading-tight mb-1">{booking.event}</h3>
                                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">{booking.location}</p>
                                        </div>
                                    </div>
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${booking.status === 'Upcoming' ? 'bg-green-500/20 text-green-100 border border-green-400/30' : 'bg-white/20 text-white border border-white/20'
                                        }`}>
                                        {booking.status}
                                    </div>
                                </div>

                                {/* Ticket Details stub */}
                                <div className="p-6 relative bg-white flex-grow flex flex-col">
                                    {/* Perforation Circles */}
                                    <div className="absolute -top-3 left-0 w-6 h-6 bg-surface-dim rounded-full translate-x-[-50%]"></div>
                                    <div className="absolute -top-3 right-0 w-6 h-6 bg-surface-dim rounded-full translate-x-[50%]"></div>
                                    <div className="absolute -top-0 left-4 right-4 border-t-2 border-dashed border-gray-200"></div>

                                    <div className="flex justify-between items-center mb-4 mt-2">
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                                            <p className="font-bold text-gray-900">{booking.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase">Time</p>
                                            <p className="font-bold text-gray-900">{booking.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-auto">
                                        <button
                                            onClick={() => setSelectedTicket(booking)}
                                            className="flex-1 bg-gray-50 hover:bg-primary/5 text-secondary hover:text-primary border border-gray-100 hover:border-primary/20 py-2.5 rounded-xl text-sm font-bold transition-all"
                                        >
                                            View Ticket
                                        </button>
                                        {booking.status === 'Past' && (
                                            <button
                                                onClick={() => setSelectedReview(booking)}
                                                className="px-4 bg-white hover:bg-yellow-50 text-yellow-600 border border-gray-200 hover:border-yellow-200 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-1"
                                            >
                                                <span>★</span> Rate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-gray-400">
                                🎫
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto">It looks like you haven't booked any {activeTab} events yet.</p>
                            <Link to="/events" className="btn-primary inline-flex px-8 py-3 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-1 transition-all">
                                Explore Events
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <TicketModal
                booking={selectedTicket}
                onClose={() => setSelectedTicket(null)}
            />

            <ReviewModal
                booking={selectedReview}
                onClose={() => setSelectedReview(null)}
            />

            <Footer />
        </div>
    );
};

export default MyBookings;
