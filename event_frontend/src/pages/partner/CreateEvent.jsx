import React, { useState } from 'react';
import PartnerNavbar from '../../components/layout/PartnerNavbar';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('details');

    const [eventData, setEventData] = useState({
        title: '',
        category: 'Music',
        date: '',
        time: '',
        venue: '',
        address: '',
        description: '',
        ticketTypes: [
            { name: 'General Admission', price: 1000, quantity: 100 }
        ]
    });

    const handleTicketChange = (index, field, value) => {
        const newTickets = [...eventData.ticketTypes];
        newTickets[index][field] = value;
        setEventData({ ...eventData, ticketTypes: newTickets });
    };

    const addTicketType = () => {
        setEventData({
            ...eventData,
            ticketTypes: [...eventData.ticketTypes, { name: '', price: 0, quantity: 0 }]
        });
    };

    const removeTicketType = (index) => {
        const newTickets = eventData.ticketTypes.filter((_, i) => i !== index);
        setEventData({ ...eventData, ticketTypes: newTickets });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Event '" + eventData.title + "' created successfully! It is now pending review.");
        navigate('/partner/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-body pb-20">
            <PartnerNavbar />

            <main className="pt-24 px-4 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-extrabold text-secondary">Create New Event</h1>
                        <p className="text-gray-500">Fill in the details to list your event on NepaliShows.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column - Form */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. Basic Details */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                                Basic Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Grand Music Festival 2026"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={eventData.title}
                                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={eventData.category}
                                            onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                        >
                                            <option>Music</option>
                                            <option>Comedy</option>
                                            <option>Workshop</option>
                                            <option>Sports</option>
                                            <option>Theater</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Primary Language</label>
                                        <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                                            <option>Nepali</option>
                                            <option>English</option>
                                            <option>Newari</option>
                                            <option>Hindi</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows="4"
                                        placeholder="Tell people what makes your event special..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                        value={eventData.description}
                                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* 2. Date & Venue */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">2</span>
                                Date & Location
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={eventData.date}
                                        onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={eventData.time}
                                        onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Venue Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. LOD, Dasarath Stadium"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={eventData.venue}
                                        onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                                    <input
                                        type="text"
                                        placeholder="Street Address, City"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={eventData.address}
                                        onChange={(e) => setEventData({ ...eventData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Ticketing */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">3</span>
                                Tickets
                            </h3>

                            <div className="space-y-4">
                                {eventData.ticketTypes.map((ticket, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Ticket Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. VIP"
                                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary outline-none"
                                                value={ticket.name}
                                                onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Price (Rs.)</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary outline-none"
                                                value={ticket.price}
                                                onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Quantity</label>
                                            <input
                                                type="number"
                                                placeholder="100"
                                                className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 focus:border-primary outline-none"
                                                value={ticket.quantity}
                                                onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                                            />
                                        </div>

                                        {eventData.ticketTypes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTicketType(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addTicketType}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>+</span> Add Another Ticket Type
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column - Preview & Actions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Publishing Rules */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                                <h4 className="font-bold text-blue-800 mb-2">Publishing Checklist</h4>
                                <ul className="space-y-2 text-sm text-blue-700">
                                    <li className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${eventData.title ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        Event Title
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${eventData.date ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        Date & Time
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${eventData.venue ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        Location
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${eventData.ticketTypes[0].name ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                        At least 1 ticket type
                                    </li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-gray-500">Total Capacity</span>
                                    <span className="font-bold text-gray-900">
                                        {eventData.ticketTypes.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0)}
                                    </span>
                                </div>
                                <button className="w-full btn-primary py-4 mb-3 shadow-xl">
                                    Publish Event
                                </button>
                                <button type="button" onClick={() => navigate('/partner/dashboard')} className="w-full py-3 text-gray-500 font-bold hover:text-gray-900">
                                    Save Draft & Exit
                                </button>
                            </div>

                        </div>
                    </div>

                </form>
            </main>
        </div>
    );
};

export default CreateEvent;
