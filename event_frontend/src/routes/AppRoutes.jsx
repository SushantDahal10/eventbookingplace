import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import EventDetails from '../pages/EventDetails';
import Events from '../pages/Events';
import About from '../pages/About';
import Venues from '../pages/Venues';
import VenueDetails from '../pages/VenueDetails';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
        </Routes>
    );
};

export default AppRoutes;
