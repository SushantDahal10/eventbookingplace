import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PartnerNavbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', path: '/partner/dashboard', icon: '📊' },
        { label: 'My Events', path: '/partner/events', icon: '📅' },
        { label: 'Create Event', path: '/partner/create', icon: '➕' },
        { label: 'Earnings', path: '/partner/earnings', icon: '💰' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm font-body">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo - Distinct "Partner" branding */}
                    <Link to="/partner/dashboard" className="flex items-center gap-2">
                        <div className="bg-secondary text-white p-1 rounded font-bold font-heading text-lg">NS</div>
                        <span className="text-xl font-heading font-bold text-secondary">
                            Partner<span className="text-primary">Portal</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isActive(item.path)
                                        ? 'bg-secondary text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side - Profile / Notifications */}
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-secondary transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="h-8 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <span className="block text-sm font-bold text-gray-900">Acme Events</span>
                                <span className="block text-xs text-gray-500">Organizer</span>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
                                alt="Org"
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PartnerNavbar;
