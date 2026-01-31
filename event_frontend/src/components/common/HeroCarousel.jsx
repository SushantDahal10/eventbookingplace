import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CAROUSEL_Slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1600",
        title: "KTM Rock Fest 2026",
        subtitle: "The biggest musical event of the year is here.",
        date: "Oct 26, 2026",
        eventId: 1 // Links to /booking/1
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600",
        title: "Neon Nights: EDM Blast",
        subtitle: "Experience the pulse of the city.",
        date: "Nov 12, 2026",
        eventId: 2
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1600",
        title: "Global Art Exhibition",
        subtitle: "Where culture meets creativity.",
        date: "Dec 05, 2026",
        eventId: 3
    }
];

const HeroCarousel = ({ slides = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const displaySlides = slides.length > 0 ? slides : [
        {
            id: 'mock-1',
            image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=1600",
            title: "Discover Local Events",
            subtitle: "Find the best experiences in your city.",
            date: "Anytime",
            eventId: null
        }
    ];

    // Auto-advance
    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-secondary">
            {/* Slides */}
            {displaySlides.map((slide, index) => (
                <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Image with Zoom Effect */}
                    <div className="absolute inset-0 bg-cover bg-center overflow-hidden">
                        <img
                            src={slide.image}
                            className={`w-full h-full object-cover transition-transform duration-[5000ms] ${index === currentSlide ? 'scale-110' : 'scale-100'
                                }`}
                            alt={slide.title}
                        />
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full max-w-[1200px] mx-auto px-4 flex flex-col justify-center text-white">
                        <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}>
                            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/50 text-white font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                Featured Event
                            </span>
                            <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-6 leading-tight max-w-4xl">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl font-light leading-relaxed">
                                {slide.subtitle || (slide.description ? (
                                    <>
                                        {slide.description.substring(0, 120)}...
                                        <Link to={`/events/${slide.id}`} className="text-primary font-bold hover:underline ml-2 text-lg">
                                            Read More
                                        </Link>
                                    </>
                                ) : "Discover the highlights of this amazing event.")} <br />
                                <span className="text-primary font-bold mt-4 inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-lg uppercase tracking-wider">
                                    {slide.date || (slide.event_date && new Date(slide.event_date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric'
                                    }))}
                                </span>
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {slide.id && slide.id !== 'mock-1' && (
                                    <>
                                        <Link
                                            to={`/booking/${slide.id}`}
                                            className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(255,77,0,0.5)] hover:shadow-[0_0_30px_rgba(255,77,0,0.8)] hover:scale-105 active:scale-95 flex items-center gap-2"
                                        >
                                            <span>🎟️</span> Book Ticket
                                        </Link>
                                        <Link
                                            to={`/events/${slide.id}`}
                                            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg rounded-full border border-white/30 transition-all hover:scale-105"
                                        >
                                            View Details
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            {displaySlides.length > 1 && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                    {displaySlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-10 bg-primary' : 'bg-white/50 hover:bg-white'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;
