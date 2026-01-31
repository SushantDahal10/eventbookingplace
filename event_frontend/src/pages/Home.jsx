import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import SearchBar from '../components/common/SearchBar';
import EventCard from '../features/events/components/EventCard';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedCity = localStorage.getItem('userLocation') || 'Kathmandu';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Events
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch events filtered by selected city
        const cityFilter = selectedCity === 'All' ? '' : selectedCity;
        const response = await api.get(`/events?city=${cityFilter}`);

        if (response.data.success) {
          const fetchedEvents = response.data.events.map(event => ({
            ...event,
            image: event.event_images?.find(img => img.image_type === 'cover')?.image_url || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=600"
          }));
          setEvents(fetchedEvents);

          // Derive categories from fetched events or use static list with real links
          const mockCats = [
            { name: "Concerts", slug: "Concert", icon: "🎉", color: "bg-purple-100 text-purple-600" },
            { name: "Comedy", slug: "Comedy", icon: "🎙️", color: "bg-yellow-100 text-yellow-600" },
            { name: "Sports & Fitness", slug: "Sports & Fitness", icon: "⚽", color: "bg-blue-100 text-blue-600" },
            { name: "Music", slug: "Music", icon: "🎵", color: "bg-pink-100 text-pink-600" },
            { name: "Business", slug: "Business", icon: "💡", color: "bg-green-100 text-green-600" },
          ];
          setCategories(mockCats);
        }
      } catch (error) {
        console.error("Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();

    // Listen for location changes
    const handleLocationChange = () => fetchHomeData();
    window.addEventListener('locationChanged', handleLocationChange);
    return () => window.removeEventListener('locationChanged', handleLocationChange);
  }, [selectedCity]);

  const shuffledEventsForHero = React.useMemo(() => {
    return [...events].sort(() => 0.5 - Math.random());
  }, [events]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-dim font-body">
      <Navbar />

      <main className="flex-grow">
        {/* Dynamic Hero Section */}
        <HeroCarousel slides={shuffledEventsForHero.slice(0, 3)} />

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
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/events?category=${encodeURIComponent(cat.slug)}&city=${selectedCity}`}
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
        <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-4xl font-heading font-extrabold text-secondary mb-2">Trending in {selectedCity}</h3>
              <p className="text-text-muted text-lg">Top picks for you in this city.</p>
            </div>
            <Link to={`/events?city=${selectedCity}`} className="hidden md:inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors text-lg group">
              View All Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No events found in {selectedCity} yet.</p>
              <Link to="/events" className="text-primary font-bold hover:underline">Browse all events instead</Link>
            </div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/events" className="inline-block btn-primary shadow-lg shadow-primary/20">
              Explore All Events
            </Link>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default Home;
