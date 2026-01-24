import React, { useEffect } from 'react';
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
    image: "https://media.istockphoto.com/id/637268486/photo/patan.jpg?s=612x612&w=0&k=20&c=IHL_X9XMlTKCFjXMAdJTr3dLoJTN-Vvn5QsYfNtnkgc="
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

// Mapping Category Names to Query Params
const CATEGORIES = [
  { id: 1, name: "Concerts", slug: "Concert", icon: "🎉", color: "bg-purple-100 text-purple-600" },
  { id: 2, name: "Comedy", slug: "Comedy", icon: "🎙️", color: "bg-yellow-100 text-yellow-600" },
  { id: 3, name: "Sports", slug: "Sports", icon: "⚽", color: "bg-blue-100 text-blue-600" },
  { id: 4, name: "Music", slug: "Music", icon: "🎵", color: "bg-pink-100 text-pink-600" },
  { id: 5, name: "Workshop", slug: "Workshop", icon: "💡", color: "bg-green-100 text-green-600" },
];

const Home = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim font-body">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroCarousel />

        {/* Search Bar */}
        <SearchBar />

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 mt-20 mb-16 animate-[fadeIn_1s]">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-heading font-extrabold text-secondary mb-2">Explore Categories</h2>
              <p className="text-text-muted">Dive into the types of events you love.</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/events?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-36 md:w-48"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform ${cat.color}`}>
                  {cat.icon}
                </div>
                <span className="text-lg font-bold text-gray-700 group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Events */}
        <section className="max-w-7xl mx-auto px-4 mb-24 animate-[slideUp_1s]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-4xl font-heading font-extrabold text-secondary mb-2">Trending Now</h3>
              <p className="text-text-muted text-lg">Don't miss out on these popular upcoming experiences.</p>
            </div>
            <Link to="/events" className="hidden md:inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors text-lg group">
              View All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {POPULAR_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/events" className="inline-block btn-primary shadow-lg shadow-primary/20">
              Explore All Events
            </Link>
          </div>
        </section>

        {/* Promo Banner */}
        {/* <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="relative rounded-3xl overflow-hidden bg-secondary h-80 md:h-96 flex items-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-287ce63e3ba9?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent"></div>

            <div className="relative z-10 p-8 md:p-16 max-w-2xl">
              <span className="text-primary font-bold tracking-widest uppercase mb-2 block">Partner With Us</span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6">List Your Venue or Event</h2>
              <p className="text-gray-300 text-lg mb-8">Get access to thousands of daily users and manage your bookings effortlessly with our dashboard.</p>
              <Link to="/become-partner" className="inline-block bg-white text-secondary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-xl">
                Become a Partner
              </Link>
            </div>
          </div>
        </section> */}

      </main>

      <Footer />
    </div>
  );
};

export default Home;
