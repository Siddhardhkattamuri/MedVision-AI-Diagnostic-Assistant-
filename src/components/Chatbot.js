import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { knowledgeBase } from '../chat/knowledgeBase';
import './Chatbot.css';

// Change the chat icon to a doctor emoji with white skin 🧑🏻‍⚕️
const ChatBubbleIcon = () => (
    <span style={{ fontSize: '44px' }}>🧑🏻‍⚕️</span>
);

const Chatbot = ({ prediction }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [context, setContext] = useState('default');
    const [locationInput, setLocationInput] = useState('');
    const chatEndRef = useRef(null);

    // Effect to auto-scroll to the latest message
    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to allow content to render
    };
    useEffect(scrollToBottom, [messages]);

    // Effect to reset the chat when a new diagnosis is received
    useEffect(() => {
        if (prediction) {
            const newContext = prediction.class.toLowerCase();
            setContext(newContext);
            // Set the initial greeting message. The user then clicks a quick reply.
            setMessages([{ from: 'bot', text: knowledgeBase[newContext]?.greeting }]);
        } else {
            // Fully reset the chatbot if there's no prediction
            setContext('default');
            setMessages([]);
            setIsOpen(false);
        }
    }, [prediction]);

    // This handles clicking on a predefined question button.
    const handleQuickReply = (reply) => {
        // Add the user's chosen question and the pre-written answer to the chat.
        setMessages(prev => [...prev, { from: 'user', text: reply.question }, { from: 'bot', text: reply.answer }]);
    };
    
    // This handles the specific "Find a doctor" button click.
    const handleFindDoctor = () => {
        setMessages(prev => [
            ...prev,
            { from: 'user', text: "Find a doctor near me" },
            { from: 'bot', text: "Of course. Please type your city or area in the input box below and press 'Send'." }
        ]);
    };

    // --- MODIFICATION IS HERE ---
    // This is ONLY for the location form submission.
    const handleLocationSubmit = (e) => {
        e.preventDefault();
        if (!locationInput) return;

        // 1. Map diseases to medical specialists for a smarter search.
        const specialistMap = {
            pneumonia: "Pulmonologist", // Lung specialist
            tuberculosis: "Infectious Disease Specialist", // TB specialist
            normal: "General Practitioner" // For check-ups
        };

        // 2. Get the right specialist from the map based on the current diagnosis.
        const specialist = specialistMap[context] || "doctor";
        
        // 3. Create a more specific and helpful search query.
        const query = encodeURIComponent(`${specialist} near ${locationInput}`);
        const link = `https://www.google.com/maps/search/?api=1&query=${query}`;
        
        const userMessage = { from: 'user', text: locationInput };
        // 4. Update the link text to be more informative to the user.
        const botMessage = { from: 'bot', text: <a href={link} target="_blank" rel="noopener noreferrer">Click here to find a {specialist.toLowerCase()}</a> };
        
        setMessages(prev => [...prev, userMessage, botMessage]);
        setLocationInput('');
    };

    return (
        <>
            <motion.div
                className={`floating-chat-button ${prediction && !isOpen ? 'notify' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <ChatBubbleIcon />
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    >
                        <div className="chat-header">
                            <h3>AI Health Assistant</h3>
                            <button onClick={() => setIsOpen(false)}>×</button>
                        </div>

                        {/* The body only contains the conversation messages */}
                        <div className="chat-body">
                            {messages.map((msg, index) => (
                                <motion.div key={index} className={`chat-message ${msg.from}`}>
                                    {msg.text}
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                        
                        {/* The footer contains all user actions: quick replies and location */}
                        <div className="chat-footer">
                            <AnimatePresence>
                                {/* Only show quick replies if there is a diagnosis context */}
                                {context !== 'default' && (
                                    <motion.div
                                        className="quick-replies"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1, transition: {delay: 0.2} }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        {knowledgeBase[context]?.questions.map((q, i) =>
                                            <button key={i} onClick={() => handleQuickReply(q)}>{q.question}</button>
                                        )}
                                        <button onClick={handleFindDoctor}>Find a doctor near me</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form className="location-form" onSubmit={handleLocationSubmit}>
                                <input
                                    type="text"
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    placeholder="Enter location to find a doctor..."
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;