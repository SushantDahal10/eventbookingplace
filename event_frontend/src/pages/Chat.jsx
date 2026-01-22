import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'agent',
            text: 'Namaste! 🙏 Welcome to NepaliShows Premium Support.',
            time: '09:41 AM'
        },
        {
            id: 2,
            sender: 'agent',
            text: 'I am your personal concierge. How can I assist you with your bookings today?',
            time: '09:42 AM'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newUserMsg = { id: Date.now(), sender: 'user', text: input, time: now };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setIsTyping(true);

        // Simulated intelligent agent response
        setTimeout(() => {
            setIsTyping(false);
            const reply = {
                id: Date.now() + 1,
                sender: 'agent',
                text: "I've received your request! Let me pull up your details right away. One moment please... ✨",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <div className="h-screen flex flex-col bg-surface-dim font-body overflow-hidden">
            <Navbar />

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

            <main className="flex-grow flex items-center justify-center p-4 pt-24 relative z-10">
                <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col h-[80vh] relative animate-[scaleIn_0.4s]">

                    {/* Header */}
                    <div className="bg-white/90 backdrop-blur-md p-5 border-b border-gray-100 flex items-center justify-between z-10 shadow-sm sticky top-0">
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-primary to-orange-300">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover border-2 border-white" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">Sarah Support</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <p className="text-xs text-green-600 font-bold">Online • Replies instantly</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2m0 7a1 1 0 110-2 1 1 0 010 2m0 7a1 1 0 110-2 1 1 0 010 2" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-[#f8f9fa] to-white scroll-smooth relative">

                        <div className="flex justify-center py-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm">Today</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.3s]`}>
                                {msg.sender === 'agent' && (
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 border border-gray-200" />
                                )}

                                <div className={`max-w-[75%] relative group`}>
                                    <div className={`p-4 text-[15px] leading-relaxed shadow-sm ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-primary to-orange-600 text-white rounded-2xl rounded-tr-none shadow-orange-500/20'
                                            : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-gray-200/50'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className={`text-[10px] absolute -bottom-5 font-bold ${msg.sender === 'user' ? 'right-2 text-gray-400' : 'left-2 text-gray-400'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        {msg.time} • {msg.sender === 'user' ? 'Read' : 'Sent'}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start animate-[fadeIn_0.3s]">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100" className="w-8 h-8 rounded-full object-cover mr-2 self-end mb-1 border border-gray-200" />
                                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1.5 items-center h-12">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 backdrop-blur-lg">
                        <form onSubmit={handleSend} className="flex gap-2 items-end">
                            <button type="button" className="p-3 mb-1 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                            <div className="flex-grow relative">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="w-full pl-5 pr-12 py-3.5 bg-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-500 text-gray-800"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                type="submit"
                                className={`p-3.5 mb-0.5 rounded-full text-white transition-all shadow-lg transform active:scale-95 flex items-center justify-center ${input.trim()
                                        ? 'bg-gradient-to-r from-primary to-orange-600 shadow-orange-500/30'
                                        : 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
                                    }`}
                                disabled={!input.trim()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 translate-x-0.5 translate-y-[-1px]" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Chat;
