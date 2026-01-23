import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import EventDetails from '../pages/EventDetails';
import Events from '../pages/Events';
import About from '../pages/About';
// import Venues from '../pages/Venues';
// import VenueDetails from '../pages/VenueDetails';
// import VenueCalendar from '../pages/VenueCalendar';
// import VenueBooking from '../pages/VenueBooking';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import Booking from '../pages/Booking';
import Terms from '../pages/Terms';
import Privacy from '../pages/Privacy';
import MyBookings from '../pages/MyBookings';
import Chat from '../pages/Chat';
// import BecomePartner from '../pages/BecomePartner';
// import PartnerDashboard from '../pages/partner/PartnerDashboard';
// import CreateEvent from '../pages/partner/CreateEvent';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/venues" element={<Venues />} /> */}
            {/* <Route path="/venues/:id" element={<VenueDetails />} /> */}
            {/* <Route path="/venues/:id/calendar" element={<VenueCalendar />} /> */}
            {/* <Route path="/venues/:id/book" element={<VenueBooking />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/booking/:eventId" element={<Booking />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile/bookings" element={<MyBookings />} />
            <Route path="/chat" element={<Chat />} />
            {/* <Route path="/become-partner" element={<BecomePartner />} /> */}

            {/* Partner Routes */}
            {/* <Route path="/partner/dashboard" element={<PartnerDashboard />} /> */}
            {/* <Route path="/partner/create" element={<CreateEvent />} /> */}
        </Routes>
    );
};

export default AppRoutes;
