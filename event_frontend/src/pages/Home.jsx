import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import SearchBar from '../components/common/SearchBar';
import EventCard from '../features/events/components/EventCard';
import { Link } from 'react-router-dom';

// Dummy data for events
const POPULAR_EVENTS = [
  {
    id: 1,
    title: "KTM Rock Fest",
    date: "Oct 26, 2026",
    location: "Dasarath Stadium, KTM",
    category: "Concert",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Patan Comedy Night",
    date: "Nov 02, 2026",
    location: "Patan Durbar Square",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1662999332578-1a5554de0171?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Lalitpur Futsal League",
    date: "Nov 10, 2026",
    location: "Lalitpur Futsal Arena",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Jazz at the Mandala",
    date: "Nov 15, 2026",
    location: "Mandala Theater",
    category: "Music",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&q=80&w=600"
  }
];

// Mapping Category Names to Query Params if needed, but simple string matching works best for this demo
const CATEGORIES = [
  { id: 1, name: "Concerts", slug: "Concert", icon: "🎉" },
  { id: 2, name: "Comedy", slug: "Comedy", icon: "🎙️" },
  { id: 3, name: "Sports & Turf", slug: "Sports", icon: "⚽" },
  { id: 4, name: "Music", slug: "Music", icon: "🎵" }, // Changed Theater to Music to match request
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Search Bar */}
        <SearchBar />

        {/* Categories */}
        <section className="max-w-[1200px] mx-auto px-4 mt-16 mb-12">
          <div className="flex flex-wrap justify-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/events?category=${cat.slug}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-secondary font-medium"
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Events */}
        <section className="max-w-[1200px] mx-auto px-4 mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-2">Popular Upcoming Events</h3>
              <p className="text-gray-500">Don't miss out on these trending events</p>
            </div>
            <Link to="/events" className="hidden md:inline-flex items-center text-primary font-bold hover:underline">
              View All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {POPULAR_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="inline-block border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-50">
              View All Events
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
