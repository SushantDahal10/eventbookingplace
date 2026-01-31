import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [chatEnded, setChatEnded] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [endReason, setEndReason] = useState(null); // 'user', 'inactivity'
    const [sessionState, setSessionState] = useState(null); // FSM State from backend
    const inactivityTimer = useRef(null);
    const initRequestId = useRef(0); // To prevent race conditions on initChat

    const DEFAULT_TIMEOUT = 10 * 60 * 1000; // 10 minutes
    const INPUT_TIMEOUT = 2 * 60 * 1000;   // 2 minutes

    const resetInactivityTimer = () => {
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

        const limit = pendingAction ? INPUT_TIMEOUT : DEFAULT_TIMEOUT;

        inactivityTimer.current = setTimeout(() => {
            setEndReason('inactivity');
            setChatEnded(true);
        }, limit);
    };

    useEffect(() => {
        if (chatEnded) {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            return;
        }

        resetInactivityTimer();
        const handleActivity = () => resetInactivityTimer();

        // Only track activity if not ended
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        return () => {
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, [chatEnded, pendingAction]); // Re-run when pendingAction changes to update timeout limit

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const initChat = async () => {
        // Increment request ID to invalidate previous attempts
        const currentReqId = ++initRequestId.current;

        setChatEnded(false);
        setMessages([]);
        setSessionState(null);
        setIsTyping(true);

        try {
            const response = await api.post('/support/chat', {
                userEmail: user?.email,
                intent: 'GREETING',
                sessionState: null
            });

            // Only update if this is still the latest request
            if (currentReqId === initRequestId.current) {
                setTimeout(() => {
                    // Check again inside timeout in case user clicked away fast
                    if (currentReqId === initRequestId.current) {
                        addAgentMessage(response.data);
                        setIsTyping(false);
                    }
                }, 600);
            }
        } catch (error) {
            console.error("Chat Init Error:", error);
            if (currentReqId === initRequestId.current) {
                setIsTyping(false);
                addAgentMessage({
                    message: "Hi! How can we help you today?",
                    type: "fallback"
                });
            }
        }
    };

    useEffect(() => {
        initChat();
        // Cleanup: invalidate current request on unmount/re-run
        return () => {
            initRequestId.current++;
        };
    }, [user]);

    // Message Rendering Update:
    /* Replace:
       <p className={`text-sm ...`}>{msg.text}</p>
       With:
       <div className={`text-sm ... prose prose-sm max-w-none`}>
           <ReactMarkdown>{msg.text}</ReactMarkdown>
       </div>
    */

    // ... inside addAgentMessage ...
    const addAgentMessage = (data) => {
        if (data.newState) {
            setSessionState(data.newState);
        }

        if (data.type === 'end_chat') {
            setChatEnded(true);
            return;
        }

        // Logic to focus input if waiting
        if (data.newState?.subState === 'WAITING_FOR_INPUT') {
            setPendingAction({ intent: data.intent, field: 'query' }); // Keep legacy consistent logic
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setPendingAction(null);
        }

        const msg = {
            id: Date.now(),
            sender: 'agent',
            text: data.message,
            options: data.options || [],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, msg]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input.trim();
        const userInputMsg = {
            id: Date.now(),
            sender: 'user',
            text: userText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userInputMsg]);
        setInput('');
        setIsTyping(true);

        try {
            let payload = {
                message: userText,
                userEmail: user?.email,
                sessionState: sessionState // Pass state
            };

            // If we have a pending specific action, we might still want to pass intent/data
            // But FSM backend mainly relies on state + message.
            // We'll pass pendingAction intent for compatibility if needed,
            // but primarily the backend should infer from state.
            if (pendingAction) {
                payload.intent = pendingAction.intent;
                payload.data = { [pendingAction.field]: userText }; // Legacy compat
            }

            const response = await api.post('/support/chat', payload);

            setTimeout(() => {
                addAgentMessage(response.data);
                setIsTyping(false);
            }, 600);

        } catch (error) {
            console.error("Chat Send Error:", error);
            setIsTyping(false);
            addAgentMessage({
                message: "We're having trouble connecting to the server. Please check your connection.",
                type: "fallback"
            });
        }
    };

    const handleOptionClick = async (option) => {
        if (option.value === 'END_CHAT') {
            setChatEnded(true);
            return;
        }

        const optionMsg = {
            id: Date.now(),
            sender: 'user',
            text: option.label,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, optionMsg]);
        setIsTyping(true);

        try {
            const response = await api.post('/support/chat', {
                intent: option.value,
                userEmail: user?.email,
                sessionState: sessionState // Pass state
            });

            setTimeout(() => {
                addAgentMessage(response.data);
                setIsTyping(false);
            }, 600);
        } catch (error) {
            console.error("Chat Option Error:", error);
            setIsTyping(false);
            addAgentMessage({
                message: "Something went wrong. Please try again.",
                type: "fallback"
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4 pt-24">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[75vh]">

                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                NS
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">NepaliShows Support</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Online
                                </p>
                            </div>
                        </div>

                        {!chatEnded && (
                            <button
                                onClick={() => {
                                    setEndReason('user');
                                    setChatEnded(true);
                                }}
                                className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                                title="End Chat Session"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Quit
                            </button>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-gray-50/50">
                        {chatEnded ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${endReason === 'inactivity' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {endReason === 'inactivity' ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {endReason === 'inactivity' ? 'Chat Closed Due to Inactivity' : 'Chat Session Ended'}
                                </h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    {endReason === 'inactivity'
                                        ? 'You were away for a while. Need more help?'
                                        : 'Thank you for contacting us. Have a great day!'}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={initChat}
                                        className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all text-sm"
                                    >
                                        Start New Chat
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all text-sm"
                                    >
                                        Go to Homepage
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center text-xs text-gray-400 my-4 font-medium uppercase tracking-wide">Today</div>

                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fadeIn`}>
                                        <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                            <div className={`p-4 rounded-2xl shadow-sm text-sm relative group ${msg.sender === 'user'
                                                ? 'bg-primary text-white rounded-br-none'
                                                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
                                                }`}>
                                                {/* Message Text with Markdown Support */}
                                                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                                </div>

                                                {/* Time Stamp */}
                                                <div className={`text-[10px] mt-2 mb-0.5 opacity-0 group-hover:opacity-70 transition-opacity absolute bottom-1 ${msg.sender === 'user' ? 'right-2 text-white/80' : 'left-2 text-gray-400'
                                                    }`}>
                                                    {msg.time}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Options Buttons */}
                                        {msg.sender === 'agent' && msg.options && msg.options.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                                                {msg.options.map((opt, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleOptionClick(opt)}
                                                        className="px-4 py-2 bg-white hover:bg-gray-50 border border-primary/20 text-primary text-xs font-semibold rounded-full transition-all active:scale-95 shadow-sm"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex gap-1 items-center h-10">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    {!chatEnded && (
                        <div className="p-4 bg-white border-t border-gray-200">
                            <form onSubmit={handleSend} className="flex gap-2 items-center">
                                <div className="flex-grow relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={pendingAction ? "Type your ID..." : "Type a message..."}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400 text-gray-800 text-sm ${pendingAction ? 'ring-2 ring-primary/10 border-primary/30' : ''
                                            }`}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`p-3 rounded-lg text-white transition-all transform active:scale-95 flex items-center justify-center ${input.trim()
                                        ? 'bg-primary shadow-sm hover:bg-primary/90'
                                        : 'bg-gray-200 cursor-not-allowed'
                                        }`}
                                    disabled={!input.trim()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Chat;
