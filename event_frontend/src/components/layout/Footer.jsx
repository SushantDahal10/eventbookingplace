import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-secondary text-gray-400 py-12 mt-auto">
            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-1">
                    <h5 className="text-white text-xl font-bold font-heading mb-4">NepaliShows</h5>
                    <p className="text-sm leading-relaxed">
                        Discover and book the best experiences in Nepal. From rock concerts to comedy nights, we have it all.
                    </p>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h5>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/events" className="hover:text-primary transition-colors">Find Events</Link></li>
                        {/* <li><Link to="/venues" className="hover:text-primary transition-colors">Browse Venues</Link></li> */}
                        <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                        {/* <li><Link to="/become-partner" className="text-primary hover:text-white font-bold transition-colors">Become a Partner</Link></li> */}
                    </ul>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Us</h5>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <span className="block text-gray-500 text-xs">Email</span>
                            <a href="mailto:support@nepalishows.com" className="hover:text-white">support@nepalishows.com</a>
                        </li>
                        <li>
                            <span className="block text-gray-500 text-xs">Phone</span>
                            <a href="tel:+97714000000" className="hover:text-white">+977-1-4XXXXXX</a>
                        </li>
                        <li>
                            <span className="block text-gray-500 text-xs">Address</span>
                            Kathmandu, Nepal
                        </li>
                    </ul>
                </div>

                <div>
                    <h5 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Follow Us</h5>
                    <div className="flex gap-4">
                        {/* Social Placeholders */}
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors text-white">
                            <span className="sr-only">Facebook</span>
                            F
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors text-white">
                            <span className="sr-only">Instagram</span>
                            I
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors text-white">
                            <span className="sr-only">Twitter</span>
                            T
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs">
                <p>&copy; {new Date().getFullYear()} NepaliShows. All rights reserved.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
