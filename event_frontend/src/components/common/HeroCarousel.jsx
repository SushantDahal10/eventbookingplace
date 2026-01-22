import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroCarousel = () => {
    const slides = [
        {
            id: 1,
            title: "Live Concerts",
            subtitle: "Experience the magic of live music",
            image: "https://images.unsplash.com/photo-1459749411177-229353b48002?auto=format&fit=crop&q=80&w=1200", // Placeholder
            color: "from-purple-900 to-indigo-900"
        },
        {
            id: 2,
            title: "Stand-Up Comedy",
            subtitle: "Laugh your heart out with top comedians",
            image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1200",
            color: "from-orange-900 to-red-900"
        },
        {
            id: 3,
            title: "Sports & Futsal",
            subtitle: "Book your turf and play your game",
            image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=1200",
            color: "from-green-900 to-emerald-900"
        }
    ];

    return (
        <div className="w-full relative group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                // navigation // Default navigation arrows
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                effect={'fade'}
                className="w-full h-[500px] md:h-[600px] rounded-b-[40px] overflow-hidden shadow-2xl"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br ${slide.color}`}>
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                                />
                                <div className="absolute inset-0 bg-black/30"></div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-10">
                                <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 tracking-tight drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="text-xl md:text-2xl font-light text-gray-200 max-w-2xl mx-auto drop-shadow-md">
                                    {slide.subtitle}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons (Optional enhancement) */}
            {/* <div className="swiper-button-prev !text-white !font-bold"></div>
            <div className="swiper-button-next !text-white !font-bold"></div> */}
        </div>
    );
};

export default HeroCarousel;
