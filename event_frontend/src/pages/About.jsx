import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BigCarousel from '../components/common/BigCarousel';

// Carousel Slides
const ABOUT_SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600",
        title: "Who We Are",
        subtitle: "We are a team of dreamers, builders, and party-goers.",
        tag: "Our Story",
        primaryAction: { text: "Join our Team", link: "/chat", icon: "🤝" },
        secondaryAction: { text: "Contact Us", link: "/chat" }
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1522071820081-00ca6e303db2?auto=format&fit=crop&q=80&w=1600",
        title: "Our Mission",
        subtitle: "To revolutionize how Nepal experiences entertainment.",
        tag: "Vision",
    }
];

const About = () => {
    return (
        <div className="min-h-screen flex flex-col bg-surface-dim font-body">
            <Navbar />

            <BigCarousel slides={ABOUT_SLIDES} />

            <main className="flex-grow max-w-[1200px] mx-auto px-4 py-16 -mt-20 relative z-10">
                <div className="card-premium p-10 md:p-16">
                    <section className="mb-16 text-center max-w-3xl mx-auto">
                        <span className="text-primary font-bold tracking-widest uppercase mb-4 block animate-[fadeIn_0.5s]">Our Story</span>
                        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-secondary mb-8 animate-[slideUp_0.8s]">
                            Connecting People Through Experiences
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed text-justify animate-[slideUp_1s]">
                            Founded in 2024, NepaliShows started with a simple idea: booking a concert ticket shouldn't be harder than attending it. We saw a gap in the market where incredible local events were struggling to reach the right audience, and fans were missing out due to clunky booking systems.
                            <br /><br />
                            Today, we are Nepal's fastest-growing event platform, partnering with the top clubs, venues, and organizers to bring you seamless access to the moments that matter.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            { count: "50k+", label: "Active Users" },
                            { count: "1,200+", label: "Events Hosted" },
                            { count: "98%", label: "Satisfaction Rate" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{stat.count}</div>
                                <div className="text-gray-500 font-bold uppercase tracking-wider text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <section>
                        <div className="relative rounded-3xl overflow-hidden h-96">
                            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Team" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8 md:p-12">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Built with ❤️ in Kathmandu</h3>
                                    <p className="text-gray-300">Our headquarters is just a stone's throw away from the events we love.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
