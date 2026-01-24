import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auth State from Context
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const intentProfileRef = useRef(null);

    // Location State
    const [userLocation, setUserLocation] = useState('Kathmandu');
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    const location = useLocation();

    // Define routes that have a dark hero section
    const hasHeroSection =
        location.pathname === '/' ||
        location.pathname === '/events' ||
        location.pathname === '/venues' ||
        location.pathname === '/about' ||
        /^\/events\/\d+$/.test(location.pathname) ||
        /^\/venues\/\d+$/.test(location.pathname);

    const isLightNav = !hasHeroSection;

    // Handle Scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close Dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (intentProfileRef.current && !intentProfileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
        setIsLocationModalOpen(false);
    }, [location]);

    const handleUseCurrentLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                setTimeout(() => {
                    setUserLocation("Lalitpur, Current");
                    setIsDetecting(false);
                    setIsLocationModalOpen(false);
                }, 1500);
            }, (error) => {
                setTimeout(() => {
                    setUserLocation("Near Me");
                    setIsDetecting(false);
                    setIsLocationModalOpen(false);
                }, 1000);
            });
        } else {
            toast.error("Geolocation is not available in your browser.");
            setIsDetecting(false);
        }
    };

    const handleSelectCity = (city) => {
        setUserLocation(city);
        setIsLocationModalOpen(false);
    };

    // Helper to check active state
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Events', path: '/events' },
        // { label: 'Venues', path: '/venues' },
        { label: 'About', path: '/about' }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLightNav
                    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 border-b border-gray-100'
                    : (isScrolled ? 'bg-secondary/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5')
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex items-center justify-between">

                        {/* Logo */}
                        <Link to="/" className={`text-2xl font-heading font-extrabold tracking-tight transition-colors ${isLightNav ? 'text-secondary' : 'text-white'
                            }`}>
                            Nepali<span className="text-primary">Shows</span>
                        </Link>

                        {/* Location Badge */}
                        <div
                            onClick={() => setIsLocationModalOpen(true)}
                            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer group select-none ${isLightNav
                                ? 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-700'
                                : 'bg-white/10 border-white/10 hover:bg-white/20 text-gray-200 group-hover:text-white'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium">{userLocation}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map(item => {
                                const active = isActive(item.path);
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`font-medium transition-all relative ${
                                            // Base colors
                                            isLightNav
                                                ? (active ? 'text-primary' : 'text-gray-600 hover:text-gray-900')
                                                : (active ? 'text-white' : 'text-gray-300 hover:text-white')
                                            }`}
                                    >
                                        {item.label}
                                        {/* Active Indicator Dot */}
                                        {active && (
                                            <span className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLightNav ? 'bg-primary' : 'bg-white'
                                                }`}></span>
                                        )}
                                    </Link>
                                );
                            })}

                            {isLoggedIn ? (
                                <div className="relative" ref={intentProfileRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 focus:outline-none"
                                    >
                                        <div className={`p-[2px] rounded-full border transition-colors ${isLightNav ? 'border-gray-200' : 'border-primary'}`}>
                                            <img
                                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                                                alt="User"
                                                className="w-9 h-9 rounded-full object-cover hover:scale-105 transition-transform"
                                            />
                                        </div>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-[scaleIn_0.2s] origin-top-right ring-1 ring-black ring-opacity-5">
                                            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                                                    {(user?.fullName || user?.full_name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-gray-900 text-sm truncate">{user?.fullName || user?.full_name || 'User'}</h4>
                                                    <p className="text-xs text-gray-500 truncate" title={user?.email}>{user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="py-2">
                                                <Link to="/profile/bookings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-3">
                                                    <span>🎟️</span> My Bookings
                                                </Link>
                                                <Link to="/chat" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors flex items-center gap-3">
                                                    <span>💬</span> Chat with Us
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 p-2">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsLoggedIn(false); // Update local state if needed (though context handles it)
                                                    }}
                                                    className="w-full text-center py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/30">
                                    Login
                                </Link>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden focus:outline-none ${isLightNav ? 'text-secondary' : 'text-white'}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl animate-[fadeIn_0.3s]">
                            {/* Mobile Location Selector */}
                            <div className="px-2 pb-4 mb-4 border-b border-gray-100" onClick={() => setIsLocationModalOpen(true)}>
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{userLocation}</span>
                                    <span className="text-xs text-gray-400 font-normal">(Change)</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {navItems.map(item => (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`font-medium px-2 py-1 ${isActive(item.path) ? 'text-primary font-bold' : 'text-gray-700'}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                                {isLoggedIn ? (
                                    <>
                                        <div className="h-px bg-gray-100 my-2"></div>
                                        <Link to="/profile/bookings" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:text-primary font-medium px-2 py-1 flex items-center gap-2">
                                            <span>🎟️</span> My Bookings
                                        </Link>
                                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-500 font-medium text-left px-2 py-1">Logout</button>
                                    </>
                                ) : (
                                    <Link to="/login" className="bg-primary text-white px-4 py-3 rounded-xl text-center font-bold mt-2 shadow-lg shadow-primary/20">
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Location Selector Modal */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm transition-opacity" onClick={() => setIsLocationModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-[scaleIn_0.3s]">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Select Location</h3>
                                <button onClick={() => setIsLocationModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <button
                                onClick={handleUseCurrentLocation}
                                disabled={isDetecting}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors border border-primary/20 mb-6 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {isDetecting ? (
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold">Use Current Location</span>
                                    <span className="text-xs opacity-70">Automatically detect where you are</span>
                                </div>
                            </button>

                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Cities</p>
                                {['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan'].map(city => (
                                    <button
                                        key={city}
                                        onClick={() => handleSelectCity(city)}
                                        className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex justify-between items-center transition-colors ${userLocation.includes(city) ? 'text-primary font-bold bg-primary/5' : 'text-gray-700 font-medium'
                                            }`}
                                    >
                                        {city}
                                        {userLocation.includes(city) && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
