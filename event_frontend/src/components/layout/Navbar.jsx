import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CITIES = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan",
    "Biratnagar", "Dharan", "Butwal", "Nepalgunj", "Dhangadhi"
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [location, setLocation] = useState("Kathmandu");
    const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLocDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUseCurrentLocation = () => {
        setLocation("Detecting...");
        setTimeout(() => {
            // Simulate geolocation API
            setLocation("Lalitpur");
            setIsLocDropdownOpen(false);
        }, 1200);
    };

    const handleCitySelect = (city) => {
        setLocation(city);
        setIsLocDropdownOpen(false);
    };

    return (
        <header className="bg-secondary text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-[1200px] mx-auto px-4 h-16 flex justify-between items-center">

                {/* Logo & Location Container */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-heading font-bold text-primary">NepaliShows</span>
                    </Link>

                    {/* Location Picker */}
                    <div className="relative hidden md:block" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
                            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary group-hover:text-primary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{location}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transform transition-transform ${isLocDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {isLocDropdownOpen && (
                            <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 text-gray-800 animate-fadeIn">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <button
                                        onClick={handleUseCurrentLocation}
                                        className="flex items-center gap-2 text-primary font-bold text-sm w-full hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Use Current Location
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto px-2 py-2">
                                    <p className="px-2 text-xs text-gray-400 font-bold uppercase mb-2">Popular Cities</p>
                                    {CITIES.map(city => (
                                        <button
                                            key={city}
                                            onClick={() => handleCitySelect(city)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors ${location === city ? 'bg-gray-50 text-primary font-bold' : ''}`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/events" className="text-gray-300 hover:text-white transition-colors font-medium">Events</Link>
                    <Link to="/venues" className="text-gray-300 hover:text-white transition-colors font-medium">Venues</Link>
                    <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-medium">About</Link>
                    <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105">
                        Login
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-300 hover:text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden bg-secondary border-t border-gray-700">
                    <div className="flex flex-col p-4 gap-4">
                        <div className="flex items-center gap-2 text-gray-300 pb-4 border-b border-gray-700">
                            <span className="text-sm">Location:</span>
                            <button onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)} className="text-white font-bold flex items-center gap-1">
                                {location}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                        {/* Mobile Location Dropdown */}
                        {isLocDropdownOpen && (
                            <div className="bg-gray-800 rounded-lg p-2 mb-2">
                                <button onClick={handleUseCurrentLocation} className="w-full text-left p-2 text-primary text-sm hover:bg-gray-700 rounded">Use Current Location</button>
                                {CITIES.map(city => (
                                    <button key={city} onClick={() => handleCitySelect(city)} className="w-full text-left p-2 text-gray-300 text-sm hover:bg-gray-700 rounded">{city}</button>
                                ))}
                            </div>
                        )}

                        <Link to="/events" className="text-gray-300 hover:text-white font-medium">Events</Link>
                        <Link to="/venues" className="text-gray-300 hover:text-white font-medium">Venues</Link>
                        <Link to="/about" className="text-gray-300 hover:text-white font-medium">About</Link>
                        <Link to="/login" className="bg-primary text-white px-4 py-2 rounded text-center font-bold">Login</Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
