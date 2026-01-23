import React from 'react';
import PartnerNavbar from '../../components/layout/PartnerNavbar';
import { Link } from 'react-router-dom';

const PartnerDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-body">
            <PartnerNavbar />

            <main className="pt-24 pb-12 px-4 max-w-[1400px] mx-auto">
                <div className="flex justify-between items-end mb-8 animate-[fadeIn_0.5s]">
                    <div>
                        <h1 className="text-3xl font-heading font-extrabold text-secondary">Dashboard</h1>
                        <p className="text-gray-500">Welcome back, Acme Events! Here's what's happening today.</p>
                    </div>
                    <Link to="/partner/create" className="btn-primary py-3 px-6 shadow-xl shadow-primary/20 flex items-center gap-2">
                        <span>➕</span> Create New Event
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-[slideUp_0.5s]">
                    {[
                        { label: 'Total Revenue', value: 'Rs. 12.5L', change: '+15%', color: 'from-green-500 to-green-700', icon: '💰' },
                        { label: 'Tickets Sold', value: '1,240', change: '+8%', color: 'from-blue-500 to-blue-700', icon: '🎟️' },
                        { label: 'Page Views', value: '45.2K', change: '+22%', color: 'from-purple-500 to-purple-700', icon: '👁️' },
                        { label: 'Upcoming Events', value: '3', change: 'Active', color: 'from-orange-500 to-orange-700', icon: '📅' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
                                <p className="text-xs font-bold text-green-600 mt-2 flex items-center gap-1">
                                    <span className="bg-green-100 p-0.5 rounded">↗</span> {stat.change} <span className="text-gray-400 font-medium">from last month</span>
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Sales / Chart Area */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Revenue Analytics</h3>
                            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm font-bold text-gray-600 outline-none">
                                <option>Last 30 Days</option>
                                <option>This Week</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="flex-grow bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                            <div className="text-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                                <p className="font-medium">Chart Visualization Placeholder</p>
                                <p className="text-sm">Revenue trends will appear here.</p>
                            </div>
                        </div>
                    </div>

                    {/* Live Events List */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Your Live Events</h3>
                        <div className="space-y-6">
                            {[
                                { title: "Summer Music Festival", date: "Oct 24, 2026", sold: "85%", status: "Selling Fast", img: "https://images.unsplash.com/photo-1459749411177-287ce63e3ba9?auto=format&fit=crop&q=80&w=200" },
                                { title: "Tech Innovators Summit", date: "Nov 12, 2026", sold: "45%", status: "On Track", img: "https://images.unsplash.com/photo-1540575467063-17e6fc8c62d8?auto=format&fit=crop&q=80&w=200" }
                            ].map((event, i) => (
                                <div key={i} className="flex gap-4 items-center group cursor-pointer">
                                    <img src={event.img} alt={event.title} className="w-16 h-16 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{event.title}</h4>
                                        <p className="text-xs text-gray-500 mb-2">{event.date}</p>
                                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-green-500 h-full rounded-full" style={{ width: event.sold }}></div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[10px] font-bold text-gray-400">{event.sold} Sold</span>
                                            <span className="text-[10px] font-bold text-green-600">{event.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            View All Events
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PartnerDashboard;
