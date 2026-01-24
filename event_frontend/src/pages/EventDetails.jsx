import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { EVENTS } from "./mock";

const EventDetails = () => {
    const { id } = useParams();
    const event = EVENTS.find(e => e.id === Number(id));

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-bold">Event not found</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface-dim">
            <Navbar />

            <main className="flex-grow">
                {/* Hero */}
                <div className="relative h-[60vh] min-h-[500px]">
                    <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
                    />
                    <div className="absolute inset-0 bg-secondary/80"></div>

                    <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex items-center gap-12">
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-72 rounded-xl shadow-2xl"
                        />

                        <div className="text-white">
                            <h1 className="text-5xl font-extrabold mb-4">{event.title}</h1>
                            <p className="mb-2">{event.date} • {event.time}</p>
                            <p>{event.location}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card-premium p-8">
                            <h3 className="text-2xl font-bold mb-4">About Event</h3>
                            <p>{event.description}</p>

                            <div className="flex gap-2 mt-4">
                                {event.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="sticky top-24 card-premium p-6">
                        <p className="text-center text-gray-500 mb-2">Starting from</p>
                        <h2 className="text-4xl font-bold text-center mb-6">
                            Rs. {event.price}
                        </h2>

                        <Link
                            to={`/booking/${event.id}`}
                            className="block btn-primary text-center py-4"
                        >
                            Book Ticket Now
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetails;
