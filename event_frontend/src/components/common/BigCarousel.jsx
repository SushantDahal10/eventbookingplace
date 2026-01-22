import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BigCarousel = ({ slides, autoPlayInterval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance
    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, autoPlayInterval);
        return () => clearInterval(timer);
    }, [slides, autoPlayInterval]);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="relative h-[85vh] w-full overflow-hidden bg-secondary">
            {/* Slides */}
            {slides.map((slide, index) => (
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
                            {slide.tag && (
                                <span className="inline-block px-4 py-2 rounded-full bg-primary/20 border border-primary/50 text-white font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                                    {slide.tag}
                                </span>
                            )}
                            <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-6 leading-tight max-w-4xl">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl font-light">
                                {slide.subtitle} <br />
                                {slide.extraInfo && <span className="text-primary font-bold mt-2 display-block">{slide.extraInfo}</span>}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {slide.primaryAction && (
                                    <Link
                                        to={slide.primaryAction.link}
                                        className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(255,77,0,0.5)] hover:shadow-[0_0_30px_rgba(255,77,0,0.8)] hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        {slide.primaryAction.icon && <span>{slide.primaryAction.icon}</span>}
                                        {slide.primaryAction.text}
                                    </Link>
                                )}
                                {slide.secondaryAction && (
                                    <Link
                                        to={slide.secondaryAction.link}
                                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg rounded-full border border-white/30 transition-all hover:scale-105"
                                    >
                                        {slide.secondaryAction.text}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-10 bg-primary' : 'bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BigCarousel;
