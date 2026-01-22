import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const EVENTS_DATA = [
    { date: 5, title: "Rock Night", type: "concert" },
    { date: 12, title: "Comedy Special", type: "comedy" },
    { date: 15, title: "Corporate Gala", type: "private" },
    { date: 20, title: "EDM Blast", type: "concert" },
    { date: 26, title: "Charity Ball", type: "charity" },
    { date: 28, title: "Jazz Evening", type: "concert" }
];

const VenueCalendar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const startDay = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleDateClick = (day) => {
        // Navigate to booking page with selected date query param
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        navigate(`/venues/${id}/book?date=${dateStr}`);
    };

    const renderCalendarDays = () => {
        const days = [];
        // Empty slots for days before start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-gray-50/50 border border-gray-100"></div>);
        }

        // Days of month
        for (let i = 1; i <= daysInMonth; i++) {
            const event = EVENTS_DATA.find(e => e.date === i);
            const isClickable = !event; // Only empty days are clickable for booking

            days.push(
                <div
                    key={i}
                    onClick={() => isClickable && handleDateClick(i)}
                    className={`h-24 md:h-32 border border-gray-100 p-2 relative group transition-all duration-200 
                        ${event ? 'bg-gray-50' : 'bg-white cursor-pointer hover:bg-primary/5 hover:border-primary/30'}
                    `}
                >
                    <span className={`font-bold text-sm ${event ? 'text-gray-900' : 'text-gray-400 group-hover:text-primary'}`}>{i}</span>

                    {event && (
                        <div className="mt-2 p-1.5 rounded-lg bg-primary/10 border-l-2 border-primary cursor-default">
                            <p className="text-xs font-bold text-primary truncate leading-tight">{event.title}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{event.type}</p>
                        </div>
                    )}

                    {!event && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-primary bg-white px-2 py-1 rounded shadow-sm border border-primary/20">Book Now</span>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <main className="flex-grow py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
                        <div>
                            <Link to={`/venues/${id}`} className="text-primary font-bold text-sm hover:underline mb-2 inline-block">← Back to Venue</Link>
                            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">Event Calendar</h1>
                            <p className="text-text-muted mt-2">Click on an available date to book this venue.</p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-medium border border-gray-200">
                                <span className="w-2 h-2 rounded-full bg-primary"></span> Booked
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs font-medium border border-gray-200">
                                <span className="w-2 h-2 rounded-full bg-white border border-gray-300"></span> Available
                            </div>
                        </div>
                    </div>

                    {/* Calendar Container */}
                    <div className="card-premium overflow-hidden">
                        {/* Calendar Header Controls */}
                        <div className="bg-secondary p-6 flex justify-between items-center text-white">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="text-2xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 bg-gray-200 gap-px">
                            {renderCalendarDays()}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VenueCalendar;
